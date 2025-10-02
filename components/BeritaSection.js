import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/BeritaSection.module.css';

// FUNGSI BARU: "Penerjemah" dari JSON Rich Text ke teks biasa
const extractTextFromRichText = (richTextArray) => {
  if (!richTextArray) return '';
  let plainText = '';
  // Loop melalui setiap blok di dalam array konten
  richTextArray.forEach(block => {
    if (block.type === 'paragraph' && block.children) {
      // Loop melalui setiap anak dari blok paragraf
      block.children.forEach(child => {
        if (child.type === 'text' && child.text) {
          plainText += child.text + ' '; // Gabungkan semua teks
        }
      });
    }
  });
  return plainText.trim(); // Hapus spasi ekstra di akhir
};

// Fungsi untuk memotong teks
const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  // Cari spasi terakhir sebelum batas maksimal
  const lastSpace = text.lastIndexOf(' ', maxLength);
  return text.substring(0, lastSpace) + '...';
};


const BeritaSection = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return (
      <section className={styles.newsSection}>
        <div className="container" style={{ textAlign: 'center', padding: "4rem 0" }}>
          <h2 className={styles.title}>Berita Terbaru</h2>
          <p>Belum ada berita untuk ditampilkan.</p>
        </div>
      </section>
    );
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
          {posts.slice(0, 9).map((post) => {
            const imageUrl = post.gambar_utama?.url;
            
            // PERBAIKAN KUNCI DI SINI
            // 1. Terjemahkan Rich Text 'konten' menjadi teks biasa
            const plainTextContent = extractTextFromRichText(post.konten);
            // 2. Potong teks biasa yang sudah diterjemahkan
            const shortDescription = truncateText(plainTextContent, 80); 

            if (!imageUrl) return null;

            return (
              <Link href={`/berita/${post.slug || post.id}`} key={post.id} className={styles.card}>
                <div className={styles.cardImage}>
                  <Image
                    src={`http://localhost:1337${imageUrl}`} // Pastikan ini sudah pakai ngrok atau localhost sesuai kondisi
                    alt={post.judul}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className={styles.greenOverlay}></div>
                </div>
                <div className={styles.cardContent}>
                  <span className={styles.cardCategory}>News</span>
                  <h3 className={styles.cardTitle}>{post.judul}</h3>
                  {/* Tampilkan deskripsi yang sudah dipotong */}
                  <p className={styles.cardDescription}>{shortDescription}</p>
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