'use client';

import { useState, useEffect, useRef } from 'react';
import { FiAward, FiUsers, FiStar, FiPlus, FiTrash2, FiEdit, FiSearch, FiRefreshCw, FiImage, FiSave, FiArrowLeft } from 'react-icons/fi';
import Swal from 'sweetalert2';
import Image from 'next/image';
import styles from '../dashboard.module.css';

export default function AdminJuara() {
  const [juaraList, setJuaraList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const [formData, setFormData] = useState({
    id: null, title: '', student: '', category: 'KIS 1', year: new Date().getFullYear().toString(), image: '',
    competition: '', organizer: '', location: '', date: '', description: '', achievements: '', teacher: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/juara');
      if (res.ok) { const data = await res.json(); setJuaraList(data); setFilteredList(data); }
      setLoading(false);
    } catch (error) { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const results = juaraList.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.student.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredList(results);
  }, [searchTerm, juaraList]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      Swal.fire({ title: 'Menyimpan...', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); }});
      let finalImageUrl = formData.image;
      if (imageFile) {
        const uploadData = new FormData(); uploadData.append('file', imageFile);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData });
        if (!uploadRes.ok) throw new Error('Gagal upload gambar');
        finalImageUrl = (await uploadRes.json()).url; 
      }

      // 🔥 PASTIKAN TANGGAL BERUBAH JADI FORMAT INDONESIA SEBELUM DISAVE (Opsional)
      // Kalau lu biarin format YYYY-MM-DD juga gapapa, nanti bisa diolah di frontend
      
      const payload = { ...formData, image: finalImageUrl };
      const res = await fetch('/api/juara', { method: formData.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

      if (res.ok) {
        Swal.fire('Berhasil!', 'Data Prestasi berhasil disimpan.', 'success');
        setIsFormOpen(false); resetForm(); fetchData();
      } else { Swal.fire('Error', 'Gagal menyimpan data', 'error'); }
    } catch (error) { Swal.fire('Error', 'Terjadi kesalahan sistem', 'error'); }
  };

  const handleDelete = async (id, title) => {
    const { value: confirmed } = await Swal.fire({ title: 'Hapus Prestasi?', text: `Yakin hapus "${title}"?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc2626' });
    if (confirmed) {
      const res = await fetch('/api/juara', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      if (res.ok) { Swal.fire('Terhapus!', 'Data berhasil dihapus.', 'success'); fetchData(); }
    }
  };

  const handleEdit = (item) => {
    setFormData({
      ...item,
      competition: item.competition || '', organizer: item.organizer || '', location: item.location || '',
      date: item.date || '', description: item.description || '', achievements: item.achievements || '', teacher: item.teacher || ''
    });
    setImagePreview(item.image || ''); setImageFile(null);
    if (item.category !== 'KIS 1' && item.category !== 'KIS 2') { setIsCustomCategory(true); } else { setIsCustomCategory(false); }
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setFormData({ id: null, title: '', student: '', category: 'KIS 1', year: new Date().getFullYear().toString(), image: '', competition: '', organizer: '', location: '', date: '', description: '', achievements: '', teacher: '' });
    setImageFile(null); setImagePreview(''); setIsCustomCategory(false);
  };

  if (loading && !isFormOpen) return <div className={styles.container}><div className={styles.loading}>Memuat Data Prestasi...</div></div>;

  return (
    <div className={styles.container}>
      {isFormOpen ? (
        <div style={{ background: 'white', padding: '5%', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', maxWidth: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
            <h2 style={{ margin: 0, color: '#0F6DA1', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
              <FiAward /> {formData.id ? 'Edit Prestasi' : 'Tambah Prestasi Baru'}
            </h2>
            <button onClick={() => { setIsFormOpen(false); resetForm(); }} className={styles.btnOutline} style={{ padding: '8px 12px' }}><FiArrowLeft /> Kembali</button>
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* INFO DASAR */}
            <h3 style={{ fontSize: '1rem', color: '#32BAFA', borderBottom: '2px solid #f1f5f9', paddingBottom: '5px' }}>Informasi Dasar</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '5px' }}>Penghargaan Utama (Utk Judul Kartu) *</label>
                <input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="Contoh: Juara 1 Cerdas Cermat" />
              </div>
              <div>
                <label style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '5px' }}>Nama Siswa / Tim *</label>
                <input required type="text" value={formData.student} onChange={(e) => setFormData({...formData, student: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="Contoh: Budi & Tono" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '5px' }}>Kategori / Tingkat *</label>
                <select value={isCustomCategory ? 'Lainnya' : formData.category} onChange={(e) => { if(e.target.value === 'Lainnya') { setIsCustomCategory(true); setFormData({...formData, category: ''}); } else { setIsCustomCategory(false); setFormData({...formData, category: e.target.value}); } }} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white' }}>
                  <option value="KIS 1">KIS 1</option>
                  <option value="KIS 2">KIS 2</option>
                  <option value="Lainnya">Kategori Lainnya (Custom)</option>
                </select>
                {isCustomCategory && <input required type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #32BAFA', marginTop: '10px' }} placeholder="Ketik kategori baru (contoh: Guru, TK)" />}
              </div>
              <div>
                <label style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '5px' }}>Tahun *</label>
                <input required type="text" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
            </div>

            {/* INFO DETAIL (MODAL) */}
            <h3 style={{ fontSize: '1rem', color: '#32BAFA', borderBottom: '2px solid #f1f5f9', paddingBottom: '5px', marginTop: '1rem' }}>Detail Lengkap (Utk Pop-up Modal)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '5px' }}>Nama Acara / Kompetisi</label>
                <input type="text" value={formData.competition} onChange={(e) => setFormData({...formData, competition: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="Ex: Olimpiade Sains Nasional" />
              </div>
              <div>
                <label style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '5px' }}>Penyelenggara</label>
                <input type="text" value={formData.organizer} onChange={(e) => setFormData({...formData, organizer: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="Ex: Kemendikbud" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '5px' }}>Tempat Pelaksanaan</label>
                <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="Ex: Jakarta Selatan" />
              </div>
              <div>
                <label style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '5px' }}>Tanggal Spesifik</label>
                {/* 🔥 FIX: type="date" biar keluar kalender! */}
                <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'text' }} />
              </div>
              <div>
                <label style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '5px' }}>Guru Pembimbing</label>
                <input type="text" value={formData.teacher} onChange={(e) => setFormData({...formData, teacher: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="Ex: Pak Budi, S.Pd" />
              </div>
            </div>

            <div>
              <label style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '5px' }}>Badge Pencapaian (Pisahkan dengan koma)</label>
              <input type="text" value={formData.achievements} onChange={(e) => setFormData({...formData, achievements: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="Ex: Juara Umum, Fair Play Award" />
            </div>

            <div>
              <label style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '5px' }}>Deskripsi Singkat Prestasi</label>
              <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', minHeight: '100px' }} placeholder="Ceritakan singkat tentang keberhasilan ini..."></textarea>
            </div>

            {/* GAMBAR */}
            <div>
              <label style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '5px' }}>Dokumentasi / Foto Piala</label>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                 {imagePreview ? (
                    <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                       <Image src={imagePreview} alt="Preview" fill style={{objectFit: 'cover'}} />
                    </div>
                 ) : (
                    <div style={{ width: '120px', height: '120px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', border: '1px dashed #cbd5e1' }}>
                       <FiImage size={32} />
                    </div>
                 )}
                 <div><button type="button" onClick={() => fileInputRef.current.click()} className={styles.btnOutline} style={{ padding: '8px 15px' }}>Pilih Foto Prestasi</button></div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
              <button type="submit" className={styles.btnPrimary} style={{ padding: '12px 24px', fontSize: '1rem' }}><FiSave /> {formData.id ? 'Simpan' : 'Tambahkan'}</button>
            </div>
          </form>
        </div>
      ) : (
      <>
        {/* BAGIAN TABEL TETAP SAMA KAYAK SEBELUMNYA */}
        <div className={styles.pageHeader}>
          <div><h2 className={styles.pageTitle}>Manajemen Prestasi</h2><p className={styles.pageSubtitle}>Kelola data prestasi siswa Kaffah Islamic School.</p></div>
          <div className={styles.lastUpdateInfo} onClick={fetchData}><FiRefreshCw style={{cursor: 'pointer'}} /> Refresh Data</div>
        </div>

        <div className={styles.tableContainer}>
          <div className={styles.actionBar}>
             <div className={styles.tableTitleArea}><h3 className={styles.tableTitle}>Daftar Juara</h3><span className={styles.badgeCount}>{filteredList.length} Data</span></div>
             <div className={styles.filterArea}>
                <div className={styles.searchWrapper}><FiSearch className={styles.searchIcon} /><input type="text" placeholder="Cari lomba atau siswa..." className={styles.searchInput} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
                <button onClick={() => setIsFormOpen(true)} className={styles.btnPrimary}><FiPlus /> Tambah Prestasi</button>
             </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead><tr><th>Tahun</th><th>Dokumentasi</th><th>Nama Lomba</th><th>Siswa / Tim</th><th>Kategori</th><th>Aksi</th></tr></thead>
              <tbody>
                {filteredList.map((item) => (
                  <tr key={item.id}>
                    <td><div className={styles.tdDate}>{item.year}</div></td>
                    <td>
                      {item.image ? (
                        <div style={{ position: 'relative', width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden' }}>
                           <Image src={item.image} alt="Thumb" fill style={{objectFit: 'cover'}} />
                        </div>
                      ) : <span style={{fontSize: '0.8rem', color: '#94a3b8'}}>- Kosong -</span>}
                    </td>
                    <td><div className={styles.tdName} style={{fontWeight: '600'}}>{item.title}</div></td>
                    <td><div style={{color: '#475569'}}>{item.student}</div></td>
                    <td><span style={{background: '#e0f2fe', color: '#0F6DA1', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold'}}>{item.category}</span></td>
                    <td><div style={{display: 'flex', gap: '8px'}}><button onClick={() => handleEdit(item)} className={styles.btnBlue} style={{padding: '0.5rem', borderRadius: '8px'}}><FiEdit /></button><button onClick={() => handleDelete(item.id, item.title)} className={styles.btnDelete}><FiTrash2 /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
      )}
    </div>
  );
}