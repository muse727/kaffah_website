"use client";

import { useState, useEffect } from 'react';
import styles from '../../styles/Pengumuman.module.css';
import PageWrapper from '../../components/PageWrapper';
import Confetti from 'react-confetti'; // Import ini bro

// --- DATA LOKAL SISWA ---
const DATA_SISWA = [
  { no: "001", nama: "Ahmad Zaki", unit: "SMPIT", asal: "SDIT Al Hidayah", status: "LULUS" },
  { no: "002", nama: "Adiba Claretta Jasmine", unit: "SMPIT", asal: "SDIT Kaffah Islamic School", status: "LULUS" },
  { no: "003", nama: "Alfi Zahrin Qurrotul'aini", unit: "SMPIT", asal: "SDIT Al Mubarak", status: "LULUS" },
  { no: "004", nama: "Abiyan Arka Qurrachman", unit: "SMPIT", asal: "SDIT Al Mubarak", status: "LULUS" },
  { no: "005", nama: "Khansa Sabina Arosyidin", unit: "SMPIT", asal: "SDN Sumur Batu 01 Pagi", status: "LULUS" },
  { no: "006", nama: "Aurelia Khansa Azzahra", unit: "SMPIT", asal: "SDN Cempaka Putih Barat 07", status: "LULUS" },
  { no: "007", nama: "Gaza Haidar Althaf Agustian", unit: "SMPIT", asal: "SDIT Al Mubarak", status: "LULUS" },
  { no: "008", nama: "Khaylila Sidqia Adran", unit: "SMPIT", asal: "SDIT Al Mubarak", status: "LULUS" },
  { no: "009", nama: " Jihan Ramadhani Herdiansyah", unit: "SMPIT", asal: "SDIT Al Mubarak", status: "LULUS" },
  



];

export default function PengumumanPage() {
  const [search, setSearch] = useState('');
  const [result, setResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State untuk ukuran layar (biar confetti pas)
  const [windowDimension, setWindowDimension] = useState({ width: 0, height: 0 });

  // Ambil ukuran layar saat pertama kali load
  useEffect(() => {
    setWindowDimension({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    setLoading(true);
    setResult(null);
    setHasSearched(false);

    setTimeout(() => {
      const found = DATA_SISWA.find(siswa => 
        siswa.no === search.trim() || 
        siswa.nama.toLowerCase().includes(search.toLowerCase())
      );
      
      setResult(found || null);
      setHasSearched(true);
      setLoading(false);
    }, 800);
  };

  return (
    <PageWrapper>
      {/* CONFETTI HANYA MUNCUL KALAU LULUS */}
      {result && result.status === 'LULUS' && (
        <div className={styles.confettiWrapper}>
          <Confetti 
            width={windowDimension.width} 
            height={windowDimension.height} 
            recycle={false} // Confetti berhenti setelah beberapa detik (biar gak berat)
            numberOfPieces={500} // Jumlah kertasnya
            gravity={0.2}
          />
        </div>
      )}

      <div className={styles.container}>
        
        <div className={styles.titleSection}>
          <h1>Pengumuman Kelulusan</h1>
          <p>Masukkan Nomor Peserta atau Nama Lengkap untuk melihat hasil seleksi.</p>
        </div>

        {/* Input Pencarian */}
        <div className={styles.searchBox}>
          <form onSubmit={handleSearch} className={styles.inputGroup}>
            <input 
              type="text" 
              placeholder="Contoh: 24001 atau Ahmad" 
              className={styles.input}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? 'Memeriksa Data...' : 'Cek Kelulusan'}
            </button>
          </form>
        </div>

        {/* --- TAMPILAN HASIL --- */}
        {result && (
          <div className={styles.resultCard}>
            
            {/* Header Status */}
            <div className={`${styles.cardHeader} ${result.status === 'LULUS' ? styles.lulus : styles.tidakLulus}`}>
              <h2 className={styles.statusText}>
                {result.status === 'LULUS' ? 'LULUS' : 'MOHON MAAF'}
              </h2>
            </div>
            
            <div className={styles.cardBody}>
              {/* Data Siswa */}
              <h3 className={styles.studentName}>{result.nama}</h3>
              <span className={styles.studentId}>No. Peserta: {result.no}</span>
              
              <table className={styles.detailTable}>
                <tbody>
                  <tr><td>Unit Tujuan</td><td>: <strong>{result.unit}</strong></td></tr>
                  <tr><td>Asal Sekolah</td><td>: {result.asal}</td></tr>
                </tbody>
              </table>

              {/* --- SURAT KEPUTUSAN (Hanya Muncul Jika Lulus) --- */}
              {result.status === 'LULUS' && (
                <div className={styles.announcementBox}>
                  <span className={styles.bismillah}>Bismillahirrahmaanirrahiim</span>
                  
                  {/* Animasi Shimmer di sini */}
                  <h3 className={styles.shimmerText}>✨✨ SELAMAT ✨✨</h3>
                  
                  <p>
                    Ananda dinyatakan <strong>LULUS</strong> tes observasi dan diterima menjadi siswa 
                    <strong> {result.unit} Al Mubarak</strong> Tahun Pelajaran 2026/2027.
                  </p>

                  <p>
                    Selanjutnya Ayah/Bunda beserta Ananda wajib melakukan <strong>lapor diri</strong> pada:
                    <br />
                    📅 <strong>Hari:</strong> Rabu - Jum'at (17-19 Desember 2025)
                    <br />
                    ⏰ <strong>Jam:</strong> 08.00 - 15.00 WIB
                    <br />
                    📍 <strong>Lokasi:</strong> Kantor SMPIT Al Mubarak Lantai III
                  </p>

                  <p>
                    <strong>Catatan Penting:</strong>
                    <br/>
                    1. Saat melapor diri, ada <strong>Pakta Integritas</strong> yang harus ditandatangani Ayah/Bunda.
                    <br/>
                    2. Mohon siapkan <strong>materai 10.000</strong> (jika tidak membawa, sekolah menyediakan dengan biaya Rp 12.000).
                    <br/>
                    3. Lembar Pakta Integritas akan dishare di grup WA.
                    <br/>
                    4. Setelah tanda tangan Pakta Integritas, siswa langsung melakukan <strong>pengukuran seragam</strong>.
                  </p>

                  <p className={styles.warningText}>
                    ⚠️ Jika tidak melakukan lapor diri pada waktu yang telah ditentukan tanpa konfirmasi ke panitia, maka dinyatakan MENGUNDURKAN DIRI.
                  </p>

                  <p>
                    Demikian informasi ini disampaikan. Atas perhatian dan kerjasamanya diucapkan terima kasih. 
                    <br/><em>Jazaakallah khair.</em>
                  </p>

                  <div className={styles.signature}>
                    Tertanda,<br/>
                    Panitia SPMB
                  </div>
                </div>
              )}

              {/* Pesan Jika Tidak Lulus */}
              {result.status !== 'LULUS' && (
                <div style={{marginTop: '2rem', color: '#666'}}>
                  <p>Tetap semangat! Masih banyak jalan menuju kesuksesan.</p>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Not Found */}
        {hasSearched && !result && !loading && (
          <div className={styles.notFound}>
            Data tidak ditemukan. Mohon periksa kembali Nomor Peserta atau Nama.
          </div>
        )}

      </div>
    </PageWrapper>
  );
}