import Image from 'next/image';
import styles from '../styles/EkstrakurikulerSection.module.css';

// Komponen sekarang menerima 'data' sebagai prop
const EkstrakurikulerSection = ({ subtitle, title, data }) => {
  // Jika tidak ada data, jangan tampilkan section
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <section className={styles.ekskulSection}>
      <div className="container">
        <div className={styles.header} data-aos="fade-up">
          <span className={styles.subtitle}>{subtitle}</span>
          <h2 className={styles.title}>{title}</h2>
        </div>

        <div className={styles.grid} data-aos="fade-up" data-aos-delay="200">
          {data.map((item, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.iconWrapper}>
                <Image src={item.icon} alt={item.name} width={48} height={48} />
              </div>
              <h3 className={styles.cardTitle}>{item.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EkstrakurikulerSection;