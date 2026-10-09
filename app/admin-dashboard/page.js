'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FiFileText, FiAward, FiMessageSquare, FiClock, FiActivity, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';
import styles from './dashboard.module.css'; // Pastikan path CSS ini bener ya bro

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  // Dummy State Statistik (Nanti lu ganti pakai fetch API Prisma)
  const [stats, setStats] = useState({
    berita: 12,
    prestasi: 24,
    testimoni: 8
  });

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
    if (status === 'authenticated') {
      // Nanti di sini lu fetch data count dari database lu
      setLastUpdated(new Date().toLocaleTimeString('id-ID'));
      setLoading(false);
    }
  }, [status, router]);

  if (loading) return <div className={styles.container}><div className={styles.loading}>Memuat Dashboard...</div></div>;

  return (
    <div className={styles.container}>
      
      {/* HEADER PAGE */}
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>Selamat Datang, {session?.user?.name || 'Admin'} 👋</h2>
          <p className={styles.pageSubtitle}>Ini adalah pusat kendali website Kaffah Islamic School.</p>
        </div>
        <div className={styles.lastUpdateInfo}>
          <FiClock /> Update: {lastUpdated}
        </div>
      </div>

      {/* STATISTIK GRID */}
      <div className={styles.statsGrid}>
         <div className={styles.card}>
           <div className={styles.cardHeader}>
             <div><h3 className={styles.cardTitle}>Total Berita</h3><p className={styles.cardValue}>{stats.berita}</p></div>
             <div className={`${styles.iconBox} ${styles.blueIcon}`}><FiFileText /></div>
           </div>
           <div className={styles.cardFooter}>Artikel Publikasi Sekolah</div>
         </div>

         <div className={styles.card}>
           <div className={styles.cardHeader}>
             <div><h3 className={styles.cardTitle}>Total Prestasi</h3><p className={styles.cardValue}>{stats.prestasi}</p></div>
             <div className={`${styles.iconBox} ${styles.orangeIcon}`}><FiAward /></div>
           </div>
           <div className={styles.cardFooter}>Penghargaan & Juara Siswa</div>
         </div>

         <div className={styles.card}>
           <div className={styles.cardHeader}>
             <div><h3 className={styles.cardTitle}>Data Testimoni</h3><p className={styles.cardValue}>{stats.testimoni}</p></div>
             <div className={`${styles.iconBox} ${styles.greenIcon}`}><FiMessageSquare /></div>
           </div>
           <div className={styles.cardFooter}>Ulasan Wali Murid</div>
         </div>
      </div>

      {/* JALAN PINTAS (QUICK LINKS) */}
      <div className={styles.tableContainer} style={{ marginTop: '2rem', padding: '1.5rem' }}>
        <h3 className={styles.tableTitle} style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiActivity /> Akses Cepat
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <Link href="/admin-dashboard/berita" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc', color: '#0F6DA1', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.3s' }}>
              Tulis Berita Baru <FiArrowRight />
            </div>
          </Link>
          
          <Link href="/admin-dashboard/juara" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc', color: '#ea580c', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.3s' }}>
              Input Prestasi Siswa <FiArrowRight />
            </div>
          </Link>

          <Link href="/admin-dashboard/testimoni" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc', color: '#16a34a', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.3s' }}>
              Kelola Testimoni <FiArrowRight />
            </div>
          </Link>
        </div>
      </div>

    </div>
  );
}