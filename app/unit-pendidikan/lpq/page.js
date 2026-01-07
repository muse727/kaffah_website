import UnitHero from '../../../components/UnitHero';
import AboutSection from '../../../components/AboutSection';
import VideoSection from '../../../components/VideoSection';
import VisiMisiSection from '../../../components/VisiMisiSection';
import TujuanSection from '../../../components/TujuanSection'; // <-- Import Baru
import EkstrakurikulerSection from '../../../components/EkstrakurikulerSection';
import GaleriSection from '../../../components/GaleriSection';
import styles from '../../../styles/GaleriSection.module.css';

// --- DATA KONTEN LPQ ---

// 1. Hero
const lpqHeroData = {
  schoolName: 'LPQ AL MUBARAK',
  tagline: 'MEMBENTUK GENERASI QUR\'ANI',
  images: [
    { src: '/images/lpq-hero-1.jpg', alt: 'Santri LPQ Mengaji' },
    { src: '/images/lpq-hero-2.jpg', alt: 'Suasana Belajar LPQ' },
  ],
  registerLink: '/pendaftaran',
};

// 2. Tentang Kami (Sejarah & Profil)
const lpqAboutData = {
  subtitle: 'Profil Lembaga',
  title: 'Sejarah & Transformasi',
  summaryText: 'LPQ Al Mubarak adalah wajah baru dari TPA Al Mubarak yang kini hadir kembali dengan semangat revitalisasi untuk memberantas buta huruf Al-Quran bagi segala usia.',
  fullText: `LPQ Al Mubarak berlokasi strategis di Jl. Pramuka Sari III No.24, Rawasari, Jakarta Pusat. Lembaga ini merupakan transformasi dari TPA Al Mubarak yang telah berdiri sejak tahun 2000-an.

Setelah sempat vakum saat pandemi Covid-19, kami bangkit kembali dengan nama baru: Lembaga Pendidikan Qur'an (LPQ) Al Mubarak, yang diresmikan pada Senin, 29 Juli 2024.

Berbeda dengan sebelumnya, kini kami membuka kesempatan belajar Al-Quran untuk semua jenjang umur, dengan target pembukaan kelas dari pagi hingga malam hari, demi memfasilitasi kebutuhan umat akan ilmu Al-Quran.`,
  imageSrc: '/images/lpq-about.jpg',
  imageAlt: 'Kegiatan Belajar Mengajar LPQ Al Mubarak',
};

// 3. Tujuan (Section Baru)
const lpqTujuanData = {
  title: 'TUJUAN KAMI',
  items: [
    'Menguatkan keimanan dan ketaqwaan kepada Allah SWT dengan pemahaman yang benar.',
    'Memberikan pengetahuan teori dan praktek yang benar tentang tata-cara beribadah.',
    'Menanamkan dan membiasakan perilaku/akhlak yang sesuai dengan tuntunan Islam.',
    'Mendidik dan melatih membaca Al-Qur’an dengan baik sesuai kaidah ilmu tajwid.',
  ]
};

// 4. Sambutan
const lpqVideoData = {
  subtitle: 'LPQ Al Mubarak',
  title: 'Sambutan Pimpinan',
  principalImage: '/images/pimpinan-lpq.png',
  vimeoUrl: 'https://player.vimeo.com/video/YOUR_VIMEO_ID_LPQ',
};

// 5. Visi Misi
const lpqVisiData = {
  title: 'VISI LEMBAGA',
  text: '"Membentuk Generasi Qur\'ani yang pandai dalam membaca, menulis, menghafal, memahami dan mengamalkan Al-Qur\'an."',
  image: {
    src: '/images/siswi-sdit.png',
    alt: 'Visi LPQ',
  },
};

const lpqMisiData = {
  title: 'MISI LEMBAGA',
  items: [
    'Menanamkan rasa cinta kepada Allah SWT, Rasulullah SAW dan Al-Qur\'an.',
    'Menanamkan dasar-dasar aqidah Islamiyyah yang benar.',
    'Menanamkan dasar-dasar akhlak mulia kepada para santri.',
    'Menjadikan santri pandai membaca Al-Qur\'an dengan baik dan benar.',
    'Menjadikan santri pandai menulis Al-Qur\'an dengan rapi dan benar.',
    'Membimbing santri menghafal Al-Qur\'an (Target 30 Juz).',
    'Mengajarkan pemahaman isi kandungan Al-Qur\'an.',
    'Mendorong pengamalan nilai-nilai Al-Qur\'an dalam kehidupan sehari-hari.',
  ],
  image: {
    src: '/images/siswa-sdit.png',
    alt: 'Misi LPQ',
  },
};

// 6. Ekskul
const lpqEkskulData = [
  { name: 'Tahsin', icon: '/icons/ekskul/kaligrafi.svg' },
  { name: 'Tahfizh', icon: '/icons/ekskul/qiroah.svg' },
  { name: 'Tilawah', icon: '/icons/ekskul/hadrah.svg' },
];

// 7. Galeri
const lpqGalleryData = {
  subtitle: 'Galeri LPQ',
  title: 'Momen Kegiatan Santri',
  description: 'Dokumentasi kegiatan belajar mengajar dan kebersamaan di LPQ Al Mubarak.',
  images: [
    { src: '/images/galeri-lpq/foto-1.jpg', alt: 'Suasana Kelas', span: styles.span_2x2 },
    { src: '/images/galeri-lpq/foto-2.jpg', alt: 'Setoran Hafalan', span: '' },
    { src: '/images/galeri-lpq/foto-3.jpg', alt: 'Kegiatan Bersama', span: '' },
  ],
};

export default function LpqPage() {
  return (
    <>
      <UnitHero {...lpqHeroData} />
      <AboutSection {...lpqAboutData} />
      {/* Masukkan Section Tujuan Di Sini */}
      <TujuanSection title={lpqTujuanData.title} items={lpqTujuanData.items} />
      <VideoSection {...lpqVideoData} />
      <VisiMisiSection visiData={lpqVisiData} misiData={lpqMisiData} />
      <EkstrakurikulerSection 
        subtitle="Program & Kegiatan"
        title="Fokus Pembelajaran"
        data={lpqEkskulData}
      />
      <GaleriSection {...lpqGalleryData} />
    </>
  );
}