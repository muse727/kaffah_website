import Image from 'next/image';
import styles from '../styles/AlurPendaftaran.module.css';

const AlurPendaftaran = ({ alur }) => {
  if (!alur || alur.length === 0) {
    return (
      <section className={styles.section}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className={styles.title}>Alur Pendaftaran</h2>
          <p>Data alur pendaftaran belum tersedia.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.title} data-aos="fade-up">Alur Pendaftaran</h2>
        <div className={styles.grid}>
          {alur.map((item, index) => {
            const imageUrl = item.gambar_ilustrasi?.url;
            const isHighlighted = [2, 3, 6].includes(item.nomor_urut);

            return (
              // PERBAIKAN: 'key' dipindah ke elemen paling luar
              <div 
                key={item.nomor_urut} // <-- 'key' HARUS ADA DI SINI
                className={`${styles.card} ${isHighlighted ? styles.highlighted : ''}`}
                data-aos="fade-up" 
                data-aos-delay={index * 100}
              >
                <div className={styles.cardHeader}>
                  <h3>{item.judul}</h3>
                </div>
                <div className={styles.cardBody}>
                  <p>{item.deskripsi}</p>
                  {imageUrl && (
                    <div className={styles.cardImage}>
                      <Image 
                        src={imageUrl}
                        alt={item.judul}
                        fill
                        sizes="30vw"
                        style={{ objectFit: 'contain', objectPosition: 'right' }}
                      />
                    </div>
                  )}
                </div>
                <div className={styles.cardNumber}>{item.nomor_urut}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AlurPendaftaran;