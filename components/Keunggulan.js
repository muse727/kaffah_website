'use client';

import Image from 'next/image';
import { FaBookOpen, FaUserShield, FaMosque, FaLanguage, FaLightbulb } from 'react-icons/fa';
import styles from '../styles/Keunggulan.module.css';

const features = [
  { icon: <FaBookOpen size={20} color="#ffffff" />, text: "Hafalan Qur'an, Hadits & Doa Harian" },
  { icon: <FaUserShield size={20} color="#ffffff" />, text: 'Pembentukan Karakter Islami yang Kuat' },
  { icon: <FaMosque size={20} color="#ffffff" />, text: 'Praktik Ibadah Sesuai Sunnah (Sholat & Wudhu)' },
  { icon: <FaLanguage size={24} color="#ffffff" />, text: 'Program Bilingual (Bahasa Inggris & Arab)' },
  { icon: <FaLightbulb size={20} color="#ffffff" />, text: 'Pengembangan Life Skill & Kemandirian Anak' },
];

const Keunggulan = () => {
  return (
    <section className={styles.section}>
      <div className={`${styles.container} container`}>
        {/* Elemen #1: Judul */}
        <h2 className={styles.title} data-aos="fade-down">
          Mengapa harus di <span className={styles.highlight}>Kaffah Islamic School?</span>
        </h2>

        {/* Elemen #2: Kolom Gambar */}
        <div className={styles.imageColumn} data-aos="fade-right">
          
          {/* Background Biru Bentuk Abstrak */}
          <div className={styles.blobBackground}>
            <Image src="/blob.svg" alt="Bentuk Abstrak" fill />
          </div>
          
          <div className={styles.mainImageWrapper}>
            {/* 🔥 SHADOW 3D DITARUH DI SINI BIAR DI BELAKANG TUPAI */}
            <div className={styles.blobShadow}></div>

            {/* 🔥 JURUS ANTI GEPENG TEMBAK LANGSUNG DI STYLE */}
            <Image 
              src="/photo-keunggulan.png" 
              alt="Maskot Kaffah Islamic School" 
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'contain', objectPosition: 'bottom center' }} 
              className={styles.squirrelImage}
            />
          </div>

          {/* Icon Like Melayang */}
          <div className={styles.likeIcon1} data-aos="zoom-in" data-aos-delay="500">
            <Image src="/icons/like-icon.svg" alt="Like" width={60} height={60} />
          </div>
          <div className={styles.likeIcon2} data-aos="zoom-in" data-aos-delay="700">
            <Image src="/icons/like-icon.svg" alt="Like" width={60} height={60} />
          </div>
        </div>

        {/* Elemen #3: Daftar Keunggulan */}
        <div className={styles.featuresGrid} data-aos="fade-left">
          {features.map((feature, index) => (
            <div key={index} className={styles.featureItem}>
              <div className={styles.featureIcon}>
                {feature.icon}
              </div>
              <span>{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Keunggulan;