// app/berita/page.js
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { fetchGraphQL } from '../../lib/wordpress';
import styles from '../../styles/BeritaIndex.module.css';
import Pagination from '../../components/Pagination';
import PageWrapper from '../../components/PageWrapper';

export const dynamic = 'force-dynamic';

const cleanExcerpt = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '');
};

const PaginationLoading = () => (
  <div style={{ height: '60px', textAlign: 'center', paddingTop: '20px' }}>
    <p>Memuat navigasi halaman...</p>
  </div>
);

const postsPerPage = 6;

export default async function BeritaIndexPage({ searchParams }) {
  let posts = [];
  let pageInfo = {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: null,
  };

  // PERBAIKAN: Pastikan searchParams di-await dengan benar
  const params = await searchParams;
  const { after, before } = params;

  console.log('🔍 SearchParams:', { after, before });

  try {
    // PERBAIKAN: Query yang lebih sederhana dan reliable
    const query = `
      query GetPaginatedPosts($first: Int, $after: String, $before: String, $last: Int) {
        posts(
          first: $first,
          after: $after,
          before: $before,
          last: $last
          where: { orderby: { field: DATE, order: DESC } }
        ) {
          nodes {
            id
            title
            slug
            date
            excerpt(format: RENDERED)
            featuredImage {
              node {
                sourceUrl(size: LARGE)
                altText
              }
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
        }
      }
    `;
    
    // PERBAIKAN: Variables logic yang lebih jelas
    const variables = {};
    
    if (before) {
      variables.last = postsPerPage;
      variables.before = before;
    } else {
      variables.first = postsPerPage;
      if (after) {
        variables.after = after;
      }
    }
    
    console.log('📤 GraphQL Variables:', variables);
    
    const data = await fetchGraphQL(query, variables);
    posts = data?.posts?.nodes || [];
    pageInfo = data?.posts?.pageInfo || {};

    console.log('📊 Hasil Query:', {
      totalPosts: posts.length,
      pageInfo: pageInfo
    });

  } catch (error) {
    console.error("❌ Gagal memuat halaman berita:", error);
  }
  
  // PERBAIKAN: Logic featured post yang lebih robust
  const isFirstPage = !after && !before;
  const featuredPost = isFirstPage && posts.length > 0 ? posts[0] : null;
  const recentPosts = isFirstPage && posts.length > 1 ? posts.slice(1) : posts;

  // PERBAIKAN: Handle case ketika tidak ada posts
  if (posts.length === 0) {
    return (
      <PageWrapper>
        <main className={styles.main}>
          <div className="container">
            <h1 className={styles.pageTitle}>Berita & Kegiatan</h1>
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p>Tidak ada berita yang ditemukan.</p>
              <Link href="/berita" className={styles.readMore}>
                Kembali ke halaman pertama
              </Link>
            </div>
          </div>
        </main>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <main className={styles.main}>
        <div className="container">
          <h1 className={styles.pageTitle}>Berita & Kegiatan</h1>
          
          {/* PERBAIKAN: Featured post dengan kondisi yang lebih jelas */}
          {featuredPost && (
            <Link href={`/berita/${featuredPost.slug}`} className={styles.featuredPost} data-aos="fade-up">
              {featuredPost.featuredImage?.node?.sourceUrl && (
                <div className={styles.featuredImageWrapper}>
                  <Image 
                    src={featuredPost.featuredImage.node.sourceUrl}
                    alt={featuredPost.featuredImage.node.altText || featuredPost.title}
                    fill 
                    sizes="(max-width: 768px) 100vw, 80vw"
                    style={{ objectFit: 'cover' }} 
                    priority
                  />
                </div>
              )}
              <div className={styles.featuredContent}>
                <span className={styles.featuredTag}>Berita Utama</span>
                <h2>{featuredPost.title}</h2>
                <p>{cleanExcerpt(featuredPost.excerpt)}</p>
              </div>
            </Link>
          )}

          {/* PERBAIKAN: Grid posts */}
          <div className={styles.recentGrid}>
            {recentPosts.map((post, index) => (
              <div key={post.id} className={styles.postCard} data-aos="fade-up" data-aos-delay={index * 50}>
                {post.featuredImage?.node?.sourceUrl && (
                  <Link href={`/berita/${post.slug}`} className={styles.cardImageWrapper}>
                    <Image
                      src={post.featuredImage.node.sourceUrl}
                      alt={post.featuredImage.node.altText || post.title}
                      fill 
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </Link>
                )}
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
            ))}
          </div>
          
          {/* PERBAIKAN: Pagination dengan loading state */}
          <Suspense fallback={<PaginationLoading />}>
            <Pagination pageInfo={pageInfo} />
          </Suspense>
        </div>
      </main>
    </PageWrapper>
  );
}