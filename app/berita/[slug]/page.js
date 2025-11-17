// app/berita/[slug]/page.js
import Image from 'next/image';
import Link from 'next/link';
import { fetchGraphQL } from '../../../lib/wordpress';
import styles from '../../../styles/SinglePost.module.css';
import PageWrapper from '../../../components/PageWrapper';

export const dynamic = 'force-dynamic';

// Fungsi utama untuk mengambil data post
async function getPostData(slug) {
  try {
    console.log('🔍 Mencari post dengan slug:', slug);
    
    const query = `
      query GetPostBySlug($slug: String!) {
        posts(where: {name: $slug}) {
          nodes {
            id
            title
            slug
            date
            content(format: RENDERED)
            excerpt(format: RENDERED)
            featuredImage {
              node {
                sourceUrl(size: LARGE)
                altText
              }
            }
            author {
              node {
                name
              }
            }
          }
        }
      }
    `;
    
    const variables = { slug };
    console.log('📤 Mengirim variables:', variables);
    
    const data = await fetchGraphQL(query, variables);
    
    const post = data?.posts?.nodes?.[0];
    
    console.log('📊 Hasil query:', {
      slug,
      foundPosts: data?.posts?.nodes?.length || 0,
      postExists: !!post,
      postTitle: post?.title
    });

    return post;

  } catch (error) {
    console.error('❌ Error fetch post:', error.message);
    return null;
  }
}

// Fungsi untuk mengambil post terbaru
async function getRecentPosts() {
  try {
    const recentPostsQuery = `
      query GetRecentPosts {
        posts(first: 5, where: { orderby: { field: DATE, order: DESC } }) {
          nodes { 
            id
            title
            slug
            databaseId
            featuredImage { 
              node { 
                sourceUrl(size: THUMBNAIL) 
                altText
              } 
            } 
          }
        }
      }
    `;
    const data = await fetchGraphQL(recentPostsQuery);
    return data?.posts?.nodes || [];
  } catch (error) {
    console.error("Gagal fetch recent posts:", error);
    return [];
  }
}

// PERBAIKAN: generateMetadata yang sederhana dan efektif
export async function generateMetadata({ params }) {
  try {
    const { slug } = params;
    
    // Decode slug untuk judul yang lebih readable
    const decodedSlug = decodeURIComponent(slug)
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return {
      title: `${decodedSlug} | Berita Al Mubarak`,
      description: `Baca artikel tentang ${decodedSlug} di Al Mubarak. Informasi terbaru dan terkini seputar kegiatan dan berita.`,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Berita | Al Mubarak',
      description: 'Artikel berita terbaru dari Al Mubarak',
    };
  }
}

const cleanExcerpt = (html) => {
  if (!html) return '';
  const text = html.replace(/<[^>]+>/g, '');
  return text.length > 160 ? text.substring(0, 160) + '...' : text;
};

// PERBAIKAN: generateStaticParams dengan error handling
export async function generateStaticParams() {
  try {
    console.log('🔄 Generating static params...');
    
    const query = `
      query GetAllPostSlugs {
        posts(first: 50, where: { orderby: { field: DATE, order: DESC } }) {
          nodes {
            slug
          }
        }
      }
    `;
    
    const data = await fetchGraphQL(query);
    const posts = data?.posts?.nodes || [];
    
    console.log(`📝 Found ${posts.length} posts for static generation`);
    
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function SinglePostPage({ params }) {
  const { slug } = await params;
  
  console.log('🚀 Loading page with slug:', slug);

  let post = await getPostData(slug);

  // Jika tidak ketemu dengan slug, coba approach lain
  if (!post) {
    console.log('❌ Post not found by slug, trying alternative approaches...');
    
    // Approach 2: Coba dengan decode URI slug
    const decodedSlug = decodeURIComponent(slug);
    if (decodedSlug !== slug) {
      console.log('🔄 Trying with decoded slug:', decodedSlug);
      post = await getPostData(decodedSlug);
    }
  }

  const recentPosts = await getRecentPosts();

  if (!post) {
    console.log('💥 Post still not found after all attempts');
    return (
      <PageWrapper>
        <main className="container" style={{textAlign: 'center', padding: '4rem 0'}}>
          <h1>Artikel Tidak Ditemukan</h1>
          <p>Maaf, artikel "{slug}" tidak dapat ditemukan.</p>
          <div style={{marginTop: '2rem'}}>
            <Link href="/berita" style={{
              color: '#0070f3', 
              textDecoration: 'none',
              padding: '10px 20px',
              border: '1px solid #0070f3',
              borderRadius: '5px'
            }}>
              ← Kembali ke Berita
            </Link>
          </div>
        </main>
      </PageWrapper>
    );
  }

  // PERBAIKAN: Hapus tag <head> dan biarkan generateMetadata menangani metadata
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
                {new Date(post.date).toLocaleDateString('id-ID', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </span>
            </div>

            {post.featuredImage?.node?.sourceUrl && (
              <div className={styles.featuredImageWrapper}>
                <Image 
                  src={post.featuredImage.node.sourceUrl}
                  alt={post.featuredImage.node.altText || post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 80vw"
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>
            )}

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
                .filter(recent => recent.slug !== slug)
                .slice(0, 4)
                .map(recent => (
                  recent.featuredImage?.node?.sourceUrl && (
                    <Link href={`/berita/${recent.slug}`} key={recent.id} className={styles.sidebarPostCard}>
                      <div className={styles.sidebarCardImage}>
                        <Image
                          src={recent.featuredImage.node.sourceUrl}
                          alt={recent.featuredImage.node.altText || recent.title}
                          fill
                          sizes="100px"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className={styles.sidebarCardContent}>
                        <h4>{recent.title}</h4>
                      </div>
                    </Link>
                  )
                ))
              }
            </div>
          </aside>
        </div>
      </main>
    </PageWrapper>
  );
}