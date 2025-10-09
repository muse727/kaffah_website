import Hero from '../components/Hero';
import TentangKami from '../components/TentangKami';
import Keunggulan from '../components/Keunggulan';
import PendidikanSlider from '../components/PendidikanSlider';
import BeritaSection from '../components/BeritaSection';
import Testimonial from '../components/Testimonial';
import { fetchGraphQL } from '../lib/wordpress'; // <-- INI BENAR

export default async function Home() {
  // Definisikan 'posts' dengan array kosong sebagai nilai default
  let posts = [];

  try {
    const query = `
      query GetLatestPosts {
        posts(first: 9, where: { orderby: { field: DATE, order: DESC } }) {
          nodes {
            id
            slug
            title
            excerpt(format: RENDERED)
            featuredImage {
              node {
                sourceUrl(size: LARGE)
              }
            }
          }
        }
      }
    `;

    const data = await fetchGraphQL(query);
    
    // Gunakan optional chaining (?.) untuk menghindari error jika 'data' atau 'posts' tidak ada.
    // Jika hasilnya null/undefined, fallback ke array kosong [].
    posts = data?.posts?.nodes || [];

  } catch (error) {
    // Jika terjadi error saat fetching (misal: WordPress down),
    // log error di terminal dan 'posts' akan tetap menjadi array kosong.
    console.error("Gagal memuat data berita untuk Homepage:", error);
  }

  return (
    <main>
      <Hero />
      <TentangKami />
      <Keunggulan />
      <PendidikanSlider />
      {/* Komponen BeritaSection tetap aman karena 'posts' dijamin selalu array */}
      <BeritaSection posts={posts} />
      <Testimonial />
    </main>
  );
}