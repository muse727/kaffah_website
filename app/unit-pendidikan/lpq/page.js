import UnitHero from '../../../components/UnitHero';
import AboutSection from '../../../components/AboutSection';
import VideoSection from '../../../components/VideoSection';
import VisiMisiSection from '../../../components/VisiMisiSection';
import EkstrakurikulerSection from '../../../components/EkstrakurikulerSection';
import GaleriSection from '../../../components/GaleriSection';
import styles from '../../../styles/GaleriSection.module.css'; // Untuk layout galeri

// --- SAYA SIAPKAN CONTOH KONTEN UNTUK LPQ ---
// (Nanti kamu ganti ini dengan konten asli)

// 1. Data Hero
const lpqHeroData = {
  schoolName: 'LPQ AL MUBARAK',
  tagline: 'MENCETAK GENERASI CINTA AL-QURAN',
  images: [
    { src: '/images/lpq-hero-1.jpg', alt: 'Santri LPQ Mengaji' },
    { src: '/images/lpq-hero-2.jpg', alt: 'Wisuda Tahfizh LPQ' },
  ],
  registerLink: '/pendaftaran',
};

// 2. Data "Tentang Kami"
const lpqAboutData = {
  subtitle: 'LPQ Al Mubarak',
  title: 'Tentang Lembaga',
  summaryText: 'Lembaga Pendidikan Al-Quran (LPQ) Al Mubarak adalah program yang difokuskan untuk memberantas buta huruf Al-Quran dan mencetak generasi yang fasih membaca, menghafal, dan mengamalkan Al-Quran.',
  fullText: `Lembaga Pendidikan Al-Quran (LPQ) Al Mubarak adalah program yang difokuskan untuk memberantas buta huruf Al-Quran dan mencetak generasi yang fasih membaca, menghafal, dan mengamalkan Al-Quran.
  
Kami menerima santri dari berbagai usia, mulai dari anak-anak hingga dewasa, dengan metode pengajaran yang mudah, cepat, dan menyenangkan.
  
Program kami meliputi Tahsin, Tahfizh, dan Tadabbur Al-Quran yang dibimbing langsung oleh asatidz dan asatidzah yang kompeten di bidangnya.`,
  imageSrc: '/images/lpq-about.jpg',
  imageAlt: 'Kegiatan Belajar Mengajar LPQ Al Mubarak',
};

// 3. Data Sambutan (bisa Kepala LPQ atau Ketua Yayasan)
const lpqVideoData = {
  subtitle: 'LPQ Al Mubarak',
  title: 'Sambutan Pimpinan',
  principalImage: '/images/pimpinan-lpq.png',
  vimeoUrl: 'https://player.vimeo.com/video/YOUR_VIMEO_ID_LPQ', // <-- GANTI DENGAN ID VIDEO VIMEO LPQ
};

// 4. Data Visi Misi (Kita pakai Visi Misi Yayasan yang sudah ada)
const lpqVisiData = {
  title: 'VISI YAYASAN',
  text: 'Menjadi pusat peradaban Islam yang unggul, melahirkan generasi pemimpin Rabbani yang berkontribusi positif bagi umat dan bangsa.',
  image: {
    src: '/images/siswi-sdit.png', // Pakai gambar yang sudah ada
    alt: 'Visi Yayasan',
  },
};

const lpqMisiData = {
  title: 'MISI YAYASAN',
  items: [
    'Menyelenggarakan pendidikan berkualitas yang mengintegrasikan ilmu, iman, dan akhlak.',
    'Mengembangkan program sosial dan dakwah yang memberdayakan masyarakat.',
    'Membangun kemitraan strategis untuk memperluas jangkauan manfaat yayasan.',
    'Mengelola aset wakaf secara profesional, amanah, dan produktif.',
  ],
  image: {
    src: '/images/siswa-sdit.png', // Pakai gambar yang sudah ada
    alt: 'Misi Yayasan',
  },
};

// 5. Data Kegiatan Pendukung (Ekskul)
const lpqEkskulData = [
  { name: 'Kaligrafi', icon: '/icons/ekskul/kaligrafi.svg' },
  { name: 'Hadrah', icon: '/icons/ekskul/hadrah.svg' },
  { name: 'Qiroah', icon: '/icons/ekskul/qiroah.svg' },
  // ... (tambahkan kegiatan lain jika ada)
];

// 6. Data Galeri
const lpqGalleryData = {
  subtitle: 'Galeri LPQ',
  title: 'Momen Kegiatan Santri',
  description: 'Dokumentasi kegiatan belajar dan wisuda tahfizh.',
  images: [
    { src: '/images/galeri-lpq/foto-1.jpg', alt: 'Wisuda Tahfizh', span: styles.span_2x2 },
    { src: '/images/galeri-lpq/foto-2.jpg', alt: 'Belajar Mengaji', span: '' },
    { src: '/images/galeri-lpq/foto-3.jpg', alt: 'Belajar Kaligrafi', span: '' },
  ],
};

export default function LpqPage() {
  return (
    <>
      <UnitHero {...lpqHeroData} />
      <AboutSection {...lpqAboutData} />
      <VideoSection {...lpqVideoData} />
      <VisiMisiSection visiData={lpqVisiData} misiData={lpqMisiData} />
      <EkstrakurikulerSection 
        subtitle="LPQ Al Mubarak"
        title="Kegiatan Pendukung"
        data={lpqEkskulData}
      />
      <GaleriSection {...lpqGalleryData} />
    </>
  );
}