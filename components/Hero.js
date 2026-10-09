'use client'; 

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../styles/Hero.module.css';

const featureCards = [
  { icon: '/icons/quran.svg', title: 'LPQ Kaffah', description: 'Program Lembaga Pendidikan Al-Quran untuk membentuk generasi cinta Al-Quran.' },
  { icon: '/icons/school.svg', title: 'KIS 1', description: 'Pendidikan dasar Islam terpadu yang modern, kreatif, dan berakhlak mulia.' },
  { icon: '/icons/mosque.svg', title: 'KIS 2', description: 'Mencetak lulusan menengah Islam terpadu yang unggul dalam prestasi dan karakter.' }
];

const getYouTubeBackgroundUrl = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    const videoId = match[2];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1`;
  }
  return null;
};

const Hero = () => {
  const [heroData, setHeroData] = useState({ tipe: 'IMAGE', mediaUrl: '/hero-bg.jpg' });
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = heroData.tipe === 'IMAGE' && heroData.mediaUrl ? heroData.mediaUrl.split(',') : [];

  useEffect(() => {
    const fetchHeroSetting = async () => {
      try {
        const res = await fetch('/api/hero');
        if (res.ok) {
          const data = await res.json();
          if (data && data.mediaUrl) setHeroData(data);
        }
      } catch (error) { console.error('Error Hero:', error); }
    };
    fetchHeroSetting();
  }, []);

  useEffect(() => {
    if (heroData.tipe !== 'IMAGE' || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, [heroData.tipe, images.length]);

  return (
    <>
      <section className={styles.heroSection}>
        <div className={styles.backgroundContainer}>
          
          {heroData.tipe === 'YOUTUBE' ? (
            <div className={styles.youtubeWrapper}>
              <iframe src={getYouTubeBackgroundUrl(heroData.mediaUrl)} title="YouTube Background" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" className={styles.youtubeIframe}></iframe>
            </div>
          ) : heroData.tipe === 'VIDEO' ? (
            <video src={heroData.mediaUrl} autoPlay loop muted playsInline preload="metadata" className={styles.videoBackground} />
          ) : (
            images.map((src, index) => (
              <div 
                key={src + index} 
                className={`${styles.backgroundImage} ${index === currentIndex ? styles.activeImage : ''}`}
              >
                <Image src={src} alt={`Background ${index + 1}`} fill priority={index === 0} style={{ objectFit: 'cover' }} />
              </div>
            ))
          )}

          <div className={styles.darkOverlay}></div>
          <div className={styles.whiteGradientOverlay}></div>
        </div>

        <div className={`${styles.heroContent} container`}>
          <h1 data-aos="fade-right">
            <span className={styles.textDark}>Cerdas, Kuat Bertaqwa,</span><br />
            <span className={styles.textDark}>Bahagia Itu </span>
            <span className={styles.textBlue}>Mencerdaskan</span>
          </h1>
        </div>
      </section>

      {/* 🔥 FIX: SEKARANG KARTUNYA BERDIRI SENDIRI DI LUAR SECTION HERO! */}
      <div className={styles.cardsWrapper}>
        <div className={`${styles.cardsContainer} container`}>
          {featureCards.map((card, index) => (
            <div className={styles.card} key={index} data-aos="fade-up" data-aos-delay={index * 150}>
              <div className={styles.iconWrapper}><Image src={card.icon} alt={card.title} width={32} height={32} /></div>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardDescription}>{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Hero;