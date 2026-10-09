'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/TimSection.module.css';

const TimSection = ({ dataTim = [] }) => {
  // 🔥 AUTO FILTER: Bikin filter otomatis berdasarkan kategori dari database
  const defaultCategories = ['Manajemen', 'Guru KIS 1', 'Guru KIS 2', 'Staf'];
  const dbCategories = Array.from(new Set(dataTim.map(item => item.category)));
  const allCategories = Array.from(new Set([...defaultCategories, ...dbCategories]));

  const [activeCategory, setActiveCategory] = useState('Manajemen');

  const filteredTeam = dataTim.filter(member => member.category === activeCategory);

  if (!dataTim || dataTim.length === 0) return null;

  return (
    <section className={styles.timSection}>
      <div className="container">
        <div className={styles.header} data-aos="fade-up">
          <h2 className={styles.title}>Tim Hebat Kaffah Islamic School</h2>
          <p className={styles.subtitle}>Kenali para pendidik dan tenaga profesional di balik layar kesuksesan kami.</p>
        </div>

        <div className={styles.filterButtons} data-aos="fade-up" data-aos-delay="100">
          {allCategories.map(category => (
            <button
              key={category}
              className={`${styles.filterButton} ${activeCategory === category ? styles.active : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredTeam.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
             <p>Belum ada data tim untuk kategori <b>{activeCategory}</b>.</p>
          </div>
        ) : (
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
                    <img 
                      src={member.image || '/images/default-avatar.jpg'} 
                      alt={member.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} 
                    />
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.name}>{member.name}</h3>
                    <p className={styles.position}>{member.position}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default TimSection;