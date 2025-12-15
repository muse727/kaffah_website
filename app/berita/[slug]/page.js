import Image from 'next/image';
import Link from 'next/link';
// Import fetchREST dan fetchGraphQL
import { fetchREST, fetchGraphQL } from '../../../lib/wordpress';
import styles from '../../../styles/SinglePost.module.css';
import PageWrapper from '../../../components/PageWrapper';

export const dynamic = 'force-dynamic';

// Fungsi helper untuk ambil data via REST API
async function getPostData(slug) {
  try {
    // REST API endpoint untuk get post by slug
    // _embed=true penting untuk dapat gambar dan author
    const posts = await fetchREST(`/posts?slug=${slug}&_embed`);
    
    // REST API mengembalikan array, kita ambil item pertama
    if (posts && posts.length > 0) {
      return posts[0];
    }
    return null;
  } catch (error) {
    console.error("Gagal fetch REST:", error);
    return null;
  }
}

// Fungsi untuk sidebar (masih pakai GraphQL karena cuma butuh list)
async function getRecentPosts() {
  try {
    const query = `
      query GetRecentPosts {
        posts(first: 5, where: { orderby: { field: DATE, order: DESC } }) {
          nodes { 
            id, title, slug, 
            featuredImage { node { sourceUrl(size: THUMBNAIL) } } 
          }
        }
      }
    `;
    const data = await fetchGraphQL(query);
    return data?.posts?.nodes || [];
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params }) {
    // Await params dulu (Next.js 15 requirement)
    const { slug } = await params;
    const post = await getPostData(slug);
    
    if (post) {
      return { title: `${post.title.rendered} | Al Mubarak` };
    }
    return { title: 'Berita Tidak Ditemukan' };
}


export default async function SinglePostPage(props) {
  const params = await props.params;
  const { slug } = params;
  
  // Ambil data paralel
  const [post, recentPosts] = await Promise.all([
    getPostData(slug),
    getRecentPosts()
  ]);

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

  // Data dari REST API strukturnya beda dengan GraphQL
  // post.title.rendered, post.content.rendered, dll.
  
  const featuredImageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const authorName = post._embedded?.author?.[0]?.name || 'Tim Redaksi';

  return (
    <PageWrapper>
        <main className={styles.main}>
          <div className={`${styles.articleContainer} container`}>
            <article className={styles.articleContent}>
              <h1 className={styles.articleTitle} dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
              
              <div className={styles.metaInfo}>
                <span>Oleh: {authorName}</span>
                <span>
                  {new Date(post.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>

              {featuredImageUrl && (
                <div className={styles.featuredImageWrapper}>
                  <Image 
                    src={featuredImageUrl}
                    alt={post.title.rendered}
                    fill
                    sizes="80vw"
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                </div>
              )}
              
              <div 
                className={styles.articleBody}
                dangerouslySetInnerHTML={{ __html: post.content.rendered }}
              />
            </article>

            <aside className={styles.sidebar}>
              <h3>Berita Lainnya</h3>
              <div className={styles.sidebarPostList}>
                {recentPosts
                  .filter(p => p.slug !== slug)
                  .slice(0, 4)
                  .map(recent => (
                  recent.featuredImage?.node?.sourceUrl && (
                    <Link href={`/berita/${recent.slug}`} key={recent.id} className={styles.sidebarPostCard}>
                      <div className={styles.sidebarCardImage}>
                        <Image
                          src={recent.featuredImage.node.sourceUrl}
                          alt={recent.title}
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
                ))}
              </div>
            </aside>
          </div>
        </main>
    </PageWrapper>
  );
}