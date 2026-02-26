'use client';

import { usePathname } from 'next/navigation';
// SESUAIKAN IMPORT INI SAMA LOKASI FILE NAVBAR & FOOTER LU
import Navbar from './Navbar'; 
import Footer from './Footer'; 

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  
  // Deteksi apakah URL sekarang mengandung "/admin-dashboard"
  const isAdminPage = pathname?.startsWith('/admin-dashboard');

  return (
    <>
      {/* Kalau BUKAN halaman admin, baru tampilin Navbar */}
      {!isAdminPage && <Navbar />}
      
      {/* Konten Halaman (Bisa halaman depan, bisa halaman admin) */}
      {children}
      
      {/* Kalau BUKAN halaman admin, baru tampilin Footer */}
      {!isAdminPage && <Footer />}
    </>
  );
}