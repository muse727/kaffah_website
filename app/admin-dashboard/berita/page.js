'use client';

import { useState, useEffect, useRef } from 'react';
import { FiFileText, FiPlus, FiTrash2, FiEdit, FiSearch, FiRefreshCw, FiArrowLeft, FiSave, FiImage } from 'react-icons/fi';
import Swal from 'sweetalert2';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import styles from '../dashboard.module.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image', 'video'],
    ['clean']
  ],
};

export default function AdminBerita() {
  const [beritaList, setBeritaList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const fileInputRef = useRef(null);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [formData, setFormData] = useState({
    id: null,
    title: '',
    slug: '',
    content: '',
    author: 'Tim Redaksi',
    status: 'PUBLISHED',
    image: '', 
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/berita');
      if (res.ok) {
        const data = await res.json();
        setBeritaList(data);
        setFilteredList(data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const results = beritaList.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredList(results);
  }, [searchTerm, beritaList]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      return Swal.fire('Error', 'Judul dan Isi Berita wajib diisi!', 'error');
    }

    try {
      Swal.fire({ title: 'Menyimpan...', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); }});
      
      let finalImageUrl = formData.image;

      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('file', imageFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });

        if (!uploadRes.ok) throw new Error('Gagal upload gambar sampul');
        
        const uploadResult = await uploadRes.json();
        finalImageUrl = uploadResult.url; 
      }

      const finalSlug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const payload = { ...formData, slug: finalSlug, image: finalImageUrl };

      const res = await fetch('/api/berita', {
        method: formData.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        Swal.fire('Berhasil!', 'Berita berhasil disimpan.', 'success');
        setIsFormOpen(false);
        resetForm();
        fetchData();
      } else {
        Swal.fire('Error', 'Gagal menyimpan berita. Cek console.', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Terjadi kesalahan sistem', 'error');
    }
  };

  const handleDelete = async (id, title) => {
    const { value: confirmed } = await Swal.fire({ title: 'Hapus Berita?', text: `Yakin hapus "${title}"?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc2626' });
    if (confirmed) {
      const res = await fetch('/api/berita', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      if (res.ok) { Swal.fire('Terhapus!', 'Artikel berhasil dihapus.', 'success'); fetchData(); }
    }
  };

  const handleEdit = (berita) => {
    setFormData(berita);
    setImagePreview(berita.image || ''); 
    setImageFile(null); 
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setFormData({ id: null, title: '', slug: '', content: '', author: 'Tim Redaksi', status: 'PUBLISHED', image: '' });
    setImageFile(null);
    setImagePreview('');
  };

  if (loading && !isFormOpen) return <div className={styles.container}><div className={styles.loading}>Memuat Database Berita...</div></div>;

  return (
    <div className={styles.container}>
      {isFormOpen ? (
        <div style={{ background: 'white', padding: '5%', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', maxWidth: '100%', overflowX: 'hidden' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ margin: 0, color: '#0F6DA1', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
              <FiFileText /> {formData.id ? 'Edit Berita' : 'Tulis Berita Baru'}
            </h2>
            <button onClick={() => { setIsFormOpen(false); resetForm(); }} className={styles.btnOutline} style={{ padding: '8px 12px', fontSize: '0.9rem' }}>
              <FiArrowLeft /> Kembali
            </button>
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* 🔥 FIX RESPONSIVE: PAKE CSS GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '5px' }}>Judul Artikel *</label>
                <input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }} placeholder="Masukkan judul berita..." />
              </div>
              <div>
                <label style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '5px' }}>Penulis</label>
                <input type="text" value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }} />
              </div>
            </div>

            {/* 🔥 FIX RESPONSIVE: PAKE CSS GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '5px' }}>Gambar Sampul (Featured Image)</label>
                
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                   {imagePreview ? (
                      <div style={{ position: 'relative', width: '100px', height: '70px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                         <Image src={imagePreview} alt="Preview" fill style={{objectFit: 'cover'}} />
                      </div>
                   ) : (
                      <div style={{ width: '100px', height: '70px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', border: '1px dashed #cbd5e1' }}>
                         <FiImage size={24} />
                      </div>
                   )}
                   
                   <div style={{ flex: 1 }}>
                     <button type="button" onClick={() => fileInputRef.current.click()} className={styles.btnOutline} style={{ padding: '8px 15px', fontSize: '0.9rem', width: '100%' }}>
                        Pilih Gambar
                     </button>
                     {imageFile && <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '5px', wordBreak: 'break-all' }}>{imageFile.name}</p>}
                   </div>
                </div>
              </div>
              
              <div>
                <label style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '5px' }}>Status Publikasi</label>
                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', background: 'white' }}>
                  <option value="PUBLISHED">🟢 Terbit (Published)</option>
                  <option value="DRAFT">🟡 Draf (Disembunyikan)</option>
                </select>
              </div>
            </div>

            {/* EDITOR BERITA */}
            <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
              <label style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '5px' }}>Isi Berita *</label>
              <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1', minWidth: '300px' }}>
                <ReactQuill 
                  theme="snow" 
                  modules={quillModules}
                  value={formData.content} 
                  onChange={(content) => setFormData({...formData, content})} 
                  style={{ height: '350px', marginBottom: '40px' }}
                  placeholder="Ketik isi berita selengkapnya di sini..."
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
              <button type="submit" className={styles.btnPrimary} style={{ padding: '12px 24px', fontSize: '1rem', width: '100%', maxWidth: '200px', justifyContent: 'center' }}>
                <FiSave /> {formData.id ? 'Simpan' : 'Terbitkan'}
              </button>
            </div>
          </form>
        </div>
      ) : (
      <>
        {/* BAGIAN TABEL BERITA TETAP SAMA */}
        <div className={styles.pageHeader}>
          <div><h2 className={styles.pageTitle}>Manajemen Berita & Artikel</h2><p className={styles.pageSubtitle}>Tulis dan kelola publikasi informasi sekolah Kaffah.</p></div>
          <div className={styles.lastUpdateInfo} onClick={fetchData}><FiRefreshCw style={{cursor: 'pointer'}} /> Refresh Data</div>
        </div>

        <div className={styles.tableContainer}>
          <div className={styles.actionBar}>
             <div className={styles.tableTitleArea}><h3 className={styles.tableTitle}>Daftar Berita</h3><span className={styles.badgeCount}>{filteredList.length} Artikel</span></div>
             <div className={styles.filterArea}>
                <div className={styles.searchWrapper}><FiSearch className={styles.searchIcon} /><input type="text" placeholder="Cari judul..." className={styles.searchInput} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
                <button onClick={() => setIsFormOpen(true)} className={styles.btnPrimary}><FiPlus /> Tulis Berita Baru</button>
             </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead><tr><th>Tanggal</th><th>Gambar</th><th>Judul Artikel</th><th>Status</th><th>Aksi</th></tr></thead>
              <tbody>
                {filteredList.length === 0 ? (
                  <tr><td colSpan="5" className={styles.emptyState}>Belum ada data berita di database.</td></tr>
                ) : (
                  filteredList.map((item) => (
                    <tr key={item.id}>
                      <td><div className={styles.tdDate}>{new Date(item.createdAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}</div></td>
                      <td>
                        {item.image ? (
                           <div style={{ position: 'relative', width: '60px', height: '40px', borderRadius: '4px', overflow: 'hidden' }}>
                              <Image src={item.image} alt="Thumb" fill style={{objectFit: 'cover'}} />
                           </div>
                        ) : (
                           <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>- Kosong -</span>
                        )}
                      </td>
                      <td><div className={styles.tdName} style={{fontWeight: '600', maxWidth: '300px'}}>{item.title}</div><div style={{fontSize:'0.8rem', color:'#64748b'}}>{item.author}</div></td>
                      <td><span style={{background: item.status === 'PUBLISHED' ? '#dcfce7' : '#fef9c3', color: item.status === 'PUBLISHED' ? '#16a34a' : '#854d0e', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold'}}>{item.status}</span></td>
                      <td>
                        <div style={{display: 'flex', gap: '8px'}}>
                          <button onClick={() => handleEdit(item)} className={styles.btnBlue} style={{padding: '0.4rem', borderRadius: '8px'}}><FiEdit /></button>
                          <button onClick={() => handleDelete(item.id, item.title)} className={styles.btnDelete} style={{padding: '0.4rem', borderRadius: '8px'}}><FiTrash2 /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
      )}
    </div>
  );
}