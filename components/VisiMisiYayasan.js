import React from 'react';
import styles from '../styles/VisiMisiYayasan.module.css';

// KONTEN VISI & MISI (CONTOH)
const visiText = "Menjadi pusat peradaban Islam yang unggul, melahirkan generasi pemimpin Rabbani yang berkontribusi positif bagi umat dan bangsa.";

const misiItems = [
  "Menyelenggarakan pendidikan berkualitas yang mengintegrasikan ilmu, iman, dan akhlak.",
  "Mengembangkan program sosial dan dakwah yang memberdayakan masyarakat.",
  "Membangun kemitraan strategis untuk memperluas jangkauan manfaat yayasan.",
  "Mengelola aset wakaf secara profesional, amanah, dan produktif untuk keberlangsungan umat."
];

const VisiMisiYayasan = () => {
  return (
    <section className={styles.vmSection}>
      {/* Background Elements */}
      <div className={styles.backgroundBlur}></div>
      <div className={styles.floatingOrbs}>
        <div className={styles.orb1}></div>
        <div className={styles.orb2}></div>
        <div className={styles.orb3}></div>
      </div>
      
      <div className="container">
        <div className={styles.header} data-aos="fade-up">
          <h2 className={styles.title}>Visi & Misi Yayasan</h2>
          <p className={styles.subtitle}>Landasan Gerak dan Cita-Cita Luhur Al Mubarak</p>
        </div>

        <div className={styles.grid} data-aos="fade-up" data-aos-delay="200">
          {/* KARTU VISI */}
          <div className={styles.card}>
            <div className={styles.cardGlow}></div>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                </svg>
              </div>
              <h3>VISI</h3>
            </div>
            <div className={styles.cardBody}>
              <p className={styles.visiText}>{visiText}</p>
            </div>
          </div>

          {/* KARTU MISI */}
          <div className={styles.card}>
            <div className={styles.cardGlow}></div>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C13.1 2 14 2.9 14 4s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" fill="currentColor"/>
                </svg>
              </div>
              <h3>MISI</h3>
            </div>
            <div className={styles.cardBody}>
              <ul className={styles.misiList}>
                {misiItems.map((item, index) => (
                  <li key={index}>
                    <span className={styles.misiNumber}>{index + 1}</span>
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

export default VisiMisiYayasan;