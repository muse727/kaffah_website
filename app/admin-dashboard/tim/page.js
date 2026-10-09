'use client';

import { useState, useEffect, useRef } from 'react';
import { FiUsers, FiPlus, FiTrash2, FiEdit, FiSearch, FiRefreshCw, FiArrowLeft, FiSave, FiImage } from 'react-icons/fi';
import Swal from 'sweetalert2';
import Image from 'next/image';
import styles from '../dashboard.module.css';

export default function AdminTim() {
  const [timList, setTimList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [formData, setFormData] = useState({
    id: null, name: '', position: '', category: 'Guru KIS 1', image: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tim');
      if (res.ok) { const data = await res.json(); setTimList(data); setFilteredList(data); }
    } catch (error) { console.error(error); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);
  useEffect(() => {
    setFilteredList(timList.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [searchTerm, timList]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      Swal.fire({ title: 'Menyimpan...', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); }});
      
      let finalImage = formData.image;
      if (imageFile) {
        const uploadData = new FormData(); uploadData.append('file', imageFile);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData });
        if (uploadRes.ok) finalImage = (await uploadRes.json()).url;
      }

      const payload = { ...formData, image: finalImage };
      const res = await fetch('/api/tim', { method: formData.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

      if (res.ok) {
        Swal.fire('Berhasil!', 'Data Tim tersimpan.', 'success');
        setIsFormOpen(false); resetForm(); fetchData();
      } else { Swal.fire('Error', 'Gagal menyimpan', 'error'); }
    } catch (error) { Swal.fire('Error', 'Sistem error', 'error'); }
  };

  const handleDelete = async (id, name) => {
    const { value: confirmed } = await Swal.fire({ title: 'Hapus Data?', text: `Yakin hapus ${name}?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc2626' });
    if (confirmed) {
      const res = await fetch('/api/tim', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      if (res.ok) { Swal.fire('Terhapus!', 'Data berhasil dihapus.', 'success'); fetchData(); }
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setImagePreview(item.image || ''); setImageFile(null);
    if (!['Manajemen', 'Guru KIS 1', 'Guru KIS 2', 'Staf'].includes(item.category)) { setIsCustomCategory(true); } else { setIsCustomCategory(false); }
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setFormData({ id: null, name: '', position: '', category: 'Guru KIS 1', image: '' });
    setImageFile(null); setImagePreview(''); setIsCustomCategory(false);
  };

  if (loading && !isFormOpen) return <div className={styles.container}><div className={styles.loading}>Memuat Data Tim...</div></div>;

  return (
    <div className={styles.container}>
      {isFormOpen ? (
        <div style={{ background: 'white', padding: '5%', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
            <h2 style={{ margin: 0, color: '#0F6DA1', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}><FiUsers /> {formData.id ? 'Edit Anggota Tim' : 'Tambah Anggota Tim'}</h2>
            <button onClick={() => { setIsFormOpen(false); resetForm(); }} className={styles.btnOutline}><FiArrowLeft /> Kembali</button>
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div><label style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '5px' }}>Nama Lengkap *</label><input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="Contoh: Budi Santoso, S.Pd" /></div>
              <div><label style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '5px' }}>Jabatan *</label><input required type="text" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="Contoh: Guru Matematika" /></div>
            </div>

            <div>
              <label style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '5px' }}>Kategori Tim *</label>
              <select value={isCustomCategory ? 'Lainnya' : formData.category} onChange={(e) => { if(e.target.value === 'Lainnya') { setIsCustomCategory(true); setFormData({...formData, category: ''}); } else { setIsCustomCategory(false); setFormData({...formData, category: e.target.value}); } }} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white' }}>
                <option value="Manajemen">Manajemen</option>
                <option value="Guru KIS 1">Guru KIS 1</option>
                <option value="Guru KIS 2">Guru KIS 2</option>
                <option value="Staf">Staf & Karyawan</option>
                <option value="Lainnya">Lainnya (Custom)</option>
              </select>
              {isCustomCategory && <input required type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #32BAFA', marginTop: '10px' }} placeholder="Ketik kategori baru (contoh: Satpam, CS)" />}
            </div>

            <div>
              <label style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '5px' }}>Foto Profil</label>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                 {imagePreview ? <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}><Image src={imagePreview} alt="Preview" fill style={{objectFit: 'cover'}} /></div> : <div style={{ width: '100px', height: '100px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiImage size={32} color="#94a3b8"/></div>}
                 <button type="button" onClick={() => fileInputRef.current.click()} className={styles.btnOutline} style={{ padding: '8px 15px' }}>Upload Foto</button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
              <button type="submit" className={styles.btnPrimary} style={{ padding: '12px 24px' }}><FiSave /> {formData.id ? 'Simpan' : 'Tambahkan'}</button>
            </div>
          </form>
        </div>
      ) : (
      <>
        <div className={styles.pageHeader}>
          <div><h2 className={styles.pageTitle}>Manajemen Tim</h2><p className={styles.pageSubtitle}>Atur data Guru, Manajemen, dan Staf Kaffah.</p></div>
          <div className={styles.lastUpdateInfo} onClick={fetchData}><FiRefreshCw style={{cursor: 'pointer'}} /> Refresh Data</div>
        </div>

        <div className={styles.tableContainer}>
          <div className={styles.actionBar}>
             <div className={styles.tableTitleArea}><h3 className={styles.tableTitle}>Daftar Tim</h3><span className={styles.badgeCount}>{filteredList.length} Orang</span></div>
             <div className={styles.filterArea}>
                <div className={styles.searchWrapper}><FiSearch className={styles.searchIcon} /><input type="text" placeholder="Cari nama..." className={styles.searchInput} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
                <button onClick={() => setIsFormOpen(true)} className={styles.btnPrimary}><FiPlus /> Tambah Data</button>
             </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead><tr><th>Foto</th><th>Nama & Jabatan</th><th>Kategori</th><th>Aksi</th></tr></thead>
              <tbody>
                {filteredList.map((item) => (
                  <tr key={item.id}>
                    <td>{item.image ? <div style={{ position: 'relative', width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden' }}><Image src={item.image} alt="Thumb" fill style={{objectFit: 'cover'}} /></div> : <span style={{fontSize:'0.8rem', color:'#94a3b8'}}>-</span>}</td>
                    <td><div style={{fontWeight: '600', color: '#1e293b'}}>{item.name}</div><div style={{fontSize: '0.85rem', color: '#64748b'}}>{item.position}</div></td>
                    <td><span style={{background: '#e0f2fe', color: '#0F6DA1', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold'}}>{item.category}</span></td>
                    <td><div style={{display: 'flex', gap: '8px'}}><button onClick={() => handleEdit(item)} className={styles.btnBlue} style={{padding: '0.5rem', borderRadius: '8px'}}><FiEdit /></button><button onClick={() => handleDelete(item.id, item.name)} className={styles.btnDelete}><FiTrash2 /></button></div></td>
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