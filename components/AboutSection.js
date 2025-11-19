'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../styles/AboutSection.module.css';

const AboutSection = ({ subtitle, title, summaryText, fullText, imageSrc, imageAlt }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Efek untuk mengunci scroll di background saat popup terbuka
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none'; // Important for mobile
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.touchAction = 'auto';
    }
    // Cleanup function untuk memastikan scroll kembali normal
    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.touchAction = 'auto';
    };
  }, [isModalOpen]);

  // Close modal dengan ESC key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.keyCode === 27) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isModalOpen]);

  return (
    <>
      <section className={styles.aboutSection}>
        <div className="container">
          <div className={styles.aboutGrid}>
            <div className={styles.imageContainer} data-aos="fade-right">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
            <div className={styles.textContent} data-aos="fade-left" data-aos-delay="200">
              <span className={styles.subtitle}>{subtitle}</span>
              <h2 className={styles.title}>{title}</h2>
              <p className={styles.summary}>{summaryText}</p>
              <button 
                onClick={() => setIsModalOpen(true)} 
                className={styles.readMoreButton}
                aria-label="Baca selengkapnya tentang section ini"
              >
                Selengkapnya
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== POPUP / MODAL ===== */}
      {isModalOpen && (
        <div 
          className={styles.modalOverlay} 
          onClick={() => setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div 
            className={styles.modalContent} 
            onClick={(e) => e.stopPropagation()} // Mencegah popup tertutup saat diklik di dalam konten
          >
            <button 
              className={styles.closeButton} 
              onClick={() => setIsModalOpen(false)}
              aria-label="Tutup modal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <span className={styles.subtitle}>{subtitle}</span>
            <h2 id="modal-title" className={styles.title}>{title}</h2>
            <div className={styles.fullTextView}>
              {fullText.split('\n').map((paragraph, index) => 
                paragraph.trim() !== '' && <p key={index}>{paragraph}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AboutSection;