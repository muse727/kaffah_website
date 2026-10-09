'use client'; 

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileSubMenuOpen, setMobileSubMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setMobileSubMenuOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      setMobileSubMenuOpen(false);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setMobileSubMenuOpen(false);
  };

  if (!isMounted) {
    return (
      <header className={styles.header}>
        <div className={styles.topBar}>
          <div className={styles.topBarContainer}>
            <div className={styles.contactInfo}>
              <span>kaffahislamicschool@gmail.com</span>
            </div>
          </div>
        </div>
        <nav className={styles.mainNav}>
          <div className={styles.mainNavContainer}>
            <div className={styles.logo}>
              <div className={styles.logoText}>
                <span>KAFFAH ISLAMIC</span>
                <span>SCHOOL</span>
              </div>
            </div>
            <div className={styles.hamburger}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      {/* ===== TOP BAR ===== */}
      <div className={styles.topBar}>
        <div className={styles.topBarContainer}>
          <div className={styles.contactInfo}>
            <Image src="/icons/mail.svg" alt="Email" width={16} height={16} />
            <span>kaffahislamicschool@gmail.com</span>
          </div>
          <div className={styles.contactInfo}>
            <Image src="/icons/phone.svg" alt="Telepon" width={16} height={16} />
            <span>{'(021) 29924450'}</span>
          </div>
        </div>
      </div>

      {/* ===== MAIN NAVIGATION ===== */}
      <nav className={styles.mainNav}>
        <div className={styles.mainNavContainer}>
          <Link href="/" className={styles.logo} onClick={closeMenu}>
            <Image 
              src="/logo-kaffah.png" 
              alt="Logo Kaffah Islamic School" 
              width={100} 
              height={100}
              style={{ width: 'auto', height: '40px' }} 
              priority
            />
            <div className={styles.logoText}>
              <span>KAFFAH</span>
              <span>ISLAMIC SCHOOL</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className={styles.navMenu}>
            <div className={styles.desktopNav}>
              <Link href="/" className={`${styles.navLink} ${pathname === '/' ? styles.activeLink : ''}`}>
                Home
              </Link>
              <Link href="/tentang-kami" className={`${styles.navLink} ${pathname === '/tentang-kami' ? styles.activeLink : ''}`}>
                Tentang Kami
              </Link>
              
              <div 
                className={styles.dropdownContainer}
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button className={`${styles.navLink} ${styles.dropdownTrigger} ${pathname.startsWith('/unit-pendidikan') ? styles.activeLink : ''}`}>
                  Unit Pendidikan
                  <svg className={styles.dropdownChevron} width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`${styles.dropdownMenu} ${isDropdownOpen ? styles.dropdownOpen : ''}`}>
                  <Link href="/unit-pendidikan/sdit" className={styles.dropdownLink}>
                    Kaffah Islamic School 1
                  </Link>
                  <Link href="/unit-pendidikan/smpit" className={styles.dropdownLink}>
                    Kaffah Islamic School 2
                  </Link>
                  <Link href="/unit-pendidikan/lpq" className={styles.dropdownLink}> 
                    SAQU (Sahabat Quran)
                  </Link>
                </div>
              </div>

              <Link href="/juara" className={`${styles.navLink} ${pathname === '/juara' ? styles.activeLink : ''}`}>
                Prestasi
              </Link>
              <Link href="/berita" className={`${styles.navLink} ${pathname === '/berita' ? styles.activeLink : ''}`}>
                Berita
              </Link>
              <Link href="/kontak" className={`${styles.navLink} ${pathname.startsWith('/kontak') ? styles.activeLink : ''}`}>
                Kontak
              </Link>
            </div>

            <Link href="/pendaftaran" className={styles.ctaButton}>
              Daftar Sekarang
            </Link>
          </div>

          <button 
            className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerActive : ''}`} 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`${styles.mobileOverlay} ${isMenuOpen ? styles.mobileOverlayActive : ''}`} onClick={closeMenu}></div>
      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuActive : ''}`}>
        <nav className={styles.mobileNav}>
          <Link href="/" className={styles.mobileNavLink} onClick={closeMenu}>Home</Link>
          <Link href="/tentang-kami" className={styles.mobileNavLink} onClick={closeMenu}>Tentang Kami</Link>
          
          <div className={styles.mobileDropdown}>
            <button 
              className={styles.mobileDropdownButton}
              onClick={() => setMobileSubMenuOpen(!isMobileSubMenuOpen)}
            >
              Unit Pendidikan
              <svg className={`${styles.mobileChevron} ${isMobileSubMenuOpen ? styles.mobileChevronRotate : ''}`} width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className={`${styles.mobileSubMenu} ${isMobileSubMenuOpen ? styles.mobileSubMenuActive : ''}`}>
              <Link href="/unit-pendidikan/sdit" className={styles.mobileSubLink} onClick={closeMenu}>
                Kaffah Islamic School 1
              </Link>
              <Link href="/unit-pendidikan/smpit" className={styles.mobileSubLink} onClick={closeMenu}>
                Kaffah Islamic School 2
              </Link>
              <Link href="/unit-pendidikan/lpq" className={styles.mobileSubLink} onClick={closeMenu}>
                SAQU (Sahabat Quran)
              </Link>
            </div>
          </div>

          <Link href="/juara" className={styles.mobileNavLink} onClick={closeMenu}>Prestasi</Link>
          <Link href="/berita" className={styles.mobileNavLink} onClick={closeMenu}>Berita</Link>
          <Link href="/kontak" className={styles.mobileNavLink} onClick={closeMenu}>Kontak</Link>
          
          <Link href="/pendaftaran" className={styles.mobileCtaButton} onClick={closeMenu}>
            Informasi Pendaftaran
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;