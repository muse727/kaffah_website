'use client';

import { usePathname } from 'next/navigation';

export default function LayoutWrapper({ children, navbar, footer }) {
  const pathname = usePathname();
  // Cek apakah URL sekarang ada kata "admin-dashboard"
  const isAdminPage = pathname?.startsWith('/admin-dashboard');

  return (
    <>
      {/* Kalau BUKAN admin, tampilkan Navbar */}
      {!isAdminPage && navbar}
      
      {/* Konten Utama */}
      {children}
      
      {/* Kalau BUKAN admin, tampilkan Footer */}
      {!isAdminPage && footer}
    </>
  );
}