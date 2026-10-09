'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/JuaraSection.module.css';

// 🔥 FUNGSI PINTER BUAT NYULAP TANGGAL JADI FORMAT INDO
const formatTanggalIndo = (tanggal) => {
  if (!tanggal) return '-';
  
  // Coba jadikan objek waktu
  const dateObj = new Date(tanggal);
  
  // Kalau ternyata formatnya bukan dari kalender (data lama/invalid), balikin teks aslinya aja
  if (isNaN(dateObj.getTime())) return tanggal;

  // Kalau valid, sulap jadi format: 15 Maret 2026
  return dateObj.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long', // 'long' bikin bulannya jadi huruf (Maret, April, dst)
    year: 'numeric'
  });
};

const JuaraSection = ({ dataJuara = [] }) => {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [selectedJuara, setSelectedJuara] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter Kategori Otomatis
  const filterList = ['Semua', ...Array.from(new Set(dataJuara.map(item => item.category)))];

  const filteredData = activeFilter === 'Semua'
    ? dataJuara
    : dataJuara.filter(item => item.category === activeFilter);

  const openModal = (juara) => {
    setSelectedJuara(juara);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; 
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJuara(null);
    document.body.style.overflow = 'unset'; 
  };

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header} data-aos="fade-up">
          <span className={styles.subtitle}>Prestasi Membanggakan</span>
          <h2 className={styles.title}>Para Juara Kaffah</h2>
          <p className={styles.description}>
            Bukti nyata komitmen kami dalam mencetak generasi yang berprestasi di bidang akademik maupun non-akademik.
          </p>
        </div>

        <div className={styles.filterContainer} data-aos="fade-up" data-aos-delay="100">
          {filterList.map((filter) => (
            <button key={filter} onClick={() => setActiveFilter(filter)} className={`${styles.filterButton} ${activeFilter === filter ? styles.active : ''}`}>
              {filter}
            </button>
          ))}
        </div>

        <motion.div layout className={styles.grid}>
          <AnimatePresence>
            {filteredData.map((item) => (
              <motion.div layout key={item.id} initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ duration: 0.4, ease: "easeOut" }} className={styles.card} whileHover={{ y: -8 }} onClick={() => openModal(item)}>
                <div className={styles.imageWrapper}>
                  <Image src={item.image || '/images/default-placeholder.jpg'} alt={item.student} fill style={{ objectFit: 'cover' }} className={styles.cardImage} />
                  <div className={styles.overlay} />
                  <div className={styles.categoryBadge}>{item.category}</div>
                  <div className={styles.yearBadge}>{item.year}</div>
                  <div className={styles.clickIndicator}><span>Klik untuk detail</span></div>
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle} style={{ color: '#0F6DA1' }}>{item.student}</h3>
                  <div className={styles.studentInfo}>
                    <span className={styles.studentLabel}>Prestasi:</span>
                    <span className={styles.studentName} style={{ color: '#475569' }}>{item.title}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* MODAL DENGAN DETAIL LENGKAP */}
        <AnimatePresence>
          {isModalOpen && selectedJuara && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={styles.modalOverlay} onClick={closeModal}>
              <motion.div initial={{ opacity: 0, scale: 0.8, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 50 }} transition={{ type: "spring", damping: 25 }} className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={closeModal}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                </button>

                <div className={styles.modalGrid}>
                  <div className={styles.modalImage}>
                    <Image src={selectedJuara.image || '/images/default-placeholder.jpg'} alt={selectedJuara.student} fill style={{ objectFit: 'cover' }} />
                    <div className={styles.modalBadge}>{selectedJuara.category} • {selectedJuara.year}</div>
                  </div>

                  <div className={styles.modalInfo}>
                    <h2 className={styles.modalTitle} style={{ color: '#0F6DA1' }}>{selectedJuara.student}</h2>
                    <p className={styles.modalDescription}>{selectedJuara.description || 'Prestasi membanggakan dari siswa/i Kaffah Islamic School.'}</p>

                    <div className={styles.detailGrid}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Penghargaan:</span>
                        <span className={styles.detailValue} style={{fontWeight: 'bold', color: '#1e293b'}}>{selectedJuara.title || '-'}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Nama Acara:</span>
                        <span className={styles.detailValue}>{selectedJuara.competition || '-'}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Penyelenggara:</span>
                        <span className={styles.detailValue}>{selectedJuara.organizer || '-'}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Tempat:</span>
                        <span className={styles.detailValue}>{selectedJuara.location || '-'}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Tanggal:</span>
                        {/* 🔥 FIX: PANGGIL MESIN PENTERJEMAH TANGGAL DI SINI */}
                        <span className={styles.detailValue}>{formatTanggalIndo(selectedJuara.date)}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Pembimbing:</span>
                        <span className={styles.detailValue}>{selectedJuara.teacher || '-'}</span>
                      </div>
                    </div>

                    {selectedJuara.achievements && (
                      <div className={styles.achievements}>
                        <h4 className={styles.achievementsTitle}>Pencapaian:</h4>
                        <div className={styles.achievementsList}>
                          {selectedJuara.achievements.split(',').map((achievement, index) => (
                            <span key={index} className={styles.achievementBadge}>
                              {achievement.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

export default JuaraSection;