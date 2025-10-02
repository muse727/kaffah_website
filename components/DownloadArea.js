import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/DownloadArea.module.css';

const brochures = [
  { title: 'Brosur SD', fileUrl: '#' }, // Ganti '#' dengan link file PDF brosur lo
  { title: 'Brosur SMP', fileUrl: '#' },
  { title: 'Brosur LPQ', fileUrl: '#' },
];

const DownloadArea = () => {
  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.title} data-aos="fade-up">Download Area</h2>
        <div className={styles.grid}>
          {brochures.map((brochure, index) => (
            <div key={index} className={styles.card} data-aos="fade-up" data-aos-delay={index * 100}>
              <div className={styles.iconWrapper}>
                {/* Kalau mau ganti gambar siswa, tinggal ganti komponen Image ini */}
                <Image src="/icons/brosur-icon.svg" alt="Ikon Brosur" width={64} height={64} />
              </div>
              <h3>{brochure.title}</h3>
              <Link href={brochure.fileUrl} className={styles.downloadButton} target="_blank">
                Download
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DownloadArea;