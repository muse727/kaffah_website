'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

import styles from '../styles/Testimonial.module.css';

// DATA TESTIMONI DENGAN LINK VIMEO BARU
const testimonialsData = [
  {
    name: 'Orang Tua Siswi SMPIT',
    title: 'Wali Murid Angkatan Pertama',
    quote: '"Alhamdulillah, putri kami mendapatkan lingkungan belajar yang sangat mendukung di SMPIT Al Mubarak. Guru-gurunya peduli dan fasilitasnya lengkap."',
    thumbnail: '/testimonial-photo-1.png',
    avatar: '/author-avatar-1.png',
    videoUrl: 'https://player.vimeo.com/video/1123886147?autoplay=1&title=0&byline=0&portrait=0'
  },
  {
    name: 'H. Ismail, S.Pd., M.H',
    title: 'Anggota Komisi B DPRD DKI Jakarta Wali Murid SMPIT Al Mubarak',
    quote: '"Kurikulum di Al Mubarak sangat seimbang antara pendidikan agama dan umum. Anak saya senang sekolah di sini dan perkembangan akhlaknya sangat terlihat."',
    thumbnail: '/testimonial-photo-2.png',
    avatar: '/author-avatar-2.jpeg',
    videoUrl: 'https://player.vimeo.com/video/1123887901?autoplay=1&title=0&byline=0&portrait=0'
  },
  {
    name: 'Muhammad Nurohman',
    title: 'Drummer Band Ungu Wali Murid SMPIT Al Mubarak',
    quote: '"Sebagai angkatan pertama, kami melihat langsung komitmen yayasan dalam memberikan yang terbaik. Kami bangga menjadi bagian dari keluarga besar Al Mubarak."',
    thumbnail: '/testimonial-photo-3.png',
    avatar: '/author-avatar-3.jpg',
    videoUrl: 'https://player.vimeo.com/video/1123888522?autoplay=1&title=0&byline=0&portrait=0'
  },
];

const Testimonial = () => {
  const [activeVideoUrl, setActiveVideoUrl] = useState(null);
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
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

  // Effect untuk handle ESC key dan scroll lock
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.keyCode === 27) {
        setActiveVideoUrl(null);
      }
    };

    if (activeVideoUrl) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [activeVideoUrl]);

  // Touch event handlers untuk swipe down (mobile only)
  const handleTouchStart = (e) => {
    if (!isMobile) return;
    
    setStartY(e.touches[0].clientY);
    setCurrentY(e.touches[0].clientY);
    setIsSwiping(true);
  };

  const handleTouchMove = (e) => {
    if (!isMobile || !isSwiping) return;
    
    const touchY = e.touches[0].clientY;
    setCurrentY(touchY);
    
    // Berikan feedback visual saat swipe down
    const diff = touchY - startY;
    if (diff > 0) {
      e.currentTarget.style.transform = `translateY(${diff}px)`;
      e.currentTarget.style.opacity = `${1 - (diff / 500)}`;
    }
  };

  const handleTouchEnd = (e) => {
    if (!isMobile || !isSwiping) return;
    
    const diff = currentY - startY;
    
    // Jika swipe down lebih dari 100px, close modal
    if (diff > 100) {
      setActiveVideoUrl(null);
    } else {
      // Reset posisi jika tidak cukup jauh
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.opacity = '1';
    }
    
    setIsSwiping(false);
    setStartY(0);
    setCurrentY(0);
  };

  // Click outside to close (desktop only)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isMobile) {
      setActiveVideoUrl(null);
    }
  };

  const handleCloseModal = () => {
    setActiveVideoUrl(null);
  };

  return (
    <>
      <section className={styles.section} id="testimonial">
        <div className="container">
          <div className={styles.header} data-aos="fade-up">
            <span className={styles.subTitle}>TESTIMONI</span>
            <h2 className={styles.title}>
              Pengalaman Nyata, Hasil Terbukti: Apa Kata Orang Tua Murid Kami?
            </h2>
            <p className={styles.description}>
              Temukan cerita-cerita inspiratif dari para wali murid mengenai perkembangan anak-anak mereka dan kualitas pendidikan di Yayasan Al Mubarak.
            </p>
          </div>

          <div className={styles.sliderWrapper} data-aos="fade-up" data-aos-delay="200">
            <Swiper
              modules={[Navigation]}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              loop={true}
              spaceBetween={30}
              slidesPerView={1}
              className={styles.swiper}
            >
              {testimonialsData.map((testimonial, index) => (
                <SwiperSlide key={index}>
                  <div className={styles.mainBlock}>
                    <div className={styles.videoThumbnail} onClick={() => setActiveVideoUrl(testimonial.videoUrl)}>
                      <Image src={testimonial.thumbnail} alt="Testimonial Thumbnail" fill sizes="40vw" style={{ objectFit: 'cover' }} />
                      <div className={styles.playButton}><Image src="/icons/play-icon.svg" alt="Play Video" width={80} height={80} /></div>
                    </div>
                    <div className={styles.quoteContent}>
                      <div className={styles.quoteIcon}><Image src="/icons/quote-icon.svg" alt="Quote" width={40} height={40} /></div>
                      <p className={styles.quoteText}>{testimonial.quote}</p>
                      <div className={styles.authorInfo}>
                        <Image src={testimonial.avatar} alt={testimonial.name} width={48} height={48} style={{ borderRadius: '50%' }} />
                        <div className={styles.authorDetails}>
                          <span className={styles.authorName}>{testimonial.name}</span>
                          <span className={styles.authorTitle}>{testimonial.title}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Tombol Navigasi Custom */}
            <div className="swiper-button-prev-custom"><Image src="/icons/arrow-left.svg" alt="Previous" width={24} height={24} /></div>
            <div className="swiper-button-next-custom"><Image src="/icons/arrow-right.svg" alt="Next" width={24} height={24} /></div>
          </div>
        </div>
      </section>

      {/* MODAL HYBRID - Desktop: Tombol X, Mobile: Swipe + Tombol X */}
      {activeVideoUrl && (
        <div 
          className={styles.modalOverlay}
          onClick={handleOverlayClick}
          ref={modalRef}
        >
          <div 
            className={styles.modalContent}
            onTouchStart={isMobile ? handleTouchStart : undefined}
            onTouchMove={isMobile ? handleTouchMove : undefined}
            onTouchEnd={isMobile ? handleTouchEnd : undefined}
          >
            {/* TOMBOL X - BERFUNGSI UNTUK SEMUA DEVICE */}
            <button 
              className={styles.closeButton}
              ref={closeButtonRef}
              onClick={handleCloseModal}
              aria-label="Tutup video"
            >
              ×
            </button>

            <div className={styles.videoPlayer}>
              <iframe 
                src={activeVideoUrl} 
                title="Video testimoni" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            </div>
            
            {/* INSTRUKSI SWIPE HANYA UNTUK MOBILE */}
            {isMobile && (
              <div className={styles.swipeIndicator}>
                <span>Swipe down to close</span>
                <div className={styles.swipeArrow}>↓</div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Testimonial;