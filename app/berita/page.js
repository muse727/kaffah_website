// app/berita/page.js

import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { fetchGraphQL } from '../../lib/wordpress';
import styles from '../../styles/BeritaIndex.module.css';
import Pagination from '../../components/Pagination';
import PageWrapper from '../../components/PageWrapper';

// PENTING: Paksa halaman jadi dinamis
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

export default async function BeritaIndexPage(props) {
  // PENTING: Di Next.js 15+, searchParams harus di-await
  const searchParams = await props.searchParams;
  
  let posts = [];
  let pageInfo = {};

  // Ambil cursor dari URL
  const { after, before } = searchParams;

  try {
    // Query cursor pagination
    const query = `
      query GetPaginatedPosts(
        $first: Int
        $last: Int
        $after: String
        $before: String
      ) {
        posts(
          first: $first
          last: $last
          after: $after
          before: $before
          where: { orderby: { field: DATE, order: DESC } }
        ) {
          nodes {
            id, title, slug, date
            databaseId 
            excerpt(format: RENDERED)
            featuredImage { node { sourceUrl(size: LARGE) } }
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
    
    const variables = {
      after: after || null,
      before: before || null,
      first: !before ? postsPerPage : null,
      last: before ? postsPerPage : null,
    };
    
    const data = await fetchGraphQL(query, variables);
    posts = data?.posts?.nodes || [];
    pageInfo = data?.posts?.pageInfo || {};

  } catch (error) {
    console.error("Gagal memuat halaman berita:", error);
  }
  
  const isFirstPage = !after && !before;
  const featuredPost = isFirstPage && posts.length > 0 ? posts[0] : null;
  const recentPosts = isFirstPage && posts.length > 1 ? posts.slice(1) : posts;

  return (
    <PageWrapper>
    <main className={styles.main}>
      <div className="container">
        <h1 className={styles.pageTitle}>Berita & Kegiatan</h1>
        
        {featuredPost && featuredPost.featuredImage?.node?.sourceUrl && (
          <Link href={`/berita/${featuredPost.slug}`} className={styles.featuredPost} data-aos="fade-up">
            <div className={styles.featuredImageWrapper}>
              <Image 
                src={featuredPost.featuredImage.node.sourceUrl}
                alt={featuredPost.title} fill sizes="(max-width: 768px) 100vw, 80vw"
                style={{ objectFit: 'cover' }} priority
              />
            </div>
            <div className={styles.featuredContent}>
              <span className={styles.featuredTag}>Berita Utama</span>
              <h2>{featuredPost.title}</h2>
              <p>{cleanExcerpt(featuredPost.excerpt)}</p>
            </div>
          </Link>
        )}

        <div className={styles.recentGrid}>
          {recentPosts.map((post, index) => (
            post.featuredImage?.node?.sourceUrl && (
              <div key={post.id} className={styles.postCard} data-aos="fade-up" data-aos-delay={index * 50}>
                <Link href={`/berita/${post.slug}`} className={styles.cardImageWrapper}>
                  <Image
                    src={post.featuredImage.node.sourceUrl}
                    alt={post.title} fill sizes="(max-width: 768px) 100vw, 33vw"
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
        
        <Suspense fallback={<PaginationLoading />}>
          <Pagination pageInfo={pageInfo} />
        </Suspense>
      </div>
    </main>
    </PageWrapper>
  );
}