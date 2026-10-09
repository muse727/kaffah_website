'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { FiHome, FiFileText, FiAward, FiMessageSquare, FiSettings, FiLogOut, FiMenu, FiX, FiUserX } from 'react-icons/fi';
import styles from './adminLayout.module.css';

export default function AdminLayout({ children }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Tutup sidebar otomatis tiap kali ganti halaman di HP
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // 🔥 FIX MENU SIDEBAR: Disesuaikan sama database Kaffah lu
  const menuItems = [
    { name: 'Dashboard', path: '/admin-dashboard', icon: <FiHome size={20} /> },
    { name: 'Manajemen Berita', path: '/admin-dashboard/berita', icon: <FiFileText size={20} /> },
    { name: 'Data Prestasi', path: '/admin-dashboard/juara', icon: <FiAward size={20} /> },
    { name: 'Testimoni', path: '/admin-dashboard/testimoni', icon: <FiMessageSquare size={20} /> },
    { name: ' Manajemen Tim', path: '/admin-dashboard/tim', icon: <FiUserX size={20} /> },
    { name: 'Pengaturan', path: '/admin-dashboard/pengaturan', icon: <FiSettings size={20} /> },
    
  ];

  return (
    <div className={styles.layoutContainer}>
      
      {/* 📱 HEADER MOBILE (Tampil cuma di HP) */}
      <div className={styles.mobileHeader}>
        <button onClick={() => setIsMobileMenuOpen(true)} className={styles.hamburgerBtn}>
          <FiMenu size={28} />
        </button>
        <h2 className={styles.mobileTitle}>Admin Kaffah</h2>
        {/* Avatar Bulat */}
        <div style={{width: '35px', height: '35px', background: '#0F6DA1', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>
           {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'A'}
        </div>
      </div>

      {/* 🌑 OVERLAY GELAP (Pas menu kebuka di HP) */}
      <div 
        className={`${styles.overlay} ${isMobileMenuOpen ? styles.show : ''}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      {/* 🖥️ SIDEBAR (Desktop Fixed, Mobile Slide-in) */}
      <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          {/* 🔥 FIX NAMA ADMIN */}
          <h2 className={styles.logoText}>Admin Kaffah</h2>
          <button onClick={() => setIsMobileMenuOpen(false)} className={styles.closeBtn}>
            <FiX size={24} />
          </button>
        </div>

        <nav className={styles.navMenu}>
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                href={item.path} 
                key={item.name} 
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <button onClick={() => signOut({ callbackUrl: '/login' })} className={styles.logoutBtn}>
            <FiLogOut size={20} />
            Keluar
          </button>
        </div>
      </aside>

      {/* 📄 KONTEN HALAMAN UTAMA */}
      <main className={styles.mainContent}>
        {children}
      </main>

    </div>
  );
}