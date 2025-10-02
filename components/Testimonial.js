'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

import styles from '../styles/Testimonial.module.css';

// SIAPKAN DATA TESTIMONI DI SINI
const testimonialsData = [
  {
    name: 'Sameer Rai',
    title: 'Product Head',
    quote: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."',
    thumbnail: '/testimonial-photo.jpg',
    avatar: '/author-avatar.png',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1' // <-- GANTI DENGAN URL VIDEO 1
  },
  {
    name: 'Orang Tua Murid',
    title: 'Wali Murid SDIT',
    quote: '"Pendidikan di Al Mubarak sangat luar biasa. Anak saya tidak hanya cerdas secara akademis, tapi juga akhlaknya terbentuk dengan baik."',
    thumbnail: '/testimonial-photo-2.jpg', // <-- Siapkan foto thumbnail kedua
    avatar: '/author-avatar-2.png', // <-- Siapkan avatar kedua
    videoUrl: 'https://www.youtube.com/embed/anotherVideoID?autoplay=1' // <-- GANTI DENGAN URL VIDEO 2
  },
];


const Testimonial = () => {
  const [activeVideoUrl, setActiveVideoUrl] = useState(null);

  return (
    <>
      <section className={styles.section} id="testimonial">
        <div className="container">
          <div className={styles.header} data-aos="fade-up">
            <span className={styles.subTitle}>TESTIMONIAL</span>
            <h2 className={styles.title}>
              Real Stories, Real Impact: Hear From Our Satisfied Clients
            </h2>
            <p className={styles.description}>
              Discover how video testimonial has transformed businesses through innovative solutions and dedicated support.
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

      {/* MODAL VIDEO (Tidak berubah) */}
      {activeVideoUrl && (
        <div className={styles.modalOverlay} onClick={() => setActiveVideoUrl(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setActiveVideoUrl(null)}>×</button>
            <div className={styles.videoPlayer}>
              <iframe src={activeVideoUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Testimonial;