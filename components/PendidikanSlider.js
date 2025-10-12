'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Parallax, Autoplay } from 'swiper/modules';
import { gsap } from 'gsap';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/parallax';

import styles from '../styles/PendidikanSlider.module.css';

// Data diubah menggunakan 'src'
const sliderData = [
  { bgText: 'SDIT AL MUBARAK', title: 'SDIT Al Mubarak', src: '/images/sd-photo.png', bgColor: '#107163' },
  { bgText: 'SMPIT AL MUBARAK', title: 'SMPIT Al Mubarak', src: '/images/smp-photo.png', bgColor: '#FBA21A' },
  { bgText: 'LPQ AL MUBARAK', title: 'LPQ Al Mubarak', src: '/images/lpq-photo.png', bgColor: '#3F3F3F' },
];

const PendidikanSlider = () => {
  const sectionRef = useRef(null);
  const bgTextsRef = useRef([]);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!swiperInstance || !sectionRef.current) return;
    
    gsap.to(sectionRef.current, { backgroundColor: sliderData[currentIndex].bgColor, duration: 0.8, ease: 'power2.inOut' });
    
    gsap.to(bgTextsRef.current, { opacity: 0, duration: 0.4, ease: 'power2.out' });
    gsap.to(bgTextsRef.current[currentIndex], { opacity: 1, duration: 0.6, ease: 'power2.inOut', delay: 0.2 });
  }, [currentIndex, swiperInstance]);
  
  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.backgroundTextsContainer}>
        {sliderData.map((slide, index) => (
          <h2
            key={index}
            className={styles.backgroundText}
            ref={el => (bgTextsRef.current[index] = el)}
            data-swiper-parallax="30%"
          >
            {slide.bgText}
          </h2>
        ))}
      </div>

      <Swiper
        onSwiper={setSwiperInstance}
        modules={[Navigation, Parallax, Autoplay]}
        parallax={true}
        speed={1000}
        navigation={{ nextEl: '.swiper-button-next-custom', prevEl: '.swiper-button-prev-custom' }}
        loop={true}
        centeredSlides={true}
        slidesPerView={1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        onRealIndexChange={(swiper) => setCurrentIndex(swiper.realIndex)}
        className={styles.swiper}
      >
        {sliderData.map((slide, index) => (
          <SwiperSlide key={index} className={styles.swiperSlide}>
            <div className={styles.card} data-swiper-parallax="-200">
              <div className={styles.cardHeader} data-swiper-parallax-y="-50">
                <h3>{slide.title}</h3>
              </div>
              <div className={styles.cardImageWrapper}>
                <Image
                  src={slide.src}
                  alt={slide.title}
                  fill
                  sizes="50vw"
                  // KODE LAMA DIHAPUS, DIGANTI DENGAN YANG DI BAWAH
                  // style={{ 
                  //   objectFit: 'cover',
                  //   objectPosition: 'top center'
                  // }}

                  // GANTI DENGAN INI UNTUK MENGAMBIL STYLE DARI FILE .CSS
                  className={styles.cardImage}
                />
                <div className={styles.decorativeBlob} data-swiper-parallax-scale="0.5">
                  <Image src="/orange-blob.svg" alt="Dekorasi" fill />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      <div className={`${styles.navigationContainer} container`}>
        <div className="swiper-button-prev-custom">
          <Image src="/icons/arrow-left.svg" alt="Previous" width={32} height={32} />
        </div>
        <div className="swiper-button-next-custom">
          <Image src="/icons/arrow-right.svg" alt="Next" width={32} height={32} />
        </div>
      </div>
    </section>
  );
};

export default PendidikanSlider;