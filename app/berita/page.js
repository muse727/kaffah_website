import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { PrismaClient } from '@prisma/client'; // 👈 Panggil Prisma langsung
import styles from '../../styles/BeritaIndex.module.css';
import Pagination from '../../components/Pagination'; 
import PageWrapper from '../../components/PageWrapper';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

// Fungsi buatan buat motong isi berita (karena kita ga pake excerpt bawaan WP lagi)
const generateExcerpt = (html) => {
  if (!html) return '';
  const text = html.replace(/<[^>]+>/g, ''); // Buang tag HTML bawaan Editor Quill
  return text.length > 120 ? text.substring(0, 120) + '...' : text;
};

const PaginationLoading = () => (
  <div style={{ height: '60px', textAlign: 'center', paddingTop: '20px' }}>
    <p>Memuat navigasi halaman...</p>
  </div>
);

export default async function BeritaIndexPage(props) {
  const searchParams = await props.searchParams;
  
  // Karena sekarang pake database lokal, ambil datanya gampang banget!
  const posts = await prisma.berita.findMany({
    where: { status: 'PUBLISHED' }, // Cuma tampilin yang statusnya Terbit
    orderBy: { createdAt: 'desc' }
  });

  const isFirstPage = true; // Set default dulu buat halaman pertama
  const featuredPost = isFirstPage && posts.length > 0 ? posts[0] : null;
  const recentPosts = isFirstPage && posts.length > 1 ? posts.slice(1) : posts;

  // DUMMY PAGE INFO (Biar komponen Pagination lu ga error)
  const pageInfo = { hasNextPage: false, hasPreviousPage: false, startCursor: null, endCursor: null };

  return (
    <PageWrapper>
      <main className={styles.main}>
        <div className="container">
          <h1 className={styles.pageTitle}>Berita & Kegiatan</h1>
          
          {/* ARTIKEL UTAMA (Paling Gede) */}
          {featuredPost && featuredPost.image && (
            <Link href={`/berita/${featuredPost.slug}`} className={styles.featuredPost} data-aos="fade-up">
              <div className={styles.featuredImageWrapper}>
                <Image 
                  src={featuredPost.image} // 👈 Jauh lebih simpel kan?
                  alt={featuredPost.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 80vw"
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>
              <div className={styles.featuredContent}>
                <span className={styles.featuredTag}>Berita Utama</span>
                <h2>{featuredPost.title}</h2>
                <p>{generateExcerpt(featuredPost.content)}</p>
              </div>
            </Link>
          )}

          {/* GRID ARTIKEL LAINNYA */}
          <div className={styles.recentGrid}>
            {recentPosts.map((post, index) => (
              post.image && (
                <div key={post.id} className={styles.postCard} data-aos="fade-up" data-aos-delay={index * 50}>
                  <Link href={`/berita/${post.slug}`} className={styles.cardImageWrapper}>
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </Link>
                  <div className={styles.cardContent}>
                    <span className={styles.cardCategory}>Berita</span>
                    <h3>
                      <Link href={`/berita/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className={styles.cardExcerpt}>{generateExcerpt(post.content)}</p>
                    <Link href={`/berita/${post.slug}`} className={styles.readMore}>
                      Selengkapnya &rarr;
                    </Link>
                  </div>
                </div>
              )
            ))}
          </div>
          
          <Suspense fallback={<PaginationLoading />}>
            <Pagination pageInfo={pageInfo} />
          </Suspense>

        </div>
      </main>
    </PageWrapper>
  );
}