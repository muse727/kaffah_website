'use client';

import { useEffect, useState } from 'react';
import { FiCheckCircle, FiShield } from 'react-icons/fi';

export default function ValidasiDirektur() {
  const [time, setTime] = useState('');

  // Jam live biar ketahuan kalau di-screenshot
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleString('id-ID'));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    // 👇 PADDING ATASNYA GUA NAIKIN JADI 160px BIAR GAK KETABRAK NAVBAR 👇
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', background: '#f8fafc', fontFamily: 'sans-serif', padding: '160px 1rem 4rem' }}>
       {/* Anti Klik Kanan se-halaman */}
       <div 
         onContextMenu={(e) => e.preventDefault()} 
         style={{ background: 'white', padding: '3rem 2rem', borderRadius: '24px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', maxWidth: '420px', width: '100%', borderTop: '8px solid #107163' }}
       >
          <FiShield size={65} color="#107163" style={{ marginBottom: '1rem' }} />
          <h2 style={{ color: '#0f172a', marginBottom: '0.5rem', fontWeight: '800', fontSize: '1.5rem' }}>
            Otorisasi Digital
          </h2>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#dcfce7', color: '#107163', padding: '8px 20px', borderRadius: '30px', fontWeight: '700', marginBottom: '2rem', fontSize: '0.9rem' }}>
             <FiCheckCircle size={18} /> DOKUMEN RESMI & VALID
          </div>

          <div style={{ textAlign: 'center', borderTop: '2px dashed #e2e8f0', paddingTop: '1.5rem' }}>
             <p style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
               Ditandatangani Secara Elektronik Oleh:
             </p>

             {/* 👇 TRIK GAMBAR HANTU + WATERMARK ALA FREEPIK 👇 */}
             <div style={{ 
               position: 'relative', 
               display: 'flex', 
               justifyContent: 'center', 
               alignItems: 'center',
               margin: '15px auto',
               maxWidth: '250px',
               overflow: 'hidden', // Biar watermark gak keluar batas
               padding: '10px'
             }}>
               
               {/* 1. Gambar TTD Asli di posisi paling bawah */}
               <img 
                 src="/ttd-direktur.png" 
                 alt="Tanda Tangan Direktur"
                 style={{ 
                   height: '90px', 
                   objectFit: 'contain',
                   userSelect: 'none', 
                   pointerEvents: 'none', 
                   filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.1))',
                   position: 'relative',
                   zIndex: 1
                 }}
               />

               {/* 2. Kaca Pelindung + Text Watermark di atas TTD */}
               <div 
                 style={{ 
                   position: 'absolute', 
                   top: 0, left: 0, right: 0, bottom: 0, 
                   zIndex: 10,
                   display: 'flex',
                   justifyContent: 'center',
                   alignItems: 'center',
                   pointerEvents: 'auto' // Klik kanan bakal mentok di div ini, gak kena gambar
                 }}
                 onContextMenu={(e) => e.preventDefault()}
               >
                 {/* Text Watermark Miring Transparan */}
                 <div style={{
                   transform: 'rotate(-15deg)',
                   color: 'rgba(16, 113, 99, 0.12)', // Warna hijau yayasan tapi transparan banget
                   fontSize: '1.4rem',
                   fontWeight: '900',
                   letterSpacing: '2px',
                   whiteSpace: 'nowrap',
                   userSelect: 'none',
                   pointerEvents: 'none'
                 }}>
                   SIT AL MUBARAK • AL MUBARAK
                 </div>
               </div>

             </div>
             {/* 👆 BATAS TRIK WATERMARK 👆 */}

             <h3 style={{ margin: '0 0 5px 0', color: '#0f172a', fontSize: '1.2rem', fontWeight: '700' }}>
               Yayan Supiana, SH, MM
             </h3>
             <p style={{ margin: '0 0 20px 0', color: '#107163', fontWeight: '600', fontSize: '0.95rem' }}>
               Direktur SIT Al Mubarak
             </p>

             <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '0.85rem' }}>
               Waktu Validasi (Live System):
             </p>
             <div style={{ background: '#107163', padding: '12px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '1.1rem', color: '#ffffff', textAlign: 'center', letterSpacing: '2px', fontWeight: 'bold' }}>
                {time || 'Memuat sistem...'}
             </div>
             <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '8px', textAlign: 'center' }}>
               *Pastikan detik waktu di atas terus berjalan untuk menghindari penipuan screenshot.
             </p>
          </div>

          <p style={{ marginTop: '2.5rem', fontSize: '0.8rem', color: '#94a3b8', fontWeight: '500' }}>
             Sistem Verifikasi Digital © {new Date().getFullYear()}<br/>SIT Al Mubarak
          </p>
       </div>
    </div>
  );
}