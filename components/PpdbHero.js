'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import styles from '../styles/PpdbHero.module.css';

// Komponen sekarang tidak lagi menerima props 'banner'
const PpdbHero = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    gsap.from(heroRef.current, { opacity: 0, duration: 1, ease: 'power3.out' });
  }, []);

  // Langsung definisikan path gambar di sini
  const bannerImageUrl = "/ppdb-banner.png"; // <-- Ganti nama file ini jika perlu

  return (
    <section className={styles.heroSection} ref={heroRef}>
      <Image
        src={bannerImageUrl} // Langsung pakai path dari folder public
        alt="Banner PPDB Sekolah Al Mubarak"
        fill
        priority
        style={{ objectFit: 'cover' }}
      />
    </section>
  );
};

export default PpdbHero;