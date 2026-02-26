'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FiEdit3, FiImage, FiTrash2, FiClock, FiPlusCircle, FiFileText } from 'react-icons/fi';
import Swal from 'sweetalert2';
import styles from '../dashboard.module.css'; // Pake CSS Premium lu

export default function KelolaKabar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [listKabar, setListKabar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Form
  const [judul, setJudul] = useState('');
  const [konten, setKonten] = useState('');
  const [gambar, setGambar] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
    if (status === 'authenticated') fetchKabar();
  }, [status, router]);

  const fetchKabar = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/kabar');
      const json = await res.json();
      if (json.success) setListKabar(json.data);
      setLoading(false);
    } catch (error) {
      Swal.fire('Error', 'Gagal memuat data kabar terbaru', 'error');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!judul || !konten) return Swal.fire('Oops', 'Judul dan konten wajib diisi bro!', 'warning');

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('judul', judul);
    formData.append('konten', konten);
    if (gambar) formData.append('gambar', gambar);

    try {
      const res = await fetch('/api/admin/kabar', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();

      if (json.success) {
        Swal.fire('Mantap!', 'Kabar terbaru berhasil dipublikasikan.', 'success');
        setJudul(''); setKonten(''); setGambar(null);
        // Reset input file manual
        document.getElementById('fileUpload').value = '';
        fetchKabar(); // Refresh list
      } else {
        Swal.fire('Gagal', json.message, 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Terjadi kesalahan sistem', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, judulKabar) => {
    const { value: confirmed } = await Swal.fire({
      title: 'Hapus Postingan?',
      text: `Yakin ingin menghapus kabar "${judulKabar}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Ya, Hapus!'
    });

    if (!confirmed) return;

    try {
      const res = await fetch('/api/admin/kabar', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const json = await res.json();

      if (json.success) {
        Swal.fire('Terhapus!', 'Postingan berhasil dihapus.', 'success');
        fetchKabar();
      } else {
        Swal.fire('Gagal', json.message, 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Gagal menghapus data', 'error');
    }
  };

  const viewImage = (filename) => {
    Swal.fire({
      title: 'Foto Progres',
      html: `<img src="/uploads/${filename}" style="max-width: 100%; border-radius: 10px;" />`,
      showCloseButton: true, showConfirmButton: false, width: '60%'
    });
  };

  if (loading) return <div className={styles.container}><div className={styles.loading}>Memuat Data...</div></div>;

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>Kelola Kabar Terbaru</h2>
          <p className={styles.pageSubtitle}>Posting update progres pembangunan atau berita yayasan untuk donatur.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* 👇 BAGIAN KIRI: FORM BIKIN POSTINGAN 👇 */}
        <div className={styles.card} style={{ flex: '1 1 400px', alignSelf: 'flex-start', display: 'block' }}>
          <div className={styles.cardHeader} style={{ marginBottom: '1.5rem' }}>
             <div>
                <h3 className={styles.cardTitle} style={{ color: '#0f172a', fontWeight: '700' }}>Tulis Kabar Baru</h3>
             </div>
             <div className={`${styles.iconBox} ${styles.greenIcon}`}><FiEdit3 /></div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
               <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Judul Kabar</label>
               <input type="text" value={judul} onChange={(e) => setJudul(e.target.value)} className={styles.searchInput} style={{ width: '100%', boxSizing: 'border-box' }} placeholder="Misal: Pengecoran Lantai 2 Selesai" required />
            </div>
            <div>
               <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Isi Berita / Keterangan</label>
               <textarea value={konten} onChange={(e) => setKonten(e.target.value)} className={styles.searchInput} style={{ width: '100%', boxSizing: 'border-box', minHeight: '120px', resize: 'vertical', fontFamily: 'inherit' }} placeholder="Ceritakan detail progres di sini..." required />
            </div>
            <div>
               <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Upload Foto (Opsional)</label>
               <input id="fileUpload" type="file" accept="image/*" onChange={(e) => setGambar(e.target.files[0])} className={styles.searchInput} style={{ width: '100%', boxSizing: 'border-box', padding: '0.4rem' }} />
            </div>
            
            <button type="submit" disabled={isSubmitting} className={styles.btnApprove} style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', background: isSubmitting ? '#94a3b8' : '#16a34a', border: 'none', color: 'white' }}>
              <FiPlusCircle /> {isSubmitting ? 'Mempublikasikan...' : 'Posting Sekarang'}
            </button>
          </form>
        </div>

        {/* 👇 BAGIAN KANAN: LIST POSTINGAN 👇 */}
        <div className={styles.tableContainer} style={{ flex: '2 1 600px', marginTop: 0 }}>
          <div className={styles.actionBar}>
             <div className={styles.tableTitleArea}>
                <h3 className={styles.tableTitle}>Riwayat Postingan</h3>
                <span className={styles.badgeCount}>{listKabar.length} Post</span>
             </div>
          </div>
          
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th width="20%">Tanggal</th>
                  <th width="40%">Judul Kabar</th>
                  <th width="20%">Lampiran</th>
                  <th width="20%">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {listKabar.length === 0 ? (
                  <tr><td colSpan="4" className={styles.emptyState}>Belum ada kabar yang diposting.</td></tr>
                ) : (
                  listKabar.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className={styles.tdDate}>{new Date(item.createdAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</div>
                        <div className={styles.tdTime} style={{display: 'flex', alignItems:'center', gap:'0.3rem'}}><FiClock/> {new Date(item.createdAt).toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'})}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '0.3rem' }}>{item.judul}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.konten}</div>
                      </td>
                      <td>
                        {item.gambar ? (
                          <button onClick={() => viewImage(item.gambar)} className={styles.btnProof}>
                              <FiImage /> Lihat Foto
                          </button>
                        ) : <span className={styles.noProof}>Tanpa Foto</span>}
                      </td>
                      <td>
                        <button onClick={() => handleDelete(item.id, item.judul)} className={styles.btnDelete} title="Hapus Postingan">
                          <FiTrash2 /> Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}