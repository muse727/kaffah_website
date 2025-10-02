'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import styles from '../styles/FinalCta.module.css';

const FinalCta = () => {
  const ctaRef = useRef(null);

  useEffect(() => {
    // Animasi GSAP untuk tombol
    gsap.from(ctaRef.current, {
      scrollTrigger: {
        trigger: ctaRef.current,
        start: 'top 90%',
      },
      opacity: 0,
      scale: 0.8,
      duration: 1,
      ease: 'elastic.out(1, 0.5)',
    });
  }, []);

  return (
    <section className={styles.section} ref={ctaRef}>
      <Link 
        href="https://ppdb.sitalmubarak.sch.id/"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.ctaButton}
      >
        DAFTAR SEKARANG
      </Link>
    </section>
  );
};

export default FinalCta;