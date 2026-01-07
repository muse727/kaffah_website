// components/TujuanSection.js
import styles from '../styles/TujuanSection.module.css';

export default function TujuanSection({ title, items }) {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.underline}></div>
          <p className={styles.subtitle}>Berikut adalah tujuan dan misi yang kami usung untuk memberikan manfaat optimal</p>
        </div>
        
        <div className={styles.grid}>
          {items.map((item, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.cardContent}>
                <div className={styles.numberContainer}>
                  <span className={styles.number}>{index + 1}</span>
                </div>
                <p className={styles.text}>{item}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}