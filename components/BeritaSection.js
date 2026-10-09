import Image from 'next/image';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import styles from '../styles/BeritaSection.module.css';

const prisma = new PrismaClient();

// 🔥 MESIN PEMBERSIH TEKS SUPER AMPUH
const cleanExcerpt = (html) => {
  if (!html) return '';
  // 1. Buang semua tag HTML (kayak <p>, <strong>, dll)
  let text = html.replace(/<[^>]+>/g, ' ');
  // 2. Basmi &nbsp; dan ubah jadi spasi normal
  text = text.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
  // 3. Rapihin spasi yang dobel-dobel
  text = text.replace(/\s+/g, ' ').trim();
  // 4. Potong maksimal 70 karakter biar aman di dalem kotak
  return text.length > 70 ? text.substring(0, 70) + '...' : text;
};

export default async function BeritaSection() {
  // Langsung ambil 7 berita terbaru dari database
  const posts = await prisma.berita.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    take: 7 
  });

  if (!posts || posts.length === 0) {
    return null; // Kalau kosong ga usah ditampilin sectionnya
  }

  return (
    <section className={styles.newsSection}>
      <div className="container">
        <div className={styles.header} data-aos="fade-up">
          <span className={styles.subTitle}>BERITA TERBARU</span>
          <h2 className={styles.title}>Kabar dan Kegiatan Terkini Kaffah</h2>
          <p className={styles.description}>
            Lihat berbagai kegiatan, prestasi, dan pengumuman terbaru dari seluruh unit pendidikan di Kaffah Islamic School.
          </p>
        </div>

        <div className={styles.bentoGrid} data-aos="fade-up" data-aos-delay="200">
          {posts.map((post) => {
            // Kalau artikelnya ga dikasih foto, skip jangan masukin ke kotak bento
            if (!post.image) return null;

            return (
              <Link href={`/berita/${post.slug}`} key={post.id} className={styles.card}>
                <div className={styles.cardImage}>
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                  {/* Ini pakai overlay Biru Dongker yang ada di CSS lu */}
                  <div className={styles.blueOverlay}></div>
                </div>
                <div className={styles.cardContent}>
                  <span className={styles.cardCategory}>Berita</span>
                  <h3 className={styles.cardTitle}>{post.title}</h3>
                  
                  {/* Panggil fungsi pembersih teks di sini */}
                  <p className={styles.cardDescription}>{cleanExcerpt(post.content)}</p>
                  
                  <div className={styles.readMore}>Baca Selengkapnya</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}