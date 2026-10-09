'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import CSS Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import styles from '../styles/SejarahSection.module.css';

// 🔥 FIX DATA SEJARAH: Disesuaikan dengan sejarah KH. Fathullah Harun & Kaffah Islamic School
const historySlidesData = [
  {
    year: '2016',
    title: 'Awal Berdiri & Wakaf',
    text: 'SDIT Kaffah Islamic School resmi didirikan di atas tanah wakaf KH. Fathullah Harun sebagai wujud kepedulian terhadap pentingnya pendidikan Islam yang berkualitas.',
    image: '/images/history/history-1.jpg',
  },
  {
    year: '2017 - 2018',
    title: 'Membangun Generasi Qurani',
    text: 'Mulai menerapkan branding "Sekolah Qurani – Generasi Rabbani". Pembelajaran dan ekstrakurikuler diintegrasikan secara penuh dengan nilai-nilai agung Al-Qur’an.',
    image: '/images/history/history-2.jpg',
  },
  {
    year: '2019 - 2021',
    title: 'Penguatan Karakter & Akhlak',
    text: 'Menekankan keterpaduan antara ilmu pengetahuan umum dan agama Islam untuk mencetak siswa yang cerdas, mandiri, dan memiliki kepribadian Islami yang kuat.',
    image: '/images/history/history-3.jpg',
  },
  {
    year: '2022 - 2024',
    title: 'Menghadapi Era Globalisasi',
    text: 'Melanjutkan visi misi ulama besar Betawi, KH. Fathullah Harun, sekolah terus berinovasi dalam metode pembelajaran agar siswa siap menghadapi tantangan zaman modern.',
    image: '/images/history/history-4.jpg',
  },
  {
    year: '2025 - Sekarang',
    title: 'Cahaya Ilmu Masa Depan',
    text: 'Terus berkembang menjadi sekolah dasar Islam terpadu rujukan yang melahirkan generasi Rabbani yang unggul secara akademik dan spiritual.',
    image: '/images/history/history-5.jpg',
  },
];

const SejarahSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isModalOpen]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <>
      <section className={styles.sejarahSection}>
        <div className="container">
          <div className={styles.contentWrapper} data-aos="fade-up">
            <div className={styles.imageContainer}>
              <div className={styles.imageFrame}>
                <Image 
                  src="/images/siswi-berprestasii.png" 
                  alt="Sejarah Kaffah Islamic School" 
                  fill 
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                  className={styles.mainImage}
                />
              </div>
              <div className={styles.yearBadge}>
                <span>Since 2016</span>
              </div>
            </div>
            
            <div className={styles.textContent}>
              <div className={styles.sectionLabel}>
                <span>Our Journey</span>
              </div>
              
              <h2 className={styles.title}>
                Yuk.. Ketahui <span className={styles.highlight}>Sejarah Singkat</span> Kaffah Islamic School
              </h2>
              
              <p className={styles.description}>
                SDIT Kaffah Islamic School didirikan pada tahun 2016 di atas tanah wakaf ulama besar Betawi, KH. Fathullah Harun, dengan visi mewujudkan pendidikan terpadu yang mencetak generasi Qurani yang Rabbani, berakhlak mulia, cerdas, dan mandiri.
              </p>

              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>8+</span>
                  <span className={styles.statLabel}>Tahun Mengabdi</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>5</span>
                  <span className={styles.statLabel}>Fase Perjalanan</span>
                </div>
              </div>
              
              <button 
                onClick={() => setIsModalOpen(true)} 
                className={styles.readMoreButton}
              >
                <span>Telusuri Perjalanan Kami</span>
                <div className={styles.buttonIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== POPUP SLIDER SEJARAH ===== */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div className={styles.modalHeader}>
              <h2>Perjalanan Sejarah</h2>
              <p>Kaffah Islamic School</p>
            </div>
            
            <Swiper
              modules={[Navigation, Pagination]}
              navigation={{
                nextEl: `.${styles.swiperButtonNext}`,
                prevEl: `.${styles.swiperButtonPrev}`,
              }}
              pagination={{ 
                clickable: true, 
                el: `.${styles.swiperPagination}`,
                renderBullet: function (index, className) {
                  return `<span class="${className}">${historySlidesData[index].year.split(' - ')[0]}</span>`;
                }
              }}
              className={styles.swiper}
            >
              {historySlidesData.map((slide, index) => (
                <SwiperSlide key={slide.year}>
                  <div className={styles.slideContent}>
                    <div className={styles.slideImageContainer}>
                      <div className={styles.slideImage}>
                        <Image 
                          src={slide.image} 
                          alt={slide.title} 
                          fill 
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className={styles.slideNumber}>
                        <span>0{index + 1}</span>
                      </div>
                    </div>
                    <div className={styles.slideText}>
                      <div className={styles.slideHeader}>
                        <span className={styles.slideYear}>{slide.year}</span>
                        <h3 className={styles.slideTitle}>{slide.title}</h3>
                      </div>
                      <p className={styles.slideDescription}>{slide.text}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            
            {/* Navigasi & Paginasi Custom - Hilangkan di mobile */}
            {!isMobile && (
              <div className={styles.swiperControls}>
                <div className={styles.swiperButtonPrev}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className={styles.swiperPagination}></div>
                <div className={styles.swiperButtonNext}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SejarahSection;