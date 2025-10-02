// app/page.js

// 1. Import semua komponen yang akan ditampilkan di halaman utama
import Hero from '../components/Hero';
import TentangKami from '../components/TentangKami';
import Keunggulan from '../components/Keunggulan';
import PendidikanSlider from '../components/PendidikanSlider';
import BeritaSection from '../components/BeritaSection';
import Testimonial from '../components/Testimonial';

// 2. Import SATU-SATUNYA fungsi getStrapiData dari file 'lib'
import { getStrapiData } from '../lib/strapi';

// TIDAK ADA LAGI FUNGSI getStrapiData DI SINI

export default async function Home() {
  // 3. Panggil fungsi untuk mengambil data berita
  const strapiPath = '/beritas?populate=gambar_utama&sort=createdAt:desc&pagination[limit]=9';
  const postsData = await getStrapiData(strapiPath);

  return (
    // 4. Susun semua komponen di dalam <main>
    // Navbar dan Footer tidak perlu ada di sini karena sudah ada di layout.js
    <main>
      <Hero />
      <TentangKami />
      <Keunggulan />
      <PendidikanSlider />
      <BeritaSection posts={postsData ? postsData.data : []} />
      <Testimonial />
    </main>
  );
}