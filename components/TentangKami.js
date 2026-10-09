import Image from 'next/image';
import styles from '../styles/TentangKami.module.css';

const TentangKami = () => {
  return (
    <section className={styles.aboutSection} id="tentang-kami">
      <div className={`${styles.aboutContainer} container`}>
        
        {/* KOLOM KIRI: KONTEN TEKS BARU */}
        <div className={styles.contentWrapper} data-aos="fade-right">
          <h2 className={styles.title}>
            Cerdas, Kuat Bertaqwa,
            <span className={styles.highlight}> Bahagia Itu Mencerdaskan</span>
          </h2>
          
          <div className={styles.descriptionGroup}>
            <p className={styles.description}>
              Kaffah Islamic School menghadirkan pendidikan yang memadukan kecerdasan, ketakwaan, dan kebahagiaan dalam setiap proses belajar. Melalui jenjang KB, TKIT, dan SDIT (KIS 1 & KIS 2) serta LPQ Kaffah, kami berkomitmen membina anak sejak usia dini agar tumbuh menjadi pribadi yang utuh secara iman, ilmu, dan akhlak.
            </p>
            <p className={styles.description}>
              Fokus pendidikan kami adalah membentuk karakter Qur’ani dengan menanamkan kecintaan terhadap Al-Qur’an melalui program hafalan yang terarah, serta membangun akhlak mulia dalam keseharian siswa. Lingkungan belajar dirancang untuk menumbuhkan rasa nyaman dan bahagia sehingga anak dapat berkembang secara optimal.
            </p>
            <p className={styles.description}>
              Selain itu, siswa juga dibekali kemampuan bahasa Inggris melalui penerapan <i>bilingual daily activity</i> sebagai bekal menghadapi tantangan global. Kami percaya, anak yang cerdas, kuat dalam ketakwaan, dan bahagia dalam belajar akan tumbuh menjadi generasi unggul yang siap menghadapi masa depan.
            </p>
          </div>
          
          {/* 🔥 Tombol Read More Resmi Dibuang! */}
        </div>

        {/* KOLOM KANAN: KOLASE GAMBAR */}
        <div className={styles.imageGrid} data-aos="fade-left">
          <div className={styles.imageWrapper1}>
            <Image
              src="/tentang-1.jpg"
              alt="Siswa Kaffah Islamic School 1"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'cover', borderRadius: '16px' }}
            />
          </div>
          <div className={styles.imageWrapper2}>
            <Image
              src="/tentang-2.jpg"
              alt="Siswa Kaffah Islamic School 2"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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