'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import styles from '../styles/FinalCta.module.css';

const FinalCta = () => {
  const ctaRef = useRef(null);
  const [showTokenOptions, setShowTokenOptions] = useState(false);

  useEffect(() => {
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

  const handleTokenClick = (jenjang) => {
    const message = `Assalaamualaikum WR WB, saya ingin meminta token untuk pendaftaran PPDB SIT Al Mubarak ${jenjang}`;
    
    
    const adminNumbers = {
      sd: "6283891116376", // Admin SD
      smp: "6289512322694" // Admin SMP
    };

    const adminNumber = adminNumbers[jenjang];
    window.open(`https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const toggleTokenOptions = () => {
    setShowTokenOptions(!showTokenOptions);
  };

  return (
    <section className={styles.section} ref={ctaRef}>
      <div className={styles.container}>
        <h2 className={styles.title}>Daftar Sekarang!</h2>
        <p className={styles.description}>
          Untuk melanjutkan pendaftaran, mintalah token terlebih dahulu kepada admin sesuai jenjang
        </p>
        
        <div className={styles.buttonGroup}>
          {/* Tombol Minta Token dengan Options */}
          <div className={styles.tokenSection}>
            <button 
              onClick={toggleTokenOptions}
              className={styles.tokenMainButton}
            >
              💬 Minta Token
              <span className={`${styles.arrow} ${showTokenOptions ? styles.arrowUp : ''}`}>
                ▼
              </span>
            </button>
            
            {showTokenOptions && (
              <div className={styles.tokenOptions}>
                <button 
                  onClick={() => handleTokenClick('sd')}
                  className={styles.tokenOptionButton}
                >
                  🎒 Untuk SD
                </button>
                <button 
                  onClick={() => handleTokenClick('smp')}
                  className={styles.tokenOptionButton}
                >
                  📚 Untuk SMP
                </button>
              </div>
            )}
          </div>

          <Link 
            href="https://ppdb.sitalmubarak.sch.id/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaButton}
          >
            🚀 DAFTAR SEKARANG
          </Link>
        </div>

        <p className={styles.note}>
          Sudah punya token? Langsung klik tombol <strong>"DAFTAR SEKARANG"</strong>
        </p>

        <div className={styles.adminInfo}>
          <h3>📞 Kontak Admin</h3>
          <div className={styles.adminContacts}>
            <div className={styles.adminContact}>
              <strong>Admin SD:</strong> 
              <span>0838-9111-6376</span>
            </div>
            <div className={styles.adminContact}>
              <strong>Admin SMP:</strong> 
              <span>0821-2598-1931</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCta;