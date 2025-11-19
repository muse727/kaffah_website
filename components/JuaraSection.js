'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/JuaraSection.module.css';

// DATA PRESTASI (Diperbarui dengan informasi lengkap)
const juaraData = [
  {
    id: 1,
    title: 'Juara 1 Lomba Cerdas Cermat Gebyar SMP Islam RPI 2025 ',
    student: 'Asadel, Kenzie, Nafis',
    category: 'SD',
    year: '2025',
    image: '/images/juara/juara-1.jpg',
    // Data tambahan untuk modal
    competition: 'Lomba Cerdas Cermat Gebyar SMP Islam RPI 2025',
    organizer: 'SMP Islam RPI',
    location: 'Jakarta Selatan',
    date: '02 November 2025',
    description: 'Meraih Juara 1 dalam lomba cerdas cermat tingkat SMP dengan pengetahuan luas dan strategi tim yang solid.',
    achievements: ['Juara 1 Cerdas cermat',],
    teacher: 'Sutedi, S.Pd'
  },
  {
    id: 2,
    title: 'Juara Harapan 1 Nasyid Apresiasi dan Lomba Seni Nuansa Religi',
    student: 'Tim Nasyid Al Mubarak',
    category: 'SMP',
    year: '2025',
    image: '/images/juara/juara-2.jpg',
    competition: 'Apresiasi dan Lomba Seni Nuansa Religi',
    organizer: 'Suku Dinas Kebudayaan Kota Administrasi Jakarta Pusat ',
    location: 'jakarta Pusat',
    date: '07 - Agustus 2025',
    description: 'Mendapatkan Juara Harapan 1 dalam lomba Nasyid dengan penampilan yang memukau dan harmonisasi vokal yang luar biasa.',
    achievements: ['Juara harapan 1', ],
    teacher: 'Bu Siti Maryam, M.Pd'
  },
  {
    id: 3,
    title: ' Juara 2 Lomba Poster Digital Big Event M I J 2025',
    student: 'Haura Sulanjari Subroto',
    category: 'SMP',
    year: '2025',
    image: '/images/juara/juara-3.jpg',
    competition: 'Lomba Poster Digital Big Event M I J 2025',
    organizer: 'Madrasah Istiqlal Jakarta',
    location: 'Madrasah Istiqlal Jakarta',
    date: '08 November 2025',
    description: 'Meraih Juara 2 dalam lomba poster digital dengan tema "Peran Generasi Muda dalam Mewujudkan Perdamaian Dunia".',
    achievements: ['Juara 2 Poster Digital', ],
    teacher: 'Ustadzah Fatimah, S.Pd'
  },
  {
    id: 4,
    title: 'Juara Umum Pramuka Jambore',
    student: 'Tim Pramuka SMPIT',
    category: 'SMP',
    year: '2023',
    image: '/images/juara/juara-4.jpg',
    competition: 'Jambore Pramuka Tingkat Regional 2023',
    organizer: 'Kwarcab Gerakan Pramuka',
    location: 'Bumi Perkemahan Cibubur, Jakarta',
    date: '5-8 Agustus 2023',
    description: 'Tim pramuka SMPIT Al Mubarak berhasil menjadi juara umum dalam jambore regional dengan mengumpulkan poin tertinggi di semua kategori lomba.',
    achievements: ['Juara Umum', 'Juara Pioneering', 'Juara Survival Skill'],
    teacher: 'Pak Andi Wijaya, S.Pd'
  },
  {
    id: 5,
    title: 'Juara 1 Futsal Cup',
    student: 'Tim Futsal SDIT',
    category: 'SD',
    year: '2024',
    image: '/images/juara/juara-5.jpg',
    competition: 'Turnamen Futsal Cup SD Se-Kota 2024',
    organizer: 'Dinas Pemuda dan Olahraga',
    location: 'GOR Serbaguna Kota',
    date: '12-14 Januari 2024',
    description: 'Tim futsal SDIT Al Mubarak menjuarai turnamen futsal dengan permainan yang solid dan sportif.',
    achievements: ['Juara 1 Futsal', 'Fair Play Award'],
    teacher: 'Pak Rizky Maulana, S.Pd'
  },
  {
    id: 6,
    title: 'Juara 3 Robotik Regional',
    student: 'Budi & Tono',
    category: 'SMP',
    year: '2024',
    image: '/images/juara/juara-6.jpg',
    competition: 'Kompetisi Robotik Regional Jawa Barat 2024',
    organizer: 'IEEE Indonesia Section',
    location: 'ITB Bandung, Jawa Barat',
    date: '28 Februari 2024',
    description: 'Berhasil menciptakan robot pemilah sampah otomatis yang inovatif dan ramah lingkungan.',
    achievements: ['Juara 3 Robotik', 'Inovasi Terbaik'],
    teacher: 'Bu Dian Sari, M.T'
  },
];

const filters = ['Semua', 'SD', 'SMP'];

const JuaraSection = () => {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [selectedJuara, setSelectedJuara] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredData = activeFilter === 'Semua'
    ? juaraData
    : juaraData.filter(item => item.category === activeFilter);

  const openModal = (juara) => {
    setSelectedJuara(juara);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJuara(null);
    document.body.style.overflow = 'unset'; // Re-enable scroll
  };

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header} data-aos="fade-up">
          <span className={styles.subtitle}>Prestasi Membanggakan</span>
          <h2 className={styles.title}>Para Juara Al Mubarak</h2>
          <p className={styles.description}>
            Bukti nyata komitmen kami dalam mencetak generasi yang berprestasi di bidang akademik maupun non-akademik.
          </p>
        </div>

        {/* FILTER BUTTONS */}
        <div className={styles.filterContainer} data-aos="fade-up" data-aos-delay="100">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`${styles.filterButton} ${activeFilter === filter ? styles.active : ''}`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* GRID KARTU JUARA */}
        <motion.div layout className={styles.grid}>
          <AnimatePresence>
            {filteredData.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={styles.card}
                whileHover={{ y: -8 }}
                onClick={() => openModal(item)}
              >
                <div className={styles.imageWrapper}>
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    fill 
                    style={{ objectFit: 'cover' }}
                    className={styles.cardImage}
                  />
                  <div className={styles.overlay} />
                  <div className={styles.categoryBadge}>{item.category}</div>
                  <div className={styles.yearBadge}>{item.year}</div>
                  <div className={styles.clickIndicator}>
                    <span>Klik untuk detail</span>
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <div className={styles.studentInfo}>
                    <span className={styles.studentLabel}>Oleh:</span>
                    <span className={styles.studentName}>{item.student}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* MODAL */}
        <AnimatePresence>
          {isModalOpen && selectedJuara && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.modalOverlay}
              onClick={closeModal}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                transition={{ type: "spring", damping: 25 }}
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
              >
                <button className={styles.closeButton} onClick={closeModal}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>

                <div className={styles.modalGrid}>
                  <div className={styles.modalImage}>
                    <Image 
                      src={selectedJuara.image} 
                      alt={selectedJuara.title} 
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                    <div className={styles.modalBadge}>
                      {selectedJuara.category} • {selectedJuara.year}
                    </div>
                  </div>

                  <div className={styles.modalInfo}>
                    <h2 className={styles.modalTitle}>{selectedJuara.title}</h2>
                    <p className={styles.modalDescription}>{selectedJuara.description}</p>

                    <div className={styles.detailGrid}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Nama Lomba:</span>
                        <span className={styles.detailValue}>{selectedJuara.competition}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Penyelenggara:</span>
                        <span className={styles.detailValue}>{selectedJuara.organizer}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Tempat:</span>
                        <span className={styles.detailValue}>{selectedJuara.location}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Tanggal:</span>
                        <span className={styles.detailValue}>{selectedJuara.date}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Pembimbing:</span>
                        <span className={styles.detailValue}>{selectedJuara.teacher}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Peserta:</span>
                        <span className={styles.detailValue}>{selectedJuara.student}</span>
                      </div>
                    </div>

                    <div className={styles.achievements}>
                      <h4 className={styles.achievementsTitle}>Pencapaian:</h4>
                      <div className={styles.achievementsList}>
                        {selectedJuara.achievements.map((achievement, index) => (
                          <span key={index} className={styles.achievementBadge}>
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </div>
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