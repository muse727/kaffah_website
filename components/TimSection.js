'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/TimSection.module.css';

// CONTOH DATA TIM (Nanti kamu ganti dengan data asli)
const teamData = [
  // Manajemen
  { id: 1, name: 'Dr. H. Fulan, M.Pd.', position: 'Ketua Yayasan', image: '/images/tim/manajemen-1.jpg', category: 'Manajemen' },
  { id: 2, name: 'Hj. Fulanah, S.E.', position: 'Bendahara Yayasan', image: '/images/tim/manajemen-2.jpg', category: 'Manajemen' },
  { id: 3, name: 'Ahmad B., S.Kom.', position: 'Direktur Pendidikan', image: '/images/tim/manajemen-3.jpg', category: 'Manajemen' },
  // Guru SD
  { id: 4, name: 'Siti Aisyah, S.Pd.', position: 'Kepala Sekolah SDIT', image: '/images/tim/guru-sd-1.jpg', category: 'Guru SD' },
  { id: 5, name: 'Budi Santoso, S.Pd.I.', position: 'Guru PAI Kelas 6', image: '/images/tim/guru-sd-2.jpg', category: 'Guru SD' },
  { id: 6, name: 'Dewi Lestari, S.S.', position: 'Guru Bahasa Inggris', image: '/images/tim/guru-sd-3.jpg', category: 'Guru SD' },
  { id: 7, name: 'Eko Prasetyo, S.Pd.', position: 'Guru Olahraga', image: '/images/tim/guru-sd-4.jpg', category: 'Guru SD' },
  // Guru SMP
  { id: 8, name: 'Dr. Rahmat Hidayat, M.Si.', position: 'Kepala Sekolah SMPIT', image: '/images/tim/guru-smp-1.jpg', category: 'Guru SMP' },
  { id: 9, name: 'Indah Permata, Lc.', position: 'Guru Bahasa Arab', image: '/images/tim/guru-smp-2.jpg', category: 'Guru SMP' },
  { id: 10, name: 'Surya Putra, S.T.', position: 'Guru Robotik & Coding', image: '/images/tim/guru-smp-3.jpg', category: 'Guru SMP' },
  // Staf
  { id: 11, name: 'Rina Marlina', position: 'Staf Administrasi', image: '/images/tim/staf-1.jpg', category: 'Staf' },
  { id: 12, name: 'Agus Wijaya', position: 'Staf IT Support', image: '/images/tim/staf-2.jpg', category: 'Staf' },
];

const categories = ['Manajemen', 'Guru SD', 'Guru SMP', 'Staf'];

const TimSection = () => {
  const [activeCategory, setActiveCategory] = useState('Manajemen');

  const filteredTeam = teamData.filter(member => member.category === activeCategory);

  return (
    <section className={styles.timSection}>
      <div className="container">
        <div className={styles.header} data-aos="fade-up">
          <h2 className={styles.title}>Tim Hebat Al Mubarak</h2>
          <p className={styles.subtitle}>Kenali para pendidik dan tenaga profesional di balik layar kesuksesan kami.</p>
        </div>

        {/* Tombol Filter Kategori */}
        <div className={styles.filterButtons} data-aos="fade-up" data-aos-delay="100">
          {categories.map(category => (
            <button
              key={category}
              className={`${styles.filterButton} ${activeCategory === category ? styles.active : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid Anggota Tim */}
        <motion.div layout className={styles.grid}>
          <AnimatePresence>
            {filteredTeam.map(member => (
              <motion.div
                key={member.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className={styles.card}
              >
                <div className={styles.imageWrapper}>
                  <Image src={member.image} alt={member.name} fill style={{ objectFit: 'cover', objectPosition: 'top center' }} />
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.name}>{member.name}</h3>
                  <p className={styles.position}>{member.position}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default TimSection;