'use client';

import Lottie from 'lottie-react';
import Link from 'next/link';
import styles from '../styles/UnderConstruction.module.css';
import animationData from '../public/animations/construction.json'; // Import animasi

const UnderConstruction = () => {
  return (
    <div className={styles.container}>
      <div className={styles.lottieWrapper}>
        <Lottie animationData={animationData} loop={true} />
      </div>
      <h1 className={styles.title}>Halaman Sedang Dalam Perbaikan</h1>
      <p className={styles.description}>
        Kami sedang bekerja keras untuk segera meluncurkan halaman ini. Terima kasih atas kesabaran Anda!
      </p>
      <Link href="/" className={styles.homeButton}>
        Kembali ke Beranda
      </Link>
    </div>
  );
};

export default UnderConstruction;