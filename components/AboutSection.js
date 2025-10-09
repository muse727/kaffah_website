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
    } else {
      document.body.style.overflow = 'auto';
    }
    // Cleanup function untuk memastikan scroll kembali normal
    return () => {
      document.body.style.overflow = 'auto';
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
              />
            </div>
            <div className={styles.textContent} data-aos="fade-left" data-aos-delay="200">
              <span className={styles.subtitle}>{subtitle}</span>
              <h2 className={styles.title}>{title}</h2>
              <p className={styles.summary}>{summaryText}</p>
              <button onClick={() => setIsModalOpen(true)} className={styles.readMoreButton}>
                Selengkapnya
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== POPUP / MODAL ===== */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div 
            className={styles.modalContent} 
            onClick={(e) => e.stopPropagation()} // Mencegah popup tertutup saat diklik di dalam konten
          >
            <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>
              &times;
            </button>
            <span className={styles.subtitle}>{subtitle}</span>
            <h2 className={styles.title}>{title}</h2>
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