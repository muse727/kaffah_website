'use client'; // <-- PENTING! Mengubah ini menjadi Client Component

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import styles from '../styles/Hero.module.css';

// DAFTAR GAMBAR BACKGROUND LO
const backgroundImages = [
  '/hero-bg.jpg', // Gambar yang sekarang
  '/hero-bg-2.jpg', // Gambar baru 1
  '/hero-bg-3.jpg', // Gambar baru 2
  // Tambahkan gambar lain di sini jika perlu
];

const featureCards = [
  {
    icon: '/icons/quran.svg',
    title: 'LPQ Al Mubarak',
    description: 'Program Lembaga Pendidikan Al-Quran untuk membentuk generasi cinta Al-Quran.'
  },
  {
    icon: '/icons/school.svg',
    title: 'SDIT Al Mubarak',
    description: 'Pendidikan dasar Islam terpadu yang modern, kreatif, dan berakhlak mulia.'
  },
  {
    icon: '/icons/mosque.svg',
    title: 'SMPIT Al Mubarak',
    description: 'Mencetak lulusan SMP Islam terpadu yang unggul dalam prestasi dan karakter.'
  }
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageRefs = useRef([]); // Ref untuk menyimpan setiap elemen gambar

  // Effect untuk mengganti gambar secara otomatis setiap 5 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000); // Ganti gambar setiap 5 detik

    return () => clearInterval(interval); // Membersihkan interval saat komponen di-unmount
  }, []);

  // Effect untuk menjalankan animasi GSAP setiap kali gambar berubah
  useEffect(() => {
    // Sembunyikan semua gambar
    gsap.to(imageRefs.current, { 
      opacity: 0, 
      duration: 1, // Durasi fade out
      ease: 'power2.inOut'
    });
    
    // Tampilkan gambar yang aktif
    gsap.to(imageRefs.current[currentIndex], { 
      opacity: 1, 
      duration: 1.5, // Durasi fade in
      ease: 'power2.inOut'
    });
  }, [currentIndex]);


  return (
    <section className={styles.heroSection}>
      {/* Container untuk semua elemen background & overlay */}
      <div className={styles.backgroundContainer}>
        {/* Render semua gambar di sini */}
        {backgroundImages.map((src, index) => (
          <div 
            key={src} 
            className={styles.backgroundImage}
            ref={el => imageRefs.current[index] = el}
          >
            <Image 
              src={src}
              alt={`Background ${index + 1}`}
              fill
              priority={index === 0} // Hanya gambar pertama yang diprioritaskan
              style={{ objectFit: 'cover' }}
            />
          </div>
        ))}
        <div className={styles.darkOverlay}></div>
        <div className={styles.whiteGradientOverlay}></div>
      </div>

      {/* Konten Judul (Akan diposisikan absolut) */}
      <div className={`${styles.heroContent} container`}>
        <h1 data-aos="fade-right">
          <span className={styles.textDark}>Mendidik dengan Iman, Ilmu, dan Akhlak </span>
          <span className={styles.textGreen}>untuk Generasi Rabbani</span>
        </h1>
      </div>

      {/* Wrapper untuk Kartu di Bawah */}
      <div className={styles.cardsWrapper}>
        <div className={`${styles.cardsContainer} container`}>
          {featureCards.map((card, index) => (
            <div className={styles.card} key={index} data-aos="fade-up" data-aos-delay={index * 150}>
              <div className={styles.iconWrapper}>
                <Image src={card.icon} alt={`${card.title} icon`} width={32} height={32} />
              </div>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardDescription}>{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;