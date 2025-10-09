'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from '../styles/NilaiUnggulSection.module.css';

const nilaiData = [
  { letter: 'A', title: 'Amal Jama’i (Kerjasama)', description: 'sebagai metode mewujudkan Visi dan Misi.', icon: '/icons/nilai/amal.svg' },
  { letter: 'L', title: 'Learning (Belajar)', description: 'sebagai budaya seluruh warga sekolah.', icon: '/icons/nilai/learning.svg' },
  { letter: 'M', title: 'Musyawarah', description: 'sebagai pendekatan dalam menyelesaikan masalah.', icon: '/icons/nilai/musyawarah.svg' },
  { letter: 'U', title: 'Ukhrawi (Akhirat)', description: 'sebagai tujuan akhir dalam melakukan kebajikan.', icon: '/icons/nilai/ukhrawi.svg' },
  { letter: 'B', title: 'Bermanfaat dan Peduli', description: 'terhadap sesama serta lingkungan sebagai cita-cita kehidupan.', icon: '/icons/nilai/bermanfaat.svg' },
  { letter: 'A', title: 'Ahlussunnah wal Jama’ah', description: 'sebagai prinsip dalam mengajarkan ajaran Agama Islam.', icon: '/icons/nilai/ahlussunnah.svg' },
  { letter: 'R', title: 'Ri’ayah (Penjagaan)', description: 'sebagai cara untuk menjaga keseimbangan sistem.', icon: '/icons/nilai/riayah.svg' },
  { letter: 'A', title: 'Amar Ma’ruf, Nahi Munkar', description: 'untuk menguatkan organisasi.', icon: '/icons/nilai/amar-maruf.svg' },
  { letter: 'K', title: 'Komitmen', description: 'untuk peningkatan mutu yang terus berkesinambungan.', icon: '/icons/nilai/komitmen.svg' },
];

const NilaiUnggulSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const activeContent = nilaiData[activeTab];

  return (
    <section className={styles.nilaiSection}>
      <div className="container">
        {/* === INI DIA CONTAINER PUTIHNYA === */}
        <div className={styles.mainWrapper} data-aos="fade-up">
          <div className={styles.header}>
            <span className={styles.subtitle}>SDIT Al Mubarak</span>
            <h2 className={styles.title}>Nilai - Nilai Unggul</h2>
            <p className={styles.description}>Apalah Nilai unggul yang ada di SDIT Al Mubarak</p>
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
        {/* === AKHIR DARI CONTAINER PUTIH === */}
      </div>
    </section>
  );
};

export default NilaiUnggulSection;
