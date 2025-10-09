import Image from 'next/image';
import styles from '../styles/VisiMisiSection.module.css';

const VisiMisiSection = ({ visiData, misiData }) => {
  return (
    <section className={styles.visiMisiSection}>
      <div className="container">
        {/* === KOTAK VISI === */}
        <div className={styles.contentBox} data-aos="fade-up">
          <div className={styles.textContent}>
            <h2 className={styles.title}>{visiData.title}</h2>
            <p className={styles.visiText}>{visiData.text}</p>
          </div>
          <div className={`${styles.studentImage} ${styles.visiImage}`}>
            <Image 
              src={visiData.image.src} 
              alt={visiData.image.alt} 
              fill 
              style={{ objectFit: 'contain', objectPosition: 'bottom center' }}
            />
          </div>
        </div>

        {/* === KOTAK MISI === */}
        <div className={styles.contentBox} data-aos="fade-up" data-aos-delay="200">
          <div className={styles.textContent}>
            <h2 className={styles.title}>{misiData.title}</h2>
            <ul className={styles.misiList}>
              {misiData.items.map((item, index) => (
                <li key={index}>
                  <div className={styles.misiIcon}>
                    <Image src="/icons/check-circle.svg" alt="Check" width={24} height={24} />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={`${styles.studentImage} ${styles.misiImage}`}>
            <Image 
              src={misiData.image.src} 
              alt={misiData.image.alt} 
              fill 
              style={{ objectFit: 'contain', objectPosition: 'bottom center' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisiMisiSection;