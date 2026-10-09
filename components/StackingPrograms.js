'use client';

import Image from 'next/image';
import styles from '../styles/StackingPrograms.module.css';

const programsData = [
  { 
    title: 'HARIAN', 
    icon: '/icons/program/daily.svg', 
    items: ['Greeting / Penyambutan siswa', "Shalat dhuha berjama'ah", "Shalat dzuhur berjama'ah", 'Tahsin & Tahfidz']
  },
  { 
    title: 'MINGGUAN', 
    icon: '/icons/program/weekly.svg', 
    items: ['Upacara bendera', 'Senam pagi', 'Pramuka', 'Mentoring keislaman & kultum', "Shalat dhuha berjama'ah", 'Bilingual', 'Intrakurikuler (Melukis, menari & musik)', 'Ekstrakurikuler', 'Upgrading guru', 'Literasi & numerasi']
  },
  { 
    title: 'BULANAN', 
    icon: '/icons/program/monthly.svg', 
    items: ['Evaluasi pembelajaran', 'Rapat guru', 'Parenting / Kajian orang tua', 'Duta Gema (Gerakan Matikan Hp/TV)', 'The best class']
  },
  { 
    title: 'SEMESTERAN', 
    icon: '/icons/program/semester.svg', 
    items: ['Asesmen sumatif & Pembagian rapor', 'Projek kokurikuler (Gelar karya)', 'Pesantren Ramadhan & Mabit', 'Wisuda Qur’an & Kelulusan', 'Outing class & Outbond', 'Kaffah Character Camp', 'Class meeting & Lomba 17 Agustus', 'Visit native speaker']
  },
];

// 🔥 SEKARANG NERIMA PROPS BIAR BISA DIPAKE KAFFAH 1 & KAFFAH 2
const StackingPrograms = ({ subtitle, title }) => {
  return (
    <section className={styles.programSection}>
      <div className="container">
        <div className={styles.header} data-aos="fade-up">
          <span className={styles.subtitle}>{subtitle || 'Kaffah Islamic School'}</span>
          <h2 className={styles.title}>{title || 'Program Kegiatan'}</h2>
          <p className={styles.description}>
            Aktivitas terprogram untuk membentuk generasi Qurani yang Rabbani secara holistik.
          </p>
        </div>

        <div className={styles.programsList}>
          {programsData.map((program, index) => (
            <div key={program.title} className={styles.programCard} data-aos="fade-up" data-aos-delay={index * 100}>
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconWrapper}>
                    <Image src={program.icon} alt={program.title} width={50} height={50} />
                    <h3 className={styles.cardTitle}>{program.title}</h3>
                  </div>
                </div>
                
                <div className={styles.cardBody}>
                  <ul className={styles.programList}>
                    {program.items.map((item) => (
                      <li key={item} className={styles.programItem}>
                        <span className={styles.bullet}>•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StackingPrograms;