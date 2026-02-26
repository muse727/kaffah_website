// components/ClientWrapper.js
'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import Chatbot from './Chatbot';
import WakafPopup from './WakafPopup';

export default function ClientWrapper({ children }) {
  const pathname = usePathname();
  
  // Cek apakah URL depannya "/admin-dashboard"
  const isAdminPage = pathname?.startsWith('/admin-dashboard');

  return (
    <>
      {/* Tampilkan komponen ini HANYA JIKA BUKAN di halaman admin */}
      {!isAdminPage && <Navbar />}
      {!isAdminPage && <WakafPopup />}
      
      {/* Konten Utama (Bisa halaman Home, bisa Dashboard Admin) */}
      {children}
      
      {/* Tampilkan komponen ini HANYA JIKA BUKAN di halaman admin */}
      {!isAdminPage && <Footer />}
      {!isAdminPage && <Chatbot />}
    </>
  );
}