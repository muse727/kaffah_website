import Image from 'next/image';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import styles from '../../../styles/SinglePost.module.css';
import PageWrapper from '../../../components/PageWrapper';

export const dynamic = 'force-dynamic';
const prisma = new PrismaClient();

// Bikin Metadata buat SEO / Judul Tab Browser
export async function generateMetadata({ params }) {
    const { slug } = await params;
    const post = await prisma.berita.findUnique({ where: { slug } });
    
    if (post) {
      return { title: `${post.title} | Kaffah Islamic School` };
    }
    return { title: 'Berita Tidak Ditemukan' };
}

export default async function SinglePostPage(props) {
  const params = await props.params;
  const { slug } = params;
  
  // Ambil artikel yang lagi dibaca (Berdasarkan SLUG)
  const post = await prisma.berita.findUnique({ where: { slug } });
  
  // Ambil 4 artikel terbaru buat di Sidebar (Kecuali artikel yang lagi dibaca)
  const recentPosts = await prisma.berita.findMany({
    where: { status: 'PUBLISHED', NOT: { slug } },
    orderBy: { createdAt: 'desc' },
    take: 4 
  });

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
            
            {/* KONTEN ARTIKEL */}
            <article className={styles.articleContent}>
              <h1 className={styles.articleTitle}>{post.title}</h1>
              
              <div className={styles.metaInfo}>
                <span>Oleh: {post.author}</span>
                <span>
                  {new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>

              {post.image && (
                <div className={styles.featuredImageWrapper}>
                  <Image 
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="80vw"
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                </div>
              )}
              
              {/* Hasil dari Editor React Quill langsung ditampilin ke sini */}
              <div 
                className={styles.articleBody}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>

            {/* SIDEBAR BERITA LAINNYA */}
            <aside className={styles.sidebar}>
              <h3>Berita Lainnya</h3>
              <div className={styles.sidebarPostList}>
                {recentPosts.map(recent => (
                  recent.image && (
                    <Link href={`/berita/${recent.slug}`} key={recent.id} className={styles.sidebarPostCard}>
                      <div className={styles.sidebarCardImage}>
                        <Image
                          src={recent.image}
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