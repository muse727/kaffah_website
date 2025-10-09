import Image from 'next/image';
import styles from '../styles/GaleriSection.module.css';

// Komponen sekarang menerima props: title, description, subtitle, dan images
const GaleriSection = ({ title, description, subtitle, images }) => {
  // Jika tidak ada gambar, jangan tampilkan section sama sekali
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <section className={styles.galeriSection}>
      <div className="container">
        <div className={styles.header} data-aos="fade-up">
          <span className={styles.subtitle}>{subtitle}</span>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
        </div>

        <div className={styles.bentoGrid} data-aos="fade-up" data-aos-delay="200">
          {images.map((image, index) => (
            <div key={index} className={`${styles.gridItem} ${image.span || ''}`}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: 'cover' }}
              />
              <div className={styles.overlay}>
                <p>{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GaleriSection;