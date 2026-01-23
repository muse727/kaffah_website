'use client';

import { useState } from 'react';
import styles from './Pengumuman.module.css';
import confetti from 'canvas-confetti';
import { FiSearch, FiDownload, FiCheckCircle } from 'react-icons/fi';

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
        tampilkanConfetti();
      }
    } catch (error) {
      console.error(error);
      alert("Error sistem.");
    } finally {
      setLoading(false);
    }
  };

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
    link.download = `Poster-Wisuda-${hasil.nama}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.container}>
      {/* Background Ornament Pattern */}
      <div className={styles.patternOverlay}></div>

      <div className={styles.contentWrapper}>
        
        {/* Header Premium */}
        <div className="text-center mb-8">
          <span className={styles.badge}>PORTAL RESMI 2026</span>
          <h1 className={styles.mainTitle}>Wisuda Tahfizh Al-Qur'an</h1>
          <p className={styles.subTitle}>Yayasan Al-Mubarak</p>
        </div>
        
        {/* Search Box */}
        <form onSubmit={handleCekKelulusan} className={styles.searchBox}>
          <div className={styles.inputWrapper}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Masukkan Nama Lengkap Santri..."
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
            {hasil.status === 'NOT_FOUND' ? (
              <div className={styles.notFoundCard}>
                ❌ Mohon maaf, data santri tidak ditemukan.
              </div>
            ) : (
              <div className={styles.successCard}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.congratsTitle}>Barakallah Fiikum!</h2>
                  <p className={styles.santriName}>{hasil.nama}</p>
                  <div className={styles.verifiedBadge}>
                     <FiCheckCircle /> Terverifikasi Lulus
                  </div>
                </div>
                
                {/* Frame Emas buat Poster */}
                <div className={styles.posterFrame}>
                  {hasil.posterUrl ? (
                    <img src={hasil.posterUrl} alt="Poster Kelulusan" className={styles.posterImage} />
                  ) : (
                    <div className="p-10 bg-gray-100 text-gray-500">Poster belum tersedia.</div>
                  )}
                </div>

                <div className={styles.quoteBox}>
                  "Sebaik-baik kalian adalah yang mempelajari Al-Qur'an dan mengajarkannya."
                </div>

                <button onClick={handleDownload} className={styles.downloadBtn}>
                  <FiDownload className="mr-2" /> Download Poster Digital
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}