"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/WakafModal.module.css';

export default function WakafPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Cek apakah user sudah pernah tutup popup hari ini
    const lastClosed = localStorage.getItem('wakafPopupClosed');
    const now = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000; 

    // Logic: Muncul jika belum pernah ditutup ATAU sudah lewat 1 hari
    if (!lastClosed || now - lastClosed > oneDay) {
      const timer = setTimeout(() => {
        setShow(true);
      }, 3000); // Muncul setelah 3 detik buka web
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    localStorage.setItem('wakafPopupClosed', new Date().getTime());
  };

  if (!show) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button onClick={handleClose} className={styles.closeButton}>&times;</button>
        
        <div className={styles.imagePlaceholder}>
          {/* Nanti ganti pakai foto pembangunan asli */}
          <div className={styles.image}>
            <Image src="/images/sekolah-renov.png" alt="Pembangunan Sekolah" width={300} height={200} />
          </div>
        </div>

        <div className={styles.content}>
          <span className={styles.bismillah}>﷽</span>
          <h3 className={styles.title}>Alirkan Pahala Jariyah</h3>
          <p className={styles.text}>
            "Pahala yang terus mengalir meski raga telah tiada, dengan turut serta membangun fasilitas pendidikan generasi Qur'ani."
          </p>
          
          <Link href="/wakaf" className={styles.btnPrimary} onClick={handleClose}>
            WAKAF SEKARANG
          </Link>

          <button onClick={handleClose} className={styles.btnSecondary}>
            Nanti saja, Insya Allah
          </button>
        </div>
      </div>
    </div>
  );
}