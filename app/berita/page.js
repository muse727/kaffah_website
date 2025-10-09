// app/berita/page.js

import Image from 'next/image';
import Link from 'next/link';
import { fetchGraphQL } from '../../lib/wordpress';
import styles from '../../styles/BeritaIndex.module.css';
import Pagination from '../../components/Pagination';
import PageWrapper from '../../components/PageWrapper';

const cleanExcerpt = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '');
};

export default async function BeritaIndexPage({ searchParams }) {
  let allPosts = [];

  try {
    // Ambil semua post (atau batas wajar seperti 1000)
    // Query ini MENGGUNAKAN 'first', bukan 'limit', jadi PASTI BERHASIL.
    const query = `
      query GetAllPosts {
        posts(first: 1000, where: { orderby: { field: DATE, order: DESC } }) {
          nodes {
            id, title, slug, date
            excerpt(format: RENDERED)
            featuredImage { node { sourceUrl(size: LARGE) } }
          }
        }
      }
    `;
    const data = await fetchGraphQL(query);
    allPosts = data?.posts?.nodes || [];
  } catch (error) {
    console.error("Gagal memuat halaman berita:", error);
  }

  // --- LOGIKA PAGINATION DILAKUKAN DI SINI (BUKAN DI QUERY) ---
  const postsPerPage = 7; // 1 featured + 6 grid
  const currentPage = Number(searchParams?.page) || 1;
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  
  // Potong array allPosts sesuai halaman saat ini
  const offset = (currentPage - 1) * postsPerPage;
  const postsForCurrentPage = allPosts.slice(offset, offset + postsPerPage);

  const featuredPost = currentPage === 1 && postsForCurrentPage.length > 0 ? postsForCurrentPage[0] : null;
  const recentPosts = currentPage === 1 && postsForCurrentPage.length > 1 ? postsForCurrentPage.slice(1) : postsForCurrentPage;

  return (
    <PageWrapper>
    <main className={styles.main}>
      <div className="container">
        <h1 className={styles.pageTitle}>Berita & Kegiatan</h1>
        
        {/* Featured Post */}
        {featuredPost && (
          <Link href={`/berita/${featuredPost.slug}`} className={styles.featuredPost} data-aos="fade-up">
            <div className={styles.featuredImageWrapper}>
              <Image 
                src={featuredPost.featuredImage.node.sourceUrl}
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
              <p>{cleanExcerpt(featuredPost.excerpt)}</p>
            </div>
          </Link>
        )}

        {/* Recent Posts Grid */}
        <div className={styles.recentGrid}>
          {recentPosts.map((post, index) => (
            post.featuredImage?.node?.sourceUrl && (
              <div key={post.id} className={styles.postCard} data-aos="fade-up" data-aos-delay={index * 50}>
                <Link href={`/berita/${post.slug}`} className={styles.cardImageWrapper}>
                  <Image
                    src={post.featuredImage.node.sourceUrl}
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
                  <p className={styles.cardExcerpt}>{cleanExcerpt(post.excerpt)}</p>
                  <Link href={`/berita/${post.slug}`} className={styles.readMore}>
                    Selengkapnya &rarr;
                  </Link>
                </div>
              </div>
            )
          ))}
        </div>
        
        <Pagination totalPages={totalPages} />

      </div>
    </main>
    </PageWrapper>
  );
}