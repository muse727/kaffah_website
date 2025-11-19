'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import styles from '../styles/FinalCta.module.css';

const FinalCta = () => {
  const ctaRef = useRef(null);
  const [showTokenOptions, setShowTokenOptions] = useState(false);
  const tokenSectionRef = useRef(null);

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

  // Close token options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tokenSectionRef.current && !tokenSectionRef.current.contains(event.target)) {
        setShowTokenOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleTokenClick = (jenjang) => {
    const message = `saya ingin meminta token untuk pendaftaran PPDB SIT Al Mubarak ${jenjang}`;
    
    const adminNumbers = {
      sd: "6289517036100", // Admin SD
      smp: "6287826022864" // Admin SMP
    };

    const adminNumber = adminNumbers[jenjang];
    window.open(`https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`, '_blank');
    setShowTokenOptions(false);
  };

  const toggleTokenOptions = (e) => {
    e.stopPropagation();
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
          <div className={styles.tokenSection} ref={tokenSectionRef}>
            <button 
              onClick={toggleTokenOptions}
              className={styles.tokenMainButton}
              aria-expanded={showTokenOptions}
              aria-label="Pilih jenis token"
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
                  aria-label="Minta token untuk SD"
                >
                  🎒 Untuk SD
                </button>
                <button 
                  onClick={() => handleTokenClick('smp')}
                  className={styles.tokenOptionButton}
                  aria-label="Minta token untuk SMP"
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
            aria-label="Pergi ke halaman pendaftaran PPDB"
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
              <a href="https://wa.me/6289517036100" target="_blank" rel="noopener noreferrer">
                0895-1703-6100
              </a>
            </div>
            <div className={styles.adminContact}>
              <strong>Admin SMP:</strong> 
              <a href="https://wa.me/6287826022864" target="_blank" rel="noopener noreferrer">
                0878-2602-2864
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCta;