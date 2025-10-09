import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/BeritaSection.module.css';

const BeritaSection = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return <p>Tidak ada berita untuk ditampilkan.</p>;
  }

  return (
    <section className={styles.newsSection}>
      <div className="container">
        <div className={styles.header} data-aos="fade-up">
          <span className={styles.subTitle}>BERITA TERBARU</span>
          <h2 className={styles.title}>Kabar dan Kegiatan Terkini dari Al Mubarak</h2>
          <p className={styles.description}>
            Lihat berbagai kegiatan, prestasi, dan pengumuman terbaru dari seluruh unit pendidikan di Yayasan Wakfiah Al Mubarak.
          </p>
        </div>

        <div className={styles.bentoGrid} data-aos="fade-up" data-aos-delay="200">
          {posts.map((post) => {
            const title = post.title;
            const slug = post.slug;
            const imageUrl = post.featuredImage?.node?.sourceUrl;
            
            // Bersihkan dan potong excerpt
            const excerpt = post.excerpt ? post.excerpt.replace(/<[^>]+>/g, '').substring(0, 100) + '...' : '';

            if (!imageUrl) return null;

            return (
              <Link href={`/berita/${slug}`} key={post.id} className={styles.card}>
                <div className={styles.cardImage}>
                  <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className={styles.greenOverlay}></div>
                </div>
                <div className={styles.cardContent}>
                  <span className={styles.cardCategory}>News</span>
                  <h3 className={styles.cardTitle}>{title}</h3>
                  <p className={styles.cardDescription}>{excerpt}</p>
                  <div className={styles.readMore}>Read More</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BeritaSection;