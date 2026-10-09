'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from '../styles/NilaiUnggulSection.module.css';

// 🔥 DATA UDAH JADI K-A-F-F-A-H
const nilaiData = [
  { letter: 'K', title: 'Karakter Qur’ani', description: 'Membentuk pribadi yang berakhlak mulia dengan pembiasaan adab, ibadah, dan nilai-nilai Al-Qur’an dalam kehidupan sehari-hari.', icon: '/icons/nilai/karakter.svg' },
  { letter: 'A', title: 'Al-Qur’an Centered', description: 'Menanamkan kecintaan terhadap Al-Qur’an melalui program hafalan (tahfizh), tilawah, dan pemahaman dasar sejak usia dini.', icon: '/icons/nilai/quran-center.svg' },
  { letter: 'F', title: 'Fluent in English', description: 'Mengembangkan kemampuan bahasa Inggris melalui penerapan bilingual daily activity agar siswa percaya diri berkomunikasi secara global.', icon: '/icons/nilai/fluent.svg' },
  { letter: 'F', title: 'Fun Learning Environment', description: 'Menciptakan suasana belajar yang menyenangkan, aktif, dan kreatif sehingga anak belajar dengan bahagia dan optimal.', icon: '/icons/nilai/fun.svg' },
  { letter: 'A', title: 'Active & Skillful', description: 'Melatih kemandirian, keterampilan, dan kepercayaan diri siswa melalui berbagai kegiatan pengembangan diri.', icon: '/icons/nilai/active.svg' },
  { letter: 'H', title: 'Holistic Education', description: 'Menghadirkan pendidikan yang menyeluruh meliputi aspek iman, ilmu, akhlak, dan keterampilan untuk mempersiapkan masa depan.', icon: '/icons/nilai/holistic.svg' },
];

const NilaiUnggulSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const activeContent = nilaiData[activeTab];

  return (
    <section className={styles.nilaiSection}>
      <div className="container">
        <div className={styles.mainWrapper} data-aos="fade-up">
          <div className={styles.header}>
            <span className={styles.subtitle}>Kaffah Islamic School 1</span>
            <h2 className={styles.title}>Nilai - Nilai Unggul KAFFAH</h2>
            <p className={styles.description}>Keunggulan yang menjadi identitas kami</p>
          </div>

          <div className={styles.tabButtons}>
            {nilaiData.map((item, index) => (
              <button
                key={index}
                className={`${styles.tabButton} ${activeTab === index ? styles.active : ''}`}
                onClick={() => setActiveTab(index)}
              >
                {item.letter}
              </button>
            ))}
          </div>

          <div className={styles.tabContent} key={activeTab}>
            <div className={styles.iconWrapper}>
              <Image src={activeContent.icon} alt={activeContent.title} width={64} height={64} />
            </div>
            <div className={styles.textWrapper}>
              <h3>{activeContent.title}</h3>
              <p>{activeContent.description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NilaiUnggulSection;