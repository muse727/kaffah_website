'use client'; 

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.header}>
      {/* ===== TOP BAR (HIJAU) ===== */}
      <div className={styles.topBar}>
        <div className={styles.topBarContainer}>
          <div className={styles.contactInfo}>
            <Image src="/icons/mail.svg" alt="Email" width={16} height={16} />
            <span>al.mubarokah@gmail.com</span>
          </div>
          <div className={styles.contactInfo}>
            <Image src="/icons/phone.svg" alt="Telepon" width={16} height={16} />
            <span>+6289-5170-39100</span>
          </div>
        </div>
      </div>

      {/* ===== MAIN NAVIGATION (PUTIH) ===== */}
      <nav className={styles.mainNav}>
        <div className={styles.mainNavContainer}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <Image src="/logo-yayasan.png" alt="Logo Yayasan Al Mubarak" width={48} height={48} />
            <div className={styles.logoText}>
              <span>YAYASAN WAKFIAH</span>
              <span>AL MUBARAK</span>
            </div>
          </Link>

          {/* ===== MENU & CTA WRAPPER ===== */}
          <div className={styles.navMenu}>
            {/* Navigasi Desktop */}
            <div className={styles.desktopNav}>
              <Link href="/" className={styles.activeLink}>Home</Link>
              <Link href="/tentang">Tentang Kami</Link>
              <Link href="/unit">Unit Pendidikan</Link>
              <Link href="/berita">Berita</Link>
              <Link href="/kontak">Kontak</Link>
            </div>

            {/* Tombol CTA Desktop */}
            <Link href="/pendaftaran" className={styles.ctaButton}>
              Daftar Sekarang
            </Link>
          </div>

          {/* Tombol Hamburger untuk Mobile */}
          <button className={styles.hamburger} onClick={toggleMenu} aria-label="Toggle Menu">
            <div className={isMenuOpen ? `${styles.bar} ${styles.open}` : styles.bar}></div>
            <div className={isMenuOpen ? `${styles.bar} ${styles.open}` : styles.bar}></div>
            <div className={isMenuOpen ? `${styles.bar} ${styles.open}` : styles.bar}></div>
          </button>
        </div>
      </nav>

      {/* ===== MENU MOBILE (OVERLAY) ===== */}
      <div className={isMenuOpen ? `${styles.mobileMenu} ${styles.open}` : styles.mobileMenu}>
        <Link href="/" onClick={toggleMenu}>Home</Link>
        <Link href="/tentang" onClick={toggleMenu}>Tentang Kami</Link>
        <Link href="/unit" onClick={toggleMenu}>Unit Pendidikan</Link>
        <Link href="/berita" onClick={toggleMenu}>Berita</Link>
        <Link href="/kontak" onClick={toggleMenu}>Kontak</Link>
        <Link href="/pendaftaran" className={styles.mobileCta} onClick={toggleMenu}>
          Daftar Sekarang
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
