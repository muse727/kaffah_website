'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import styles from '../styles/Testimonial.module.css';

// 🔥 MESIN PINTER PENERJEMAH YOUTUBE
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11)
    ? `https://www.youtube.com/embed/${match[2]}?autoplay=1`
    : null;
};

const Testimonial = () => {
  // State buat nampung data dari Database
  const [testiList, setTestiList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeVideoUrl, setActiveVideoUrl] = useState(null);
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Ngambil data otomatis dari MySQL pas komponen muncul
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/testimoni');
        if (res.ok) {
          const data = await res.json();
          setTestiList(data);
        }
      } catch (error) {
        console.error('Gagal memuat testimoni', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile(); window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleEscKey = (e) => { if (e.keyCode === 27) setActiveVideoUrl(null); };
    if (activeVideoUrl) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    }
    return () => { document.removeEventListener('keydown', handleEscKey); document.body.style.overflow = 'unset'; };
  }, [activeVideoUrl]);

  // Touch handlers (Mobile Swipe)
  const handleTouchStart = (e) => { if (!isMobile) return; setStartY(e.touches[0].clientY); setCurrentY(e.touches[0].clientY); setIsSwiping(true); };
  const handleTouchMove = (e) => {
    if (!isMobile || !isSwiping) return;
    const touchY = e.touches[0].clientY; setCurrentY(touchY);
    const diff = touchY - startY;
    if (diff > 0) { e.currentTarget.style.transform = `translateY(${diff}px)`; e.currentTarget.style.opacity = `${1 - (diff / 500)}`; }
  };
  const handleTouchEnd = (e) => {
    if (!isMobile || !isSwiping) return;
    if (currentY - startY > 100) setActiveVideoUrl(null);
    else { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.opacity = '1'; }
    setIsSwiping(false); setStartY(0); setCurrentY(0);
  };

  const handleOverlayClick = (e) => { if (e.target === e.currentTarget && !isMobile) setActiveVideoUrl(null); };

  // Kalau masih loading atau datanya kosong
  if (isLoading) return <div className={styles.loadingState}>Memuat Ulasan...</div>;
  if (!testiList || testiList.length === 0) return null;

  return (
    <>
      <section className={styles.section} id="testimonial">
        <div className="container">
          <div className={styles.header} data-aos="fade-up">
            <span className={styles.subTitle}>TESTIMONI</span>
            <h2 className={styles.title}>Pengalaman Nyata, Hasil Terbukti: Apa Kata Orang Tua Murid?</h2>
            <p className={styles.description}>Temukan cerita inspiratif dari para wali murid Kaffah Islamic School.</p>
          </div>

          <div className={styles.sliderWrapper} data-aos="fade-up" data-aos-delay="200">
            <Swiper modules={[Navigation]} navigation={{ nextEl: '.swiper-button-next-custom', prevEl: '.swiper-button-prev-custom' }} loop={true} spaceBetween={30} slidesPerView={1} className={styles.swiper}>
              {testiList.map((testimonial, index) => (
                <SwiperSlide key={index}>
                  <div className={styles.mainBlock}>
                    
                    <div 
                      className={`${styles.videoThumbnail} ${testimonial.videoUrl ? styles.clickable : styles.notClickable}`} 
                      onClick={() => testimonial.videoUrl ? setActiveVideoUrl(getYouTubeEmbedUrl(testimonial.videoUrl)) : null}
                    >
                      <Image src={testimonial.thumbnail || '/images/default-placeholder.jpg'} alt="Thumbnail" fill sizes="40vw" className={styles.coverImage} />
                      
                      {testimonial.videoUrl && (
                        <div className={styles.playButton}><Image src="/icons/play-icon.svg" alt="Play Video" width={80} height={80} /></div>
                      )}
                    </div>

                    <div className={styles.quoteContent}>
                      <div className={styles.quoteIcon}><Image src="/icons/quote-icon.svg" alt="Quote" width={40} height={40} /></div>
                      <p className={styles.quoteText}>{testimonial.quote}</p>
                      <div className={styles.authorInfo}>
                        
                        <div className={styles.avatarWrapper}>
                           <Image src={testimonial.avatar || '/images/default-placeholder.jpg'} alt={testimonial.name} fill className={styles.coverImage} />
                        </div>

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

            <div className="swiper-button-prev-custom"><Image src="/icons/arrow-left.svg" alt="Prev" width={24} height={24} /></div>
            <div className="swiper-button-next-custom"><Image src="/icons/arrow-right.svg" alt="Next" width={24} height={24} /></div>
          </div>
        </div>
      </section>

      {/* MODAL YOUTUBE */}
      {activeVideoUrl && (
        <div className={styles.modalOverlay} onClick={handleOverlayClick} ref={modalRef}>
          <div className={styles.modalContent} onTouchStart={isMobile ? handleTouchStart : undefined} onTouchMove={isMobile ? handleTouchMove : undefined} onTouchEnd={isMobile ? handleTouchEnd : undefined}>
            <button className={styles.closeButton} ref={closeButtonRef} onClick={() => setActiveVideoUrl(null)}>×</button>
            <div className={styles.videoPlayer}>
              <iframe src={activeVideoUrl} title="Video testimoni" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
            {isMobile && <div className={styles.swipeIndicator}><span>Swipe down to close</span><div className={styles.swipeArrow}>↓</div></div>}
          </div>
        </div>
      )}
    </>
  );
};

export default Testimonial;