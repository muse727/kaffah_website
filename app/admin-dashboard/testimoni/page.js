'use client';

import { useState, useEffect, useRef } from 'react';
import { FiMessageSquare, FiPlayCircle, FiPlus, FiTrash2, FiEdit, FiSearch, FiRefreshCw, FiArrowLeft, FiSave, FiImage, FiYoutube, FiUsers } from 'react-icons/fi';
import Swal from 'sweetalert2';
import Image from 'next/image';
import styles from '../dashboard.module.css';

export default function AdminTestimoni() {
  const [testiList, setTestiList] = useState([]); 
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Dua buat Upload Foto
  const thumbRef = useRef(null);
  const avatarRef = useRef(null);
  
  const [thumbFile, setThumbFile] = useState(null);
  const [thumbPreview, setThumbPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  const [formData, setFormData] = useState({
    id: null, name: '', title: '', quote: '', videoUrl: '', thumbnail: '', avatar: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/testimoni');
      if(res.ok) { const data = await res.json(); setTestiList(data); setFilteredList(data); }
      setLoading(false);
    } catch (error) { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);
  useEffect(() => {
    const results = testiList.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredList(results);
  }, [searchTerm, testiList]);

  const handleUpload = async (file) => {
    const data = new FormData(); data.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: data });
    if (!res.ok) throw new Error('Upload gagal');
    return (await res.json()).url;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      Swal.fire({ title: 'Menyimpan...', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); }});
      
      let finalThumb = formData.thumbnail;
      let finalAvatar = formData.avatar;

      if (thumbFile) finalThumb = await handleUpload(thumbFile);
      if (avatarFile) finalAvatar = await handleUpload(avatarFile);

      const payload = { ...formData, thumbnail: finalThumb, avatar: finalAvatar };
      const res = await fetch('/api/testimoni', { method: formData.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

      if (res.ok) {
        Swal.fire('Berhasil!', 'Testimoni tersimpan.', 'success');
        setIsFormOpen(false); resetForm(); fetchData();
      } else { Swal.fire('Error', 'Gagal menyimpan', 'error'); }
    } catch (error) { Swal.fire('Error', 'Sistem error', 'error'); }
  };

  const handleDelete = async (id, name) => {
    const { value: confirmed } = await Swal.fire({ title: 'Hapus Testimoni?', text: `Yakin hapus data ${name}?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc2626' });
    if (confirmed) {
      const res = await fetch('/api/testimoni', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      if (res.ok) { Swal.fire('Terhapus!', 'Data berhasil dihapus.', 'success'); fetchData(); }
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setThumbPreview(item.thumbnail || ''); setThumbFile(null);
    setAvatarPreview(item.avatar || ''); setAvatarFile(null);
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setFormData({ id: null, name: '', title: '', quote: '', videoUrl: '', thumbnail: '', avatar: '' });
    setThumbFile(null); setThumbPreview(''); setAvatarFile(null); setAvatarPreview('');
  };

  if (loading && !isFormOpen) return <div className={styles.container}><div className={styles.loading}>Memuat Data...</div></div>;

  return (
    <div className={styles.container}>
      {isFormOpen ? (
        <div style={{ background: 'white', padding: '5%', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
            <h2 style={{ margin: 0, color: '#0F6DA1', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}><FiMessageSquare /> {formData.id ? 'Edit Testimoni' : 'Tambah Testimoni'}</h2>
            <button onClick={() => { setIsFormOpen(false); resetForm(); }} className={styles.btnOutline}><FiArrowLeft /> Kembali</button>
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div><label style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '5px' }}>Nama Lengkap *</label><input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="Contoh: H. Ismail, S.Pd" /></div>
              <div><label style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '5px' }}>Jabatan / Status *</label><input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="Contoh: Wali Murid SMPIT" /></div>
            </div>

            <div><label style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '5px' }}>Kutipan Testimoni (Quote) *</label><textarea required value={formData.quote} onChange={(e) => setFormData({...formData, quote: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', minHeight: '100px' }} placeholder='"Kurikulumnya sangat bagus..."'></textarea></div>

            {/* FOTO-FOTO */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '12px' }}>
              <div>
                <label style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '5px' }}>Foto Kegiatan / Thumbnail</label>
                <input type="file" accept="image/*" ref={thumbRef} onChange={(e) => { setThumbFile(e.target.files[0]); setThumbPreview(URL.createObjectURL(e.target.files[0])); }} style={{ display: 'none' }} />
                <div style={{ display: 'flex', gap: '15px' }}>
                   {thumbPreview ? <Image src={thumbPreview} alt="Thumb" width={120} height={80} style={{objectFit: 'cover', borderRadius: '8px'}} /> : <div style={{ width: '120px', height: '80px', borderRadius: '8px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiImage size={24} color="#94a3b8"/></div>}
                   <button type="button" onClick={() => thumbRef.current.click()} className={styles.btnOutline} style={{ alignSelf: 'center' }}>Upload Foto</button>
                </div>
              </div>
              
              <div>
                <label style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '5px' }}>Foto Profil (Avatar)</label>
                <input type="file" accept="image/*" ref={avatarRef} onChange={(e) => { setAvatarFile(e.target.files[0]); setAvatarPreview(URL.createObjectURL(e.target.files[0])); }} style={{ display: 'none' }} />
                <div style={{ display: 'flex', gap: '15px' }}>
                   {avatarPreview ? <Image src={avatarPreview} alt="Avatar" width={60} height={60} style={{objectFit: 'cover', borderRadius: '50%'}} /> : <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiUsers size={24} color="#94a3b8"/></div>}
                   <button type="button" onClick={() => avatarRef.current.click()} className={styles.btnOutline} style={{ alignSelf: 'center' }}>Upload Avatar</button>
                </div>
              </div>
            </div>

            {/* YOUTUBE LINK */}
            <div>
              <label style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '5px' }}><FiYoutube color="red"/> Link Video YouTube (Opsional)</label>
              <input type="text" value={formData.videoUrl} onChange={(e) => setFormData({...formData, videoUrl: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="Kosongkan jika hanya ingin menampilkan foto" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
              <button type="submit" className={styles.btnPrimary} style={{ padding: '12px 24px' }}><FiSave /> Simpan Testimoni</button>
            </div>
          </form>
        </div>
      ) : (
      <>
        <div className={styles.pageHeader}>
          <div><h2 className={styles.pageTitle}>Manajemen Testimoni</h2><p className={styles.pageSubtitle}>Atur ulasan (Foto / Video) dari wali murid.</p></div>
          <div className={styles.lastUpdateInfo} onClick={fetchData}><FiRefreshCw style={{cursor: 'pointer'}} /> Refresh Data</div>
        </div>

        <div className={styles.tableContainer}>
          <div className={styles.actionBar}>
             <div className={styles.tableTitleArea}><h3 className={styles.tableTitle}>Daftar Ulasan</h3><span className={styles.badgeCount}>{filteredList.length} Data</span></div>
             <div className={styles.filterArea}>
                <div className={styles.searchWrapper}><FiSearch className={styles.searchIcon} /><input type="text" placeholder="Cari nama wali murid..." className={styles.searchInput} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
                <button onClick={() => setIsFormOpen(true)} className={styles.btnPrimary}><FiPlus /> Tambah Testimoni</button>
             </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead><tr><th>Nama / Jabatan</th><th>Kutipan (Quote)</th><th>Tipe</th><th>Aksi</th></tr></thead>
              <tbody>
                {filteredList.map((item) => (
                  <tr key={item.id}>
                    <td><div className={styles.tdName} style={{fontWeight: '600'}}>{item.name}</div><div style={{fontSize: '0.8rem', color: '#64748b'}}>{item.title}</div></td>
                    <td style={{fontStyle: 'italic', color: '#475569', maxWidth: '300px'}}>{item.quote}</td>
                    <td>{item.videoUrl ? <span style={{background:'#fee2e2', color:'#dc2626', padding:'4px 8px', borderRadius:'10px', fontSize:'0.75rem', fontWeight:'bold'}}>VIDEO</span> : <span style={{background:'#e0f2fe', color:'#0F6DA1', padding:'4px 8px', borderRadius:'10px', fontSize:'0.75rem', fontWeight:'bold'}}>FOTO</span>}</td>
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