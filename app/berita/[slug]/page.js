// app/berita/[slug]/page.js

import Image from 'next/image';
import Link from 'next/link';
import { fetchGraphQL } from '../../../lib/wordpress';
import styles from '../../../styles/SinglePost.module.css';
import PageWrapper from '../../../components/PageWrapper';

// Fungsi generateMetadata agar judul tab browser dinamis
export async function generateMetadata({ params }) {
    const { slug } = params;
    const query = `
      query GetPostTitleBySlug($id: ID!) {
        post(id: $id, idType: SLUG) {
          title
        }
      }
    `;
    try {
        const data = await fetchGraphQL(query, { id: slug });
        return {
            title: `${data?.post?.title || 'Berita'} | Al Mubarak`,
        };
    } catch (error) {
        return {
            title: 'Berita Tidak Ditemukan',
        };
    }
}

export default async function SinglePostPage({ params }) {
  const { slug } = params;
  let post = null;
  let recentPosts = [];

  try {
    const postQuery = `
      query GetPostBySlug($id: ID!) {
        post(id: $id, idType: SLUG) {
          title
          content(format: RENDERED)
          date
          author { node { name } }
          featuredImage { node { sourceUrl } }
        }
      }
    `;
    
    const recentPostsQuery = `
      query GetRecentPosts {
        posts(first: 5, where: { orderby: { field: DATE, order: DESC } }) {
          nodes {
            id
            title
            slug
            # --- TAMBAHKAN BLOK INI ---
            featuredImage {
              node {
                sourceUrl(size: THUMBNAIL) # Minta ukuran thumbnail, lebih cepat!
              }
            }
            # ---------------------------
          }
        }
      }
    `;
    
    // Jalankan kedua query secara paralel agar lebih cepat
    const [postData, recentData] = await Promise.all([
      fetchGraphQL(postQuery, { id: slug }),
      fetchGraphQL(recentPostsQuery)
    ]);

    post = postData?.post;
    recentPosts = recentData?.posts?.nodes || [];

  } catch (error) {
    console.error(`Gagal memuat post dengan slug: ${slug}`, error);
  }

  if (!post) {
    return (
         <PageWrapper> 
        <main className="container" style={{textAlign: 'center', padding: '4rem 0'}}>
            <h1>Artikel Tidak Ditemukan</h1>
            <p>Maaf, artikel yang Anda cari mungkin telah dihapus atau URL-nya salah.</p>
        </main>
        </PageWrapper>
    );
  }

  return (
     <PageWrapper> 
    <main className={styles.main}>
      <div className={`${styles.articleContainer} container`}>
        {/* Kolom Utama Artikel */}
        <article className={styles.articleContent}>
          <h1 className={styles.articleTitle}>{post.title}</h1>
          <div className={styles.metaInfo}>
            <span>Oleh: {post.author?.node?.name || 'Tim Redaksi'}</span>
            <span>
              {new Date(post.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          {post.featuredImage?.node?.sourceUrl && (
            <div className={styles.featuredImageWrapper}>
              <Image 
                src={post.featuredImage.node.sourceUrl}
                alt={post.title}
                fill
                sizes="80vw"
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
          )}
          {/* Render konten HTML dari WordPress */}
          <div 
            className={styles.articleBody}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* Sidebar */}
       <aside className={styles.sidebar}>
          <h3>Berita Lainnya</h3>
          <div className={styles.sidebarPostList}>
            {recentPosts
              .filter(p => p.slug !== slug) // Filter post yang sedang dibuka
              .slice(0, 4) // Ambil 4 berita lainnya
              .map(recent => (
                // Tambahkan pengecekan ini, jika post tidak ada gambar, jangan ditampilkan
                recent.featuredImage?.node?.sourceUrl && (
                  <Link href={`/berita/${recent.slug}`} key={recent.id} className={styles.sidebarPostCard}>
                    <div className={styles.sidebarCardImage}>
                      <Image
                        src={recent.featuredImage.node.sourceUrl}
                        alt={recent.title}
                        fill
                        sizes="100px" // Beri tahu browser ukuran gambar kira-kira 100px
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className={styles.sidebarCardContent}>
                      <h4>{recent.title}</h4>
                    </div>
                  </Link>
                )
              ))}
          </div>
        </aside>
      </div>
    </main>
    </PageWrapper>
  );
}