import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/TentangKami.module.css';

const TentangKami = () => {
  return (
    <section className={styles.aboutSection} id="tentang-kami">
      <div className={`${styles.aboutContainer} container`}>
        {/* KOLOM KIRI: KONTEN TEKS */}
        <div className={styles.contentWrapper} data-aos="fade-right">
          <h2 className={styles.title}>
            Menebar Cahaya Ilmu, Membangun
            <span className={styles.highlight}> Generasi Berakhlak Mulia</span>
          </h2>
          <p className={styles.description}>
            Yayasan Wakfiah Al Mubarak berdiri dengan semangat untuk menghadirkan pendidikan yang tidak hanya berorientasi pada kecerdasan intelektual, tetapi juga pembinaan akhlak dan penguatan iman. Melalui unit pendidikan Sekolah Dasar (SD), Sekolah Menengah Pertama (SMP), dan Lembaga Pendidikan Qur'an (LPQ), yayasan ini berkomitmen mencetak generasi muda yang unggul dalam ilmu pengetahuan, terampil menghadapi tantangan zaman, sekaligus berkarakter islami.
          </p>
          <Link href="/selengkapnya" className={styles.ctaButton}>
            Read More
          </Link>
        </div>

        {/* KOLOM KANAN: KOLASE GAMBAR */}
        <div className={styles.imageGrid} data-aos="fade-left">
          <div className={styles.imageWrapper1}>
            <Image
              src="/tentang-1.jpg"
              alt="Siswa Yayasan Al Mubarak 1"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // <-- TAMBAHKAN INI
              style={{ objectFit: 'cover', borderRadius: '16px' }}
            />
          </div>
          <div className={styles.imageWrapper2}>
            <Image
              src="/tentang-2.jpg"
              alt="Siswa Yayasan Al Mubarak 2"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // <-- TAMBAHKAN INI
              style={{ objectFit: 'cover', borderRadius: '16px' }}
            />
          </div>
          <div className={styles.colorBlock}></div>
        </div>
      </div>
    </section>
  );
};

export default TentangKami;