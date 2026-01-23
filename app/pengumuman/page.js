'use client';

import { useState } from 'react';
import styles from './Pengumuman.module.css'; // Pastikan CSS lu udah update
import confetti from 'canvas-confetti';
import { FiSearch, FiDownload, FiCheckCircle, FiInfo } from 'react-icons/fi';

export default function PengumumanPage() {
  const [inputNama, setInputNama] = useState('');
  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCekKelulusan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHasil(null);

    try {
      const response = await fetch('/api/cek-kelulusan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama: inputNama }),
      });

      const data = await response.json();

      if (data.status === 'NOT_FOUND') {
        setHasil({ status: 'NOT_FOUND' });
      } else {
        setHasil(data);
        // HANYA NYALAKAN KEMBANG API KALAU LULUS
        if (data.status === 'LULUS') {
            tampilkanConfetti();
        }
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  // Efek Kembang Api
  const tampilkanConfetti = () => {
    var duration = 3 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    var interval = setInterval(function() {
      var timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) { return clearInterval(interval); }
      var particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 }, colors: ['#FFD700', '#006400', '#FFFFFF'] });
    }, 250);
  };

  const handleDownload = () => {
    if (!hasil?.posterUrl) return;
    const link = document.createElement('a');
    link.href = hasil.posterUrl;
    link.download = `Poster-${hasil.nama}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className="text-center mb-8">
          <span className={styles.badge}>PORTAL RESMI 2026</span>
          <h1 className={styles.mainTitle}>Wisuda Tahfizh Al-Qur'an</h1>
          <p className={styles.subTitle}>SIT Al Mubarak</p>
        </div>
        
        {/* SEARCH BOX */}
        <form onSubmit={handleCekKelulusan} className={styles.searchBox}>
          <div className={styles.inputWrapper}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Masukkan Nama Santri..."
              value={inputNama}
              onChange={(e) => setInputNama(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Mencari...' : 'Cek Status'}
          </button>
        </form>

        {hasil && (
          <div className={styles.resultContainer}>
            
            {/* STATUS: TIDAK DITEMUKAN */}
            {hasil.status === 'NOT_FOUND' ? (
              <div className={styles.notFoundCard}>❌ Data santri tidak ditemukan.</div>
            ) : (
              
              // LOGIKA UTAMA: CEK STATUS LULUS/BELUM
              // Perhatikan ternary operator ini: ? styles.successCard : styles.pendingCard
              <div className={hasil.status === 'LULUS' ? styles.successCard : styles.pendingCard}>
                
                <div className={styles.cardHeader}>
                  {/* Judul Berubah Sesuai Status */}
                  <h2 className={hasil.status === 'LULUS' ? styles.congratsTitle : styles.spiritTitle}>
                    {hasil.status === 'LULUS' ? "BARAKALLAH FIIKUM!" : "TETAP SEMANGAT!"}
                  </h2>
                  
                  <p className={styles.santriName}>{hasil.nama}</p>
                  
                  {/* Badge Berubah Sesuai Status */}
                  <div className={hasil.status === 'LULUS' ? styles.verifiedBadge : styles.pendingBadge}>
                     {hasil.status === 'LULUS' ? <FiCheckCircle /> : <FiInfo />} 
                     {hasil.status === 'LULUS' ? "Terverifikasi Lulus" : "Belum Lulus"}
                  </div>
                </div>

                {/* Konten Bawah: Poster (Lulus) vs Pesan (Belum) */}
                {hasil.status === 'LULUS' ? (
                    <>
                        <div className={styles.posterFrame}>
                          {hasil.posterUrl ? (
                            <img src={hasil.posterUrl} alt="Poster" className={styles.posterImage} />
                          ) : (
                            <div className="p-10 bg-gray-100 text-gray-500 italic">Poster sedang diproses admin.</div>
                          )}
                        </div>
                        {hasil.posterUrl && (
                            <button onClick={handleDownload} className={styles.downloadBtn}>
                            <FiDownload className="mr-2" /> Download Poster
                            </button>
                        )}
                    </>
                ) : (
                    // --- TAMPILAN KHUSUS BELUM LULUS ---
                    <>
                        <div className={styles.messageBox}>
                            <p className={styles.messageText}>
                                "{hasil.pesan || "Kegagalan adalah awal keberhasilan. Teruslah murajaah!"}"
                            </p>
                        </div>
                        <div className={styles.quoteBox} style={{marginTop: '1rem'}}>
                          Insya Allah kesempatan masih terbuka lebar.
                        </div>
                    </>
                )}

              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}