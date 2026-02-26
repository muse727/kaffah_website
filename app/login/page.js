'use client';

import { useState, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ReCAPTCHA from "react-google-recaptcha"; // 👈 Import reCAPTCHA
import styles from './login.module.css'; // Import CSS Module

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // 👇 Referensi buat nangkep nilai kotak centang Google 👇
  const recaptchaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 1. Cek dulu apakah centang robot udah diklik
    const recaptchaValue = recaptchaRef.current?.getValue();
    if (!recaptchaValue) {
      setError('Tolong centang "I am not a robot" dulu bro!');
      setLoading(false);
      return;
    }

    // 2. Lempar data (termasuk token captcha) ke mesin NextAuth
    const res = await signIn('credentials', {
      username,
      password,
      recaptchaToken: recaptchaValue, // 👈 Token rahasia dikirim ke satpam
      redirect: false,
    });

    if (res?.error) {
      // Tampilkan error cerdas dari backend (misal: "Akun digembok 15 menit")
      setError(res.error);
      setLoading(false);
      // Reset centang recaptcha kalau gagal login biar bisa diklik lagi
      recaptchaRef.current?.reset(); 
    } else {
      router.push('/admin-dashboard');
    }
  };

  return (
    // Gunakan styles.container agar Full Screen dan menutupi Navbar
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Admin Login 🔒</h1>
          <p className={styles.subtitle}>Masuk untuk kelola data wakaf</p>
        </div>
        
        {error && (
          <div className={styles.errorMessage}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
              placeholder="Contoh: admin"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••"
              required
            />
          </div>

          {/* 👇 KOTAK GOOGLE RECAPTCHA MUNCUL DI SINI 👇 */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'Memproses...' : 'MASUK DASHBOARD 🚀'}
          </button>
        </form>
      </div>
    </div>
  );
}