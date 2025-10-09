'use client'; 

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileSubMenuOpen, setMobileSubMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    if (isMenuOpen) {
      setMobileSubMenuOpen(false);
    }
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMobileLinkClick = () => {
    setIsMenuOpen(false);
    setMobileSubMenuOpen(false);
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
          <Link href="/" className={styles.logo}>
            <Image src="/logo-yayasan.png" alt="Logo Yayasan Al Mubarak" width={48} height={48} />
            <div className={styles.logoText}>
              <span>YAYASAN WAKFIAH</span>
              <span>AL MUBARAK</span>
            </div>
          </Link>

          <div className={styles.navMenu}>
            <div className={styles.desktopNav}>
              <Link href="/" className={pathname === '/' ? styles.activeLink : ''}>Home</Link>
              <Link href="/tentang-kami" className={pathname === '/tentang-kami' ? styles.activeLink : ''}>Tentang Kami</Link>
              
              {/* === DROPDOWN UNIT PENDIDIKAN === */}
              <div 
                className={styles.dropdownContainer}
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <a className={pathname.startsWith('/unit-pendidikan') ? styles.activeLink : ''}>
                  Unit Pendidikan
                </a>
                {isDropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    <Link href="/unit-pendidikan/sdit">SDIT Al Mubarak</Link>
                    <Link href="/unit-pendidikan/smpit">SMPIT Al Mubarak</Link>
                    <a href="#" className={styles.disabledLink}>LPQ Al Mubarak</a>
                  </div>
                )}
              </div>

              <Link href="/berita" className={pathname === '/berita' ? styles.activeLink : ''}>Berita</Link>
              <Link href="/kontak" className={pathname.startsWith('/kontak') ? styles.activeLink : ''}>Kontak</Link>
            </div>

            <Link href="/pendaftaran" className={styles.ctaButton}>
              Daftar Sekarang
            </Link>
          </div>

          <button className={styles.hamburger} onClick={toggleMenu} aria-label="Toggle Menu">
            <div className={isMenuOpen ? `${styles.bar} ${styles.open}` : styles.bar}></div>
            <div className={isMenuOpen ? `${styles.bar} ${styles.open}` : styles.bar}></div>
            <div className={isMenuOpen ? `${styles.bar} ${styles.open}` : styles.bar}></div>
          </button>
        </div>
      </nav>

      {/* ===== MENU MOBILE (OVERLAY) ===== */}
      <div className={isMenuOpen ? `${styles.mobileMenu} ${styles.open}` : styles.mobileMenu}>
        <Link href="/" onClick={handleMobileLinkClick}>Home</Link>
        <Link href="/tentang-kami" onClick={handleMobileLinkClick}>Tentang Kami</Link>
        
        <div className={styles.mobileDropdown}>
          <button 
            className={styles.mobileDropdownToggle} 
            onClick={() => setMobileSubMenuOpen(!isMobileSubMenuOpen)}
          >
            Unit Pendidikan
            <span className={isMobileSubMenuOpen ? styles.arrowUp : styles.arrowDown}></span>
          </button>
          {isMobileSubMenuOpen && (
            <div className={styles.mobileSubMenu}>
              <Link href="/unit-pendidikan/sdit" onClick={handleMobileLinkClick}>- SDIT Al Mubarak</Link>
              <Link href="/unit-pendidikan/smpit" onClick={handleMobileLinkClick}>- SMPIT Al Mubarak</Link>
              <a href="#" className={styles.disabledLink}>- LPQ Al Mubarak</a>
            </div>
          )}
        </div>

        <Link href="/berita" onClick={handleMobileLinkClick}>Berita</Link>
        <Link href="/kontak" onClick={handleMobileLinkClick}>Kontak</Link>
        <Link href="/pendaftaran" className={styles.mobileCta} onClick={handleMobileLinkClick}>
          Daftar Sekarang
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
