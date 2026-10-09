'use client';

import { useState, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ReCAPTCHA from "react-google-recaptcha"; 
import styles from './login.module.css'; 

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const recaptchaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const recaptchaValue = recaptchaRef.current?.getValue();
    if (!recaptchaValue) {
      setError('Tolong centang "I am not a robot" dulu bro!');
      setLoading(false);
      return;
    }

    const res = await signIn('credentials', {
      username,
      password,
      recaptchaToken: recaptchaValue, 
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
      recaptchaRef.current?.reset(); 
    } else {
      router.push('/admin-dashboard'); // Nanti sesuaikan rute admin lu
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Admin Login 🔒</h1>
          <p className={styles.subtitle}>Masuk untuk kelola web Kaffah Islamic School</p>
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

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
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