'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import styles from '../styles/InvestasiPendidikan.module.css';

// Data biaya kita simpan di sini, biar gampang di-manage
const pricingData = {
  sd: {
    title: 'SD',
    cards: [
      { title: 'Biaya Pendaftaran', price: 500000, icon: '/illustrations/biaya-pendaftaran.svg' },
      { title: 'Biaya Daftar Ulang', price: 13000000, icon: '/illustrations/biaya-daftar-ulang.svg' },
      { title: 'SPP', price: 700000, icon: '/illustrations/biaya-spp.svg' },
    ],
    rincian: ['Uang Pangkal', 'Uang Kegiatan 1 Tahun', 'Uang Seragam', 'Uang Buku', 'SPP Bulan Pertama'],
  },
  smp: {
    title: 'SMP',
    cards: [
      { title: 'Biaya Pendaftaran', price: 500000, icon: '/illustrations/biaya-pendaftaran.svg' },
      { title: 'Biaya Daftar Ulang', price: 15000000, icon: '/illustrations/biaya-daftar-ulang.svg' },
      { title: 'SPP', price: 750000, icon: '/illustrations/biaya-spp.svg' },
    ],
    rincian: ['Uang Pangkal', 'Uang Kegiatan 1 Tahun', 'Uang Seragam', 'Uang Buku', 'SPP Bulan Pertama'],
  }
};

const InvestasiPendidikan = () => {
  const [activeTab, setActiveTab] = useState('smp');
  const contentRef = useRef(null);
  const tabSwitcherRef = useRef(null);

  useEffect(() => {
    // Animasi GSAP saat tab diganti
    if (contentRef.current) {
      // Animasikan konten yang lama keluar
      gsap.to(contentRef.current.children, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.in',
        stagger: 0.05,
        onComplete: () => {
          // Setelah selesai, animasikan konten yang baru masuk
          gsap.fromTo(contentRef.current.children, 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.05, delay: 0.1 }
          );
        }
      });
    }
  }, [activeTab]);

  // Fix untuk touch events di mobile
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const activeData = pricingData[activeTab];

  return (
    <section className={styles.section}>
      <div className="container" data-aos="fade-up">
        <h2 className={styles.mainTitle}>Investasi Pendidikan</h2>
        <div className={styles.pricingBlock}>
          <div className={styles.blobBackground}></div>
          
          {/* Tab Switcher dengan event handling yang lebih baik */}
          <div className={styles.tabSwitcher} ref={tabSwitcherRef}>
            <button 
              className={`${styles.tabButton} ${activeTab === 'smp' ? styles.active : ''}`} 
              onClick={() => handleTabClick('smp')}
              onTouchEnd={(e) => {
                e.preventDefault();
                handleTabClick('smp');
              }}
              aria-label="Lihat biaya SMP"
            >
              SMP
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'sd' ? styles.active : ''}`} 
              onClick={() => handleTabClick('sd')}
              onTouchEnd={(e) => {
                e.preventDefault();
                handleTabClick('sd');
              }}
              aria-label="Lihat biaya SD"
            >
              SD
            </button>
          </div>

          <div className={styles.contentContainer} ref={contentRef}>
            {/* Konten akan di-render ulang di sini saat activeTab berubah */}
            <div className={styles.cardsGrid} key={activeTab}>
              {activeData.cards.map((card, index) => (
                <div key={index} className={styles.priceCard}>
                  <div className={styles.cardIcon}>
                    <Image 
                      src={card.icon} 
                      alt={card.title} 
                      width={80} 
                      height={80}
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <h4>{card.title}</h4>
                  <div className={styles.price}>
                    <span>Rp</span>{card.price.toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.detailsSection} key={activeTab + '-details'}>
              <h4>Rincian Biaya</h4>
              <ul>
                {activeData.rincian.map((item, index) => (
                  <li key={index}>
                    <Image src="/icons/checkmark.svg" alt="Check" width={20} height={20} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestasiPendidikan;