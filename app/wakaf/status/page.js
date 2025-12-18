"use client";
import Link from 'next/link';
import PageWrapper from '../../../components/PageWrapper';
import styles from '../../../styles/Wakaf.module.css'; // Kita pakai style yg ada aja

export default function WakafStatusPage() {
  return (
    <PageWrapper>
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        background: '#f9f9f9'
      }}>
        
        {/* Ikon Sukses Animasi */}
        <div style={{
          width: '80px',
          height: '80px',
          background: '#d4edda',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
          color: '#155724',
          fontSize: '2.5rem'
        }}>
          ✔
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1a5f51', marginBottom: '0.5rem' }}>
          Jazakumullah Khairan Katsiran
        </h1>
        
        <p style={{ maxWidth: '500px', color: '#666', lineHeight: '1.6', marginBottom: '2rem' }}>
          Terima kasih telah berwakaf. Semoga Allah menerima amal jariyah Anda, 
          melipatgandakan rezeki, dan menjadikannya pemberat timbangan kebaikan di akhirat kelak.
        </p>

        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px', marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.9rem', color: '#999', marginBottom: '0.5rem' }}>Status Transaksi</p>
          <h3 style={{ color: '#333', fontWeight: 'bold' }}>Sedang Diverifikasi</h3>
          <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>
            Sistem kami sedang menunggu konfirmasi pembayaran dari Bank.
            Notifikasi akan dikirim ke WhatsApp Anda.
          </p>
        </div>

        <Link href="/" style={{
          padding: '12px 30px',
          background: '#1a5f51',
          color: 'white',
          borderRadius: '50px',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>
          Kembali ke Beranda
        </Link>

      </div>
    </PageWrapper>
  );
}