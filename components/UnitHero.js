'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';

// Import CSS Swiper
import 'swiper/css';
import 'swiper/css/effect-fade'; // Efek fade untuk transisi halus

import styles from '../styles/UnitHero.module.css';

const UnitHero = ({ schoolName, tagline, images, registerLink }) => {
  return (
    <section className={styles.heroContainer}>
      {/* Slider untuk background gambar */}
      <Swiper
        modules={[Autoplay, EffectFade]}
        className={styles.swiperContainer}
        loop={true}
        autoplay={{
          delay: 5000, // Ganti gambar setiap 5 detik
          disableOnInteraction: false,
        }}
        effect="fade" // Efek transisi antar gambar
        allowTouchMove={false} // Matikan swipe manual
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              style={{ objectFit: 'cover' }}
              priority={index === 0} // Prioritaskan load gambar pertama
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Overlay warna hijau transparan */}
      <div className={styles.overlay}></div>

      {/* Konten teks dan tombol */}
      <div className={styles.content}>
        <div className="container">
          <div className={styles.textContent} data-aos="fade-up">
            <span className={styles.schoolName}>{schoolName}</span>
            <h1 className={styles.tagline}>{tagline}</h1>
            <Link href={registerLink} className={styles.registerButton}>
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UnitHero;