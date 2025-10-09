'use client';

import { useState } from 'react';
import styles from '../../styles/Kontak.module.css';

export default function KontakPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setStatus('success');
        setFormData({ fullName: '', email: '', phone: '', service: '', message: '' });
      } else {
        throw new Error('Gagal mengirim pesan.');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className={styles.parallaxContainer}>
      {/* ===== SECTION 1: PENDAHULUAN (DI ATAS) ===== */}
      <section className={`${styles.section} ${styles.sectionOne}`}>
        <div className="container">
          <div className={styles.introContent}>
            <h1>Komitmen Kami Adalah Amanah Anda</h1>
            <p>
              Setiap langkah kami selaras dengan visi pendidikan yang berakhlak mulia, memastikan manajemen program yang terpercaya dan hasil yang berdampak nyata bagi masa depan generasi.
            </p>
            <div className={styles.cta}>
              <span>Ingin tahu lebih lanjut tentang Yayasan Al Mubarak?</span>
              <a href="/tentang-kami" className={styles.ctaButton}>Klik di Sini</a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 2: FORMULIR KONTAK (DI BAWAH) ===== */}
      <section className={`${styles.section} ${styles.sectionTwo}`}>
        <div className="container">
          <div className={styles.contactGrid}>
            <div className={styles.contactInfo}>
              <h2>Butuh Bantuan atau Informasi?</h2>
              <h1>KAMI SIAP MENDENGARKAN</h1>
              <p>
                Kami hadir untuk membantu Anda mencapai tujuan pendidikan terbaik. Jika ada pertanyaan seputar program kami, ingin menjajaki kesempatan kolaborasi, atau butuh panduan untuk proyek besar Anda selanjutnya, kami siap membantu.
              </p>
            </div>
            <div className={styles.formContainer}>
              <form onSubmit={handleSubmit}>
                <p>Isi formulir di bawah ini dan tim kami akan segera menghubungi Anda kembali.</p>
                <div className={styles.inputGroup}>
                  <label htmlFor="fullName">Nama Lengkap</label>
                  <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="email">Alamat Email</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="phone">Nomor Telepon</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="service">Unit Pendidikan yang Dituju?</label>
                  <select id="service" name="service" value={formData.service} onChange={handleChange} required>
                    <option value="" disabled>Pilih Unit</option>
                    <option value="SDIT Al Mubarak">SDIT Al Mubarak</option>
                    <option value="SMPIT Al Mubarak">SMPIT Al Mubarak</option>
                    <option value="Yayasan Umum">Yayasan (Umum)</option>
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="message">Pesan Anda</label>
                  <textarea id="message" name="message" rows="4" value={formData.message} onChange={handleChange} required></textarea>
                </div>

                {status === 'success' && <p className={styles.successMsg}>Terima kasih! Pesan Anda telah terkirim.</p>}
                {status === 'error' && <p className={styles.errorMsg}>Maaf, terjadi kesalahan. Silakan coba lagi.</p>}
                
                <button type="submit" className={styles.submitButton} disabled={status === 'loading'}>
                  {status === 'loading' ? 'Mengirim...' : 'Kirim Pesan'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
