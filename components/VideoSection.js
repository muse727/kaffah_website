'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../styles/VideoSection.module.css';

const VideoSection = ({ subtitle, title, principalImage, vimeoUrl }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);

  return (
    <>
      <section className={styles.videoSection}>
        <div className="container">
          <div className={styles.greenWrapper} data-aos="fade-up">
            
            {/* Kolom Kiri (Sekarang satu-satunya item di grid) */}
            <div className={styles.leftColumn}>
              <div className={styles.textHeader}>
                <span className={styles.subtitle}>{subtitle}</span>
                <h2 className={styles.title}>{title}</h2>
              </div>
              <div className={styles.videoThumbnail} onClick={() => setIsModalOpen(true)}>
                <div className={styles.playButton}>
                  <Image src="/icons/play-icon.svg" alt="Play Video" width={80} height={80} />
                </div>
              </div>
            </div>

            {/* Gambar Kepala Sekolah (Dikeluarkan dari grid) */}
            <div className={styles.principalImage}>
              <Image 
                src={principalImage} 
                alt={title} 
                fill 
                style={{ objectFit: 'contain', objectPosition: 'bottom center' }} 
              />
            </div>

          </div>
        </div>
      </section>

      {/* ===== POPUP / MODAL VIDEO (Tidak berubah) ===== */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>&times;</button>
            <div className={styles.videoEmbedContainer}>
              <iframe
                src={`${vimeoUrl}?autoplay=1&title=0&byline=0&portrait=0`}
                width="100%" height="100%" frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoSection;
