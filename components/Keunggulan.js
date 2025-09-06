import Image from 'next/image';
import styles from '../styles/Keunggulan.module.css';

const features = [
  { icon: '/icons/kurikulum.svg', text: 'Kurikulum berbasis agama & karakter' },
  { icon: '/icons/pendidik.svg', text: 'Tenaga pendidik profesional' },
  { icon: '/icons/prestasi.svg', text: 'Prestasi akademik & non-akademik' },
  { icon: '/icons/fasilitas.svg', text: 'Fasilitas lengkap & lingkungan nyaman' },
];

const Keunggulan = () => {
  return (
    <section className={styles.section}>
      <div className={`${styles.container} container`}>
        {/* Elemen #1: Judul */}
        <h2 className={styles.title} data-aos="fade-down">
          Mengapa harus di <span className={styles.highlight}>Al Mubarak?</span>
        </h2>

        {/* Elemen #2: Kolom Gambar */}
        <div className={styles.imageColumn} data-aos="fade-right">
          <div className={styles.blobBackground}>
            <Image src="/blob.svg" alt="Bentuk Abstrak" fill />
          </div>
          <div className={styles.mainImageWrapper}>
            <Image 
              src="/photo-keunggulan.png" 
              alt="Siswi Al Mubarak" 
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className={styles.likeIcon1} data-aos="zoom-in" data-aos-delay="500">
            <Image src="/icons/like-icon.svg" alt="Like" width={60} height={60} />
          </div>
          <div className={styles.likeIcon2} data-aos="zoom-in" data-aos-delay="700">
            <Image src="/icons/like-icon.svg" alt="Like" width={60} height={60} />
          </div>
        </div>

        {/* Elemen #3: Daftar Keunggulan */}
        <div className={styles.featuresGrid} data-aos="fade-left">
          {features.map((feature, index) => (
            <div key={index} className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <Image src={feature.icon} alt="" width={24} height={24} />
              </div>
              <span>{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Keunggulan;