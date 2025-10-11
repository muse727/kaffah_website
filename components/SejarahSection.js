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

// CONTOH DATA SEJARAH (5 SLIDE)
const historySlidesData = [
  {
    year: '2003 - 2005',
    title: 'Cikal Bakal & Perintisan',
    text: 'Berawal dari kepedulian sekelompok pemuda dan tokoh masyarakat, kegiatan pendidikan dimulai dalam bentuk kelompok belajar kecil untuk anak-anak di lingkungan sekitar.',
    image: '/images/history/history-1.jpg',
  },
  {
    year: '2006 - 2010',
    title: 'Pendirian SDIT Al Mubarak',
    text: 'Melihat antusiasme yang tinggi, Yayasan Wakfiah Al Mubarak resmi didirikan dan membuka unit pendidikan formal pertama, yaitu Sekolah Dasar Islam Terpadu (SDIT).',
    image: '/images/history/history-2.jpg',
  },
  {
    year: '2011 - 2015',
    title: 'Pengembangan & Akreditasi',
    text: 'Fase pertumbuhan pesat dengan penambahan fasilitas dan ruang kelas. SDIT Al Mubarak berhasil meraih Akreditasi "A" dari BAN-S/M, sebuah pengakuan atas kualitas pendidikan.',
    image: '/images/history/history-3.jpg',
  },
  {
    year: '2016 - 2020',
    title: 'Ekspansi ke Jenjang SMP',
    text: 'Untuk melanjutkan jenjang pendidikan yang berkesinambungan, SMPIT Al Mubarak didirikan dengan program unggulan Pesantren City untuk menjawab kebutuhan pendidikan modern.',
    image: '/images/history/history-4.jpg',
  },
  {
    year: '2021 - Sekarang',
    title: 'Inovasi & Digitalisasi',
    text: 'Mengadaptasi perkembangan teknologi, yayasan mulai menerapkan digitalisasi sekolah, mengembangkan program coding, dan terus berinovasi untuk mencetak generasi yang siap zaman.',
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
                  alt="Sejarah Al Mubarak" 
                  fill 
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                  className={styles.mainImage}
                />
              </div>
              <div className={styles.yearBadge}>
                <span>Since 2003</span>
              </div>
            </div>
            
            <div className={styles.textContent}>
              <div className={styles.sectionLabel}>
                <span>Our Journey</span>
              </div>
              
              <h2 className={styles.title}>
                Yuk.. Ketahui <span className={styles.highlight}>Sejarah Singkat</span> Yayasan Wakfiah Al Mubarak
              </h2>
              
              <p className={styles.description}>
                Yayasan Wakfiah Al Mubarak berdiri atas dasar kepedulian terhadap umat dan semangat untuk menebarkan manfaat seluas-luasnya. Yayasan ini didirikan pada tahun 2018 oleh sekelompok pemuda...
              </p>

              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>20+</span>
                  <span className={styles.statLabel}>Tahun Pengalaman</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>5</span>
                  <span className={styles.statLabel}>Tahap Perkembangan</span>
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
              <p>Yayasan Wakfiah Al Mubarak</p>
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