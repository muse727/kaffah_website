import Image from 'next/image';
import styles from '../styles/SambutanKepsek.module.css';

const SambutanKepsek = ({ data }) => {
  return (
    <section className={styles.section}>
      <div className={`container ${styles.container}`}>
        
        {/* FOTO KEPALA SEKOLAH */}
        <div className={styles.imageWrapper} data-aos="fade-right">
          <div className={styles.imageFrame}>
            <Image 
              src={data.fotoKepsek} 
              alt={data.namaKepsek} 
              fill 
              style={{ objectFit: 'cover' }} 
            />
          </div>
          {/* Aksen Kotak di belakang foto biar 3D */}
          <div className={styles.imageAccent}></div>
        </div>

        {/* TEKS SAMBUTAN */}
        <div className={styles.contentWrapper} data-aos="fade-left">
          <span className={styles.subtitle}>Sambutan Kepala Sekolah</span>
          <h2 className={styles.title}>{data.namaKepsek}</h2>
          
          <div className={styles.textContent}>
            {data.paragraf.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default SambutanKepsek;