'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FiActivity, FiClock, FiShield } from 'react-icons/fi';
import styles from '../dashboard.module.css';

export default function ActivityLog() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Keamanan lapis dua: Kalau user ketik URL manual tapi dia bukan Super Admin, tendang!
    if (status === 'unauthenticated') router.push('/login');
    if (status === 'authenticated') {
      if (session?.user?.role !== 'SUPERADMIN') {
        router.push('/admin-dashboard');
      } else {
        fetchLogs();
      }
    }
  }, [status, session, router]);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/admin/logs');
      const data = await res.json();
      setLogs(data);
      setLoading(false);
    } catch (error) {
      console.error("Gagal ambil log", error);
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.container}><div className={styles.loading}>Memuat CCTV Server...</div></div>;

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>CCTV Server (Log Aktivitas)</h2>
          <p className={styles.pageSubtitle}>Pantau semua pergerakan dan aksi yang dilakukan oleh seluruh Admin.</p>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.actionBar}>
           <div className={styles.tableTitleArea}>
              <h3 className={styles.tableTitle}>Riwayat Aktivitas Terbaru</h3>
              <span className={styles.badgeCount}>{logs.length} Rekaman</span>
           </div>
        </div>
        
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th width="15%">Waktu Kejadian</th>
                <th width="20%">Pelaku (Admin)</th>
                <th width="15%">Jenis Aksi</th>
                <th width="50%">Detail Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                   <td colSpan="4" className={styles.emptyState}>Belum ada aktivitas yang terekam.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <div className={styles.tdDate}>{new Date(log.createdAt).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})}</div>
                      <div className={styles.tdTime} style={{display: 'flex', alignItems:'center', gap:'0.3rem'}}><FiClock/> {new Date(log.createdAt).toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit', second: '2-digit'})}</div>
                    </td>
                    <td>
                      <div className={styles.tdName} style={{display: 'flex', alignItems:'center', gap:'0.5rem'}}>
                        <FiShield style={{color: '#2563eb'}}/> {log.adminName}
                      </div>
                    </td>
                    <td>
                      <span className={styles.badge} style={{background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1'}}>
                        {log.action}
                      </span>
                    </td>
                    <td>
                      <div style={{fontSize: '0.9rem', color: '#334155'}}>{log.description}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}