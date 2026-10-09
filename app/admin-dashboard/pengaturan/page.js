'use client';

import { useState, useEffect, useRef } from 'react';
import { FiSettings, FiSave, FiImage, FiVideo, FiRefreshCw, FiYoutube, FiX } from 'react-icons/fi';
import Swal from 'sweetalert2';
import styles from '../dashboard.module.css';

export default function AdminPengaturanHero() {
  const [heroData, setHeroData] = useState({ tipe: 'IMAGE', mediaUrl: '' });
  const [loading, setLoading] = useState(true);
  
  const fileInputRef = useRef(null);
  
  // 🔥 STATE BARU: Nampung gabungan foto/video lama & baru biar bisa dihapus satu-satu
  const [mediaList, setMediaList] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch('/api/hero');
    if (res.ok) {
      const data = await res.json();
      setHeroData({
        tipe: data.tipe || 'IMAGE',
        mediaUrl: data.mediaUrl ?? '' // 🔥 FIX ERROR REACT DISINI
      });
      
      // Susun list preview dari database
      if (data.tipe === 'IMAGE' && data.mediaUrl) {
        const urls = data.mediaUrl.split(',').filter(u => u);
        setMediaList(urls.map(url => ({ id: url, type: 'EXISTING', url, isVideo: false })));
      } else if (data.tipe === 'VIDEO' && data.mediaUrl) {
        setMediaList([{ id: data.mediaUrl, type: 'EXISTING', url: data.mediaUrl, isVideo: true }]);
      } else {
        setMediaList([]);
      }
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const isVideoUpload = files[0].type.includes('video');

    if (isVideoUpload) {
      // 🔥 Kalau upload Video, hapus semua foto dan ganti jadi 1 video
      const newVideo = { 
        id: Date.now().toString(), 
        type: 'NEW', 
        url: URL.createObjectURL(files[0]), 
        file: files[0], 
        isVideo: true 
      };
      setMediaList([newVideo]);
      setHeroData(prev => ({ ...prev, tipe: 'VIDEO' }));
    } else {
      // 🔥 Kalau upload Foto, tambahin ke list (kalau sebelumnya video, reset dulu)
      let currentList = [...mediaList];
      if (heroData.tipe === 'VIDEO' || heroData.tipe === 'YOUTUBE') {
        currentList = [];
      }

      const newImages = files.map((file, idx) => ({
        id: `${Date.now()}-${idx}`,
        type: 'NEW',
        url: URL.createObjectURL(file),
        file: file,
        isVideo: false
      }));

      setMediaList([...currentList, ...newImages]);
      setHeroData(prev => ({ ...prev, tipe: 'IMAGE' }));
    }

    // Reset input biar bisa pilih file yang sama lagi kalau abis dihapus
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 🔥 FUNGSI BUANG FOTO DARI PREVIEW
  const removeMedia = (idToRemove) => {
    setMediaList(prev => prev.filter(item => item.id !== idToRemove));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      Swal.fire({ title: 'Menyimpan...', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); }});
      
      let finalMediaUrl = heroData.mediaUrl;
      
      if (heroData.tipe !== 'YOUTUBE') {
        // Pisahin mana URL yang udah ada di server, mana file baru yang harus di-upload
        const existingUrls = mediaList.filter(item => item.type === 'EXISTING').map(item => item.url);
        const newFiles = mediaList.filter(item => item.type === 'NEW').map(item => item.file);

        let uploadedUrls = [];
        if (newFiles.length > 0) {
          const uploadPromises = newFiles.map(async (file) => {
            const uploadData = new FormData();
            uploadData.append('file', file);
            const res = await fetch('/api/upload', { method: 'POST', body: uploadData });
            const json = await res.json();
            return json.url;
          });
          
          uploadedUrls = await Promise.all(uploadPromises);
        }

        // Gabungin URL lama yang gak dihapus sama URL baru
        finalMediaUrl = [...existingUrls, ...uploadedUrls].join(',');
      }

      // Fallback kalau ternyata user ngehapus SEMUA foto dan lupa upload
      if (!finalMediaUrl && heroData.tipe !== 'YOUTUBE') {
        finalMediaUrl = '/hero-bg.jpg'; 
      }

      const res = await fetch('/api/hero', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ tipe: heroData.tipe, mediaUrl: finalMediaUrl }) 
      });

      if (res.ok) {
        Swal.fire('Berhasil!', 'Background Hero berhasil diupdate.', 'success');
        fetchData(); 
      } else {
        Swal.fire('Error', 'Gagal menyimpan pengaturan', 'error');
      }
    } catch (error) { Swal.fire('Error', 'Terjadi kesalahan', 'error'); }
  };

  if (loading) return <div className={styles.container}><div className={styles.loading}>Memuat Pengaturan...</div></div>;

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div><h2 className={styles.pageTitle}>Pengaturan Tampilan</h2><p className={styles.pageSubtitle}>Ubah Foto atau Video Background Homepage.</p></div>
        <div className={styles.lastUpdateInfo} onClick={fetchData}><FiRefreshCw style={{cursor: 'pointer'}} /> Refresh</div>
      </div>

      <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', maxWidth: '800px' }}>
        <h3 style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '10px', color: '#0F6DA1', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FiSettings /> Background Hero
        </h3>
        
        <form onSubmit={handleSave} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#475569', display: 'block', marginBottom: '10px' }}>Pilih Sumber Background</label>
            <select 
              value={heroData.tipe === 'YOUTUBE' ? 'YOUTUBE' : 'UPLOAD'} 
              onChange={(e) => {
                if (e.target.value === 'YOUTUBE') {
                  setHeroData({ tipe: 'YOUTUBE', mediaUrl: '' });
                } else {
                  setHeroData({ tipe: 'IMAGE', mediaUrl: '' });
                  setMediaList([]);
                }
              }}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white' }}
            >
              <option value="UPLOAD">Upload Media Lokal (Bisa pilih 3-4 Foto / 1 Video MP4)</option>
              <option value="YOUTUBE">Gunakan Video YouTube (Rekomendasi! Lebih Ringan)</option>
            </select>
          </div>

          {heroData.tipe === 'YOUTUBE' ? (
            <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
              <label style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#475569', display: 'block', marginBottom: '10px' }}>
                <FiYoutube color="red" /> Masukkan Link Video YouTube
              </label>
              <input 
                type="text" 
                value={heroData.mediaUrl ?? ''} 
                onChange={(e) => setHeroData(prev => ({...prev, mediaUrl: e.target.value}))} 
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} 
                placeholder="Contoh: https://www.youtube.com/watch?v=32R_XURup7E" 
                required 
              />
            </div>
          ) : (
            <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
              <label style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#475569', display: 'block', marginBottom: '10px' }}>
                Pilih File (Bisa seleksi banyak foto sekaligus)
              </label>
              
              <input type="file" multiple accept="image/*, video/mp4, video/webm" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'flex-start' }}>
                 
                 {/* PREVIEW GAMBAR & TOMBOL HAPUS */}
                 {mediaList.length > 0 ? (
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                      {mediaList.map((media) => (
                        <div key={media.id} style={{ position: 'relative', width: '150px', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', border: '2px solid #0F6DA1', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                          
                          {/* 🔥 TOMBOL SILANG MERAH BUAT HAPUS */}
                          <button 
                            type="button" 
                            onClick={() => removeMedia(media.id)}
                            style={{ position: 'absolute', top: '5px', right: '5px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
                          >
                            <FiX size={14} />
                          </button>

                          {media.isVideo ? (
                            <video src={media.url} autoPlay loop muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <img src={media.url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          )}
                        </div>
                      ))}
                    </div>
                 ) : (
                    <div style={{ width: '100%', maxWidth: '500px', aspectRatio: '16/9', borderRadius: '8px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                       Belum ada media terpasang
                    </div>
                 )}
                 
                 <button type="button" onClick={() => fileInputRef.current.click()} className={styles.btnOutline} style={{ padding: '10px 20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {heroData.tipe === 'VIDEO' ? <FiVideo /> : <FiImage />} Tambah / Ganti Media
                 </button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
            <button type="submit" className={styles.btnPrimary} style={{ padding: '12px 24px', fontSize: '1rem' }}>
              <FiSave /> Simpan Tampilan
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}