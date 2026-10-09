import React from 'react';
import Link from 'next/link';
import styles from '../styles/PageHeader.module.css';

const PageHeader = ({ title, tagline, buttonPrimary, buttonSecondary }) => {
  return (
    <section className={styles.headerSection}>
      <div className={styles.overlay}></div>
      
      {/* 🔥 FIX: Gua ganti class-nya pakai headerContent biar bisa di-lock di tengah */}
      <div className={styles.headerContent} data-aos="fade-up">
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.tagline}>{tagline}</p>
        <div className={styles.buttonGroup}>
          <Link href={buttonPrimary.href} className={styles.buttonPrimary}>
            {buttonPrimary.text}
          </Link>
          <Link href={buttonSecondary.href} className={styles.buttonSecondary}>
            {buttonSecondary.text}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PageHeader;