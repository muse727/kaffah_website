'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../styles/Footer.module.css';

// Register GSAP hanya di client side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Footer = () => {
  const footerRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const el = footerRef.current;
    if (!el) return;

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

  // Alamat yang konsisten
  const alamat = "Jl. Pramuka Sari III No.24, RT.1/RW.8, Rawasari, Kec. Cemp. Putih, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10570";

  return (
    <footer className={styles.footer} ref={footerRef}>
      {/* ===== CTA BLOCK ===== */}
      <div className="container">
        <div className={styles.ctaBlock}>
          <div className={styles.ctaImage}>
            <Image 
              src="/cta-image.png" 
              alt="Siswa-siswi Al Mubarak" 
              width={300}
              height={200}
              style={{ objectFit: 'contain' }} 
            />
          </div>
          <div className={styles.ctaContent}>
            <h3>Bergabunglah Menjadi Keluarga Besar Al Mubarak!</h3>
            <p>Mari bersama-sama mewujudkan generasi Rabbani yang berakhlak mulia, berilmu, dan berprestasi. Daftarkan putra-putri Anda untuk mendapatkan pendidikan terbaik.</p>
            <form className={styles.ctaForm}>
              <span>Pendaftaran Siswa Baru:</span>
              <button type="button">Daftar Sekarang</button>
            </form>
          </div>
        </div>
      </div>

      {/* ===== MAIN FOOTER ===== */}
      <div className={styles.mainFooter}>
        <div className={`${styles.footerGrid} container`}>
          {/* Kolom 1: Tentang Yayasan */}
          <div className={styles.footerCol}>
            <Link href="/" className={styles.footerLogo}>
              <Image src="/logo-yayasan.png" alt="Logo Yayasan" width={48} height={48} />
              <span>Yayasan Wakfiah Al Mubarak</span>
            </Link>
            <p>
              Yayasan Wakfiah Al Mubarak berkomitmen memberikan pendidikan Islami yang berkualitas, 
              mengintegrasikan iman, ilmu, dan akhlak untuk membentuk generasi Rabbani yang unggul 
              dalam prestasi dan karakter.
            </p>
            <div className={styles.socialIcons}>
              <Link href="#"><Image src="/icons/tiktok.svg" alt="TikTok" width={28} height={28} /></Link>
              <Link href="#"><Image src="/icons/whatsapp.svg" alt="WhatsApp" width={28} height={28} /></Link>
              <Link href="#"><Image src="/icons/instagram.svg" alt="Instagram" width={28} height={28} /></Link>
              <Link href="#"><Image src="/icons/youtube.svg" alt="YouTube" width={28} height={28} /></Link>
            </div>
          </div>

          {/* Kolom 2: Unit Pendidikan */}
          <div className={styles.footerCol}>
            <h4>Unit Pendidikan</h4>
            <ul>
              <li><Link href="/lpq">LPQ Al Mubarak</Link></li>
              <li><Link href="/sd">SDIT Al Mubarak</Link></li>
              <li><Link href="/smp">SMPIT Al Mubarak</Link></li>
              <li><Link href="/program">Program Unggulan</Link></li>
              <li><Link href="/ppdb">Info PPDB</Link></li>
            </ul>
          </div>

          {/* Kolom 3: Kontak & Lokasi */}
          <div className={styles.footerCol}>
            <h4>Kontak & Lokasi</h4>
            <div className={styles.mapContainer}>
              {isMounted && (
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.5613623479285!2d106.86617317499024!3d-6.189402293798193!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f4f691e3f223%3A0x930d0bc5725c01a2!2sSDIT%20Al%20Mubarak!5e0!3m2!1sid!2sid!4v1760161170957!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Yayasan Wakfiah Al Mubarak"
                />
              )}
            </div>
            <div className={styles.contactInfo}>
              <p>
                <Image src="/icons/location.svg" alt="Alamat" width={16} height={16} />
                {alamat}
              </p>
              <p>
                <Image src="/icons/phone.svg" alt="Telepon" width={16} height={16} />
                +62 89-5170-36100
              </p>
              <p>
                <Image src="/icons/mail.svg" alt="Email" width={16} height={16} />
                almubaraksit@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== COPYRIGHT BAR ===== */}
      <div className={styles.copyrightBar}>
        <div className="container">
          <p>© 2025 Yayasan Wakfiah Al Mubarak. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;