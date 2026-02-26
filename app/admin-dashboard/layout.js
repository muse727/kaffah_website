'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react'; // 👈 Import useSession
import { FiHome, FiUsers, FiDollarSign, FiSettings, FiLogOut, FiActivity, FiFileText } from 'react-icons/fi'; // 👈 Tambah FiActivity
import styles from './adminLayout.module.css';

export default function AdminLayout({ children }) {
  const { data: session } = useSession(); // 👈 Ambil data sesi login
  
  // 👈 Cek apakah yang login ini SUPERADMIN
  const isSuperAdmin = session?.user?.role === 'SUPERADMIN'; 

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Admin Panel</h2>
        </div>
        
        <nav className={styles.navMenu}>
          <Link href="/admin-dashboard" className={styles.navItem}>
            <FiHome size={20} /> Dashboard
          </Link>
          <Link href="/admin-dashboard/donasi" className={styles.navItem}>
            <FiDollarSign size={20} /> Data Donasi
          </Link>
          
          <Link href="/admin-dashboard/kabar" className={styles.navItem}>
  <FiFileText size={20} /> Kabar Terbaru
</Link>
          
          {/* 👇 BAGIAN RAHASIA: Cuma muncul kalau isSuperAdmin = true 👇 */}
          {isSuperAdmin && (
            <>
              <Link href="/admin-dashboard/log" className={styles.navItem}>
                <FiActivity size={20} /> Log Aktivitas
              </Link>
              <Link href="/admin-dashboard/pengaturan" className={styles.navItem}>
                <FiSettings size={20} /> Pengaturan
              </Link>
            </>
          )}
          {/* 👆 BATAS RAHASIA 👆 */}

        </nav>

        <div className={styles.logoutWrapper}>
          <button onClick={() => signOut({ callbackUrl: '/' })} className={styles.logoutBtn}>
            <FiLogOut size={20} /> Keluar
          </button>
        </div>
      </aside>

      <div className={styles.mainWrapper}>
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </div>
  );
}