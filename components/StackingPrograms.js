'use client';

import Image from 'next/image';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import styles from '../styles/StackingPrograms.module.css';
import scrollStackStyles from '../styles/ScrollStack.module.css';

// URUTAN PENTING: 
// Kartu PERTAMA dalam array = muncul PERTAMA di scroll = paling BAWAH dalam tumpukan
// Kartu TERAKHIR dalam array = muncul TERAKHIR di scroll = paling ATAS dalam tumpukan
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
  const handleStackComplete = () => {
    console.log('✅ All programs stacked! Ready for main page scroll.');
  };

  return (
    <section className={styles.programSection}>
      <div className="container">
        <div className={styles.header} data-aos="fade-up">
          <span className={styles.subtitle}>SDIT Al Mubarak</span>
          <h2 className={styles.title}>Program SDIT Al Mubarak</h2>
          <p className={styles.description}>
            Scroll di area berikut untuk melihat program-program kami
          </p>
        </div>
      </div>
      
      {/* ScrollStack dengan Container Terpisah */}
      <ScrollStack 
        height="70vh"
        itemDistance={80}
        itemStackDistance={25}
        baseScale={0.85}
        itemScale={0.04}
        stackPosition="25%"
        rotationAmount={0.3}
        blurAmount={0.5}
        onStackComplete={handleStackComplete}
      >
        {/* Scroll Indicator */}
        <div className={scrollStackStyles['scroll-indicator']}>
          Scroll untuk stacking program
        </div>

        {/* Kartu dengan urutan yang benar */}
        {programsData.map((program) => (
          <ScrollStackItem key={program.title}>
            <div className={scrollStackStyles.cardContent}>
              <div className={scrollStackStyles.iconWrapper}>
                <Image 
                  src={program.icon} 
                  alt={program.title} 
                  width={80} 
                  height={80} 
                  priority
                />
                <h3>{program.title}</h3>
              </div>
              <div className={scrollStackStyles.itemsWrapper}>
                <ul>
                  {program.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollStackItem>
        ))}
      </ScrollStack>

      {/* Section berikutnya setelah stacking selesai */}
      <div className={styles.nextSection}>
        <div className="container">
          <h3>Lanjut ke bagian berikutnya...</h3>
          <p>Setelah semua program ter-stack, Anda bisa scroll halaman utama untuk melanjutkan</p>
        </div>
      </div>
    </section>
  );
};

export default StackingPrograms;