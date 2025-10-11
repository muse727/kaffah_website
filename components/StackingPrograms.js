'use client';

import Image from 'next/image';
import styles from '../styles/StackingPrograms.module.css';

const programsData = [
  { 
    title: 'DAILY', 
    icon: '/icons/program/daily.svg', 
    items: ['Salam Pagi', 'Spirit of Morning', 'Reading Time/Tilawah', '5S']
  },
  { 
    title: 'WEEKLY', 
    icon: '/icons/program/weekly.svg', 
    items: ['Upacara', 'Pramuka', 'Jum\'at Ceria', 'Monitoring']
  },
  { 
    title: 'MONTHLY', 
    icon: '/icons/program/monthly.svg', 
    items: ['Bilingual', 'Munaqasah Tilawati/Al Quran', 'Market Day', 'Funcooking']
  },
  { 
    title: 'SEMESTER', 
    icon: '/icons/program/semester.svg', 
    items: ['P5', 'Outing Class', 'Outbound', 'Classmeeting', 'Wisuda Tahfizh']
  },
];

const StackingPrograms = () => {
  return (
    <section className={styles.programSection}>
      <div className="container">
        <div className={styles.header} data-aos="fade-up">
          <span className={styles.subtitle}>SDIT Al Mubarak</span>
          <h2 className={styles.title}>Program SDIT Al Mubarak</h2>
          <p className={styles.description}>
            Berbagai program unggulan yang mendukung perkembangan siswa secara holistik
          </p>
        </div>

        {/* Kartu Program dalam Layout Vertikal */}
        <div className={styles.programsList}>
          {programsData.map((program, index) => (
            <div 
              key={program.title}
              className={styles.programCard}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconWrapper}>
                    <Image 
                      src={program.icon} 
                      alt={program.title} 
                      width={50} 
                      height={50} 
                    />
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