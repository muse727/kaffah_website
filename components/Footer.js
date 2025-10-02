'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../styles/Footer.module.css';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    const el = footerRef.current;

    // Animasi CTA Block
    gsap.from(el.querySelector(`.${styles.ctaBlock}`), {
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
    });

    // Animasi kolom footer
    gsap.from(el.querySelectorAll(`.${styles.footerGrid} > div`), {
      scrollTrigger: {
        trigger: el.querySelector(`.${styles.mainFooter}`),
        start: 'top 80%',
      },
      opacity: 0,
      y: 50,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
    });
  }, []);

  return (
    <footer className={styles.footer} ref={footerRef}>
      {/* ===== CTA BLOCK ===== */}
      <div className="container">
        <div className={styles.ctaBlock}>
          {/* STRUKTUR DIUBAH: Gambar dan Konten jadi satu tumpukan */}
          <div className={styles.ctaImage}>
            <Image src="/cta-image.png" alt="Siswa-siswi Al Mubarak" fill style={{ objectFit: 'contain' }} />
          </div>
          <div className={styles.ctaContent}>
            <h3>Yukk!! Daftarkan Diri Kamu di Sekolah Impian Sekarang...</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <form className={styles.ctaForm}>
              <span>Daftar Sekarang:</span>
              <button type="submit">Klik Disini</button>
            </form>
          </div>
        </div>
      </div>

      {/* ===== MAIN FOOTER ===== */}
      <div className={styles.mainFooter}>
        <div className={`${styles.footerGrid} container`}>
          {/* Kolom 1: About */}
          <div className={styles.footerCol}>
            <Link href="/" className={styles.footerLogo}>
              <Image src="/logo-yayasan.png" alt="Logo Yayasan" width={48} height={48} />
              <span>SIT Al Mubarak</span>
            </Link>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
            </p>
            <div className={styles.socialIcons}>
              <Link href="#"><Image src="/icons/tiktok.svg" alt="TikTok" width={28} height={28} /></Link>
              <Link href="#"><Image src="/icons/whatsapp.svg" alt="WhatsApp" width={28} height={28} /></Link>
              <Link href="#"><Image src="/icons/instagram.svg" alt="Instagram" width={28} height={28} /></Link>
              <Link href="#"><Image src="/icons/youtube.svg" alt="YouTube" width={28} height={28} /></Link>
    
            </div>
          </div>

          {/* Kolom 2: Links */}
          <div className={styles.footerCol}>
            <h4>Tautan Cepat</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/tentang">Tentang Kami</Link></li>
              <li><Link href="/unit">Unit Pendidikan</Link></li>
              <li><Link href="/berita">Berita</Link></li>
              <li><Link href="/kontak">Kontak</Link></li>
            </ul>
          </div>

          {/* Kolom 3: Lokasi */}
          <div className={styles.footerCol}>
            <h4>Lokasi Kami</h4>
            <div className={styles.mapContainer}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260344421!2d106.8195613!3d-6.1947413!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f4352862a955%3A0x2f7131825243ebb0!2sMonumen%20Nasional!5e0!3m2!1sen!2sid!4v1621818274880!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <p>
              <Image src="/icons/phone.svg" alt="Telepon" width={16} height={16} />
              +6289-5170-39100
            </p>
            <p>
              <Image src="/icons/mail.svg" alt="Email" width={16} height={16} />
              al.mubarokah@gmail.com
            </p>
          </div>
        </div>
      </div>

      {/* ===== COPYRIGHT BAR ===== */}
      <div className={styles.copyrightBar}>
        <p>©2025 Yayasan Wakfiah Al Mubarak. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
