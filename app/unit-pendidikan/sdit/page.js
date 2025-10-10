import UnitHero from '../../../components/UnitHero';
import AboutSection from '../../../components/AboutSection';
import VideoSection from '../../../components/VideoSection';
import VisiMisiSection from '../../../components/VisiMisiSection';
import NilaiUnggulSection from '../../../components/NilaiUnggulSection';
import StackingPrograms from '../../../components/StackingPrograms';
import GaleriSection from '../../../components/GaleriSection';
import styles from '../../../styles/GaleriSection.module.css';
import EkstrakurikulerSection from '../../../components/EkstrakurikulerSection';


const sditData = {
  schoolName: 'SD IT AL MUBARAK',
  tagline: 'BERTAQWA MANDIRI CERDAS KREATIF',
  images: [
    { src: '/images/sdit-hero-1.jpg', alt: 'Kegiatan Wisuda SDIT Al Mubarak' },
    { src: '/images/sdit-hero-2.jpg', alt: 'Kegiatan Belajar Mengajar SDIT Al Mubarak' },
    { src: '/images/sdit-hero-3.jpg', alt: 'Kegiatan Olahraga SDIT Al Mubarak' },
    { src: '/images/sdit-hero-4.jpg', alt: 'Kegiatan Seni SDIT Al Mubarak' },
  ],
  registerLink: '/pendaftaran', // Arahkan ke halaman pendaftaran
};

// Data untuk About Section
const sditAboutData = {
  subtitle: 'SDIT Al Mubarak',
  title: 'Tentang Kami',
  summaryText: `SDIT AL Mubarak merupakan sekolah Islam yang memiliki paradigma bahwa semua siswa cerdas, pembelajaran berbasis Fun and Active Learning sebagai pijakan dalam menjalankan proses Kegiatan Belajar Mengajar, hal ini menjadi “RUH” bagi para guru dalam mendidik para siswa/i.`,
  fullText: `SDIT AL Mubarak merupakan sekolah Islam yang memiliki paradigma bahwa semua siswa cerdas,  pembelajaran berbasis Fun and Active Learning sebagai pijakan dalam menjalankan proses Kegiatan Belajar Mengajar, hal ini menjadi “RUH” bagi para guru dalam mendidik para siswa/i.

Berdiri sejak 2003 sampai dengan sekarang, telah ter-akreditasi oleh BAN SM (Badan Akreditasi Nasional Sekolah/Madrasah) dengan predikat Akreditasi A (Amat Baik).

SDIT Al Mubarak terus melakukan digitalisasi sekolah guna meningkatkan mutu pembelajaran sekolah.Pendidikan  Karakter menjadi pondasi mewujudkan peserta didik yang beradab, cerdas dan berprestasi. Pengembangan minta dan bakat terus didorong agar kemampuan yang dimiliki dapat terasa dengan baik sehingga memiliki kemampuan yang terampil.

Melibatkan seluruh stakeholder dalam meningkatkan mutu pendidikan dalam bentuk kolaborasi, monitoring dan evaluasi menjadi kegiatan rutin dilaksanakan, agar visi misi sekolah dapat terwujud dengan nilai-nilai unggul di dalamnya.`,
  imageSrc: '/images/sdit-about.jpg', // <-- Ganti dengan path gambar kamu
  imageAlt: 'Siswa-siswi SDIT Al Mubarak',
};

// Data untuk Video Section
const sditVideoData = {
  subtitle: 'SDIT Al Mubarak',
  title: 'Sambutan Kepala Sekolah',
  principalImage: '/images/kepala-sekolah.png', // <-- Siapkan foto kepala sekolah
  vimeoUrl: 'https://player.vimeo.com/video/1125395017', // <-- GANTI DENGAN ID VIDEO VIMEO
};

// BUAT DATA VISI & MISI KHUSUS UNTUK SDIT DI SINI
const sditVisiData = {
  title: 'VISI',
  text: '“Menjadi Lembaga Pendidikan Islam yang Unggul Sehingga Mewujudkan Peserta Didik yang Bertaqwa, Mandiri, Cerdas, Kreatif dan Kompetitif”',
  image: {
    src: '/images/siswi-sdit.png',
    alt: 'Siswi SDIT Al Mubarak',
  },
};

const sditMisiData = {
  title: 'MISI',
  items: [
    'Meningkatkan tuntunan rohani dan agama dalam bingkai SIT.',
    'Meningkatkan kemampuan, keaktifan dan kekreatifan SDM.',
    'Menciptakan pelajaran yang kreatif, inovatif, kooperatif dan menyenangkan.',
    'Melaksanakan pengembangan kompetisi siswa yang terukur melalui kegiatan intrakurikuler dan ekstrakurikuler.',
    'Mewujudkan sarana dan prasarana sekolah yang ideal dan futuristik.',
    'Menciptakan lingkungan sekolah sebagai tempat pengembangan wawasan sosial, wawasan kebangsaan, dan pengembangan budaya islami.',
  ],
  image: {
    src: '/images/siswa-sdit.png',
    alt: 'Siswa SDIT Al Mubarak',
  },
};

// DATA UNTUK GALERI SDIT
const sditGalleryData = {
  subtitle: 'Galeri Kegiatan',
  title: 'Momen Berharga di SDIT Al Mubarak',
  description: 'Lihat lebih dekat keceriaan dan proses belajar siswa-siswi kami.',
  images: [
    { src: '/images/galeri/foto-1.jpg', alt: 'Kegiatan 1', span: styles.span_2x2 },
    { src: '/images/galeri/foto-2.jpg', alt: 'Kegiatan 2', span: '' },
    { src: '/images/galeri/foto-3.jpg', alt: 'Kegiatan 3', span: '' },
    { src: '/images/galeri/foto-4.jpg', alt: 'Kegiatan 4', span: styles.span_1x2 },
    { src: '/images/galeri/foto-5.jpg', alt: 'Kegiatan 5', span: '' },
    { src: '/images/galeri/foto-6.jpg', alt: 'Kegiatan 6', span: styles.span_2x1 },
    { src: '/images/galeri/foto-7.jpg', alt: 'Kegiatan 7', span: '' },
  ],
};

const sditEkskulData = [
  { name: 'Silat', icon: '/icons/ekskul/silat.png' },
  { name: 'Panahan', icon: '/icons/ekskul/panahan.png' },
  { name: 'Karate', icon: '/icons/ekskul/karate.png' },
  { name: 'Coding', icon: '/icons/ekskul/coding.png' },
  { name: 'Marawis', icon: '/icons/ekskul/marawis.png' },
  { name: 'Sains Club', icon: '/icons/ekskul/sains.png' },
  { name: 'Futsal', icon: '/icons/ekskul/futsal.png' },
  { name: 'Tahsin', icon: '/icons/ekskul/tahsin.png' },
  { name: 'Tahfizh', icon: '/icons/ekskul/tahfizh.png' },
  { name: 'Mujawwad', icon: '/icons/ekskul/mujawwad.png' },
];

export default function SditPage() {
  return (
    <>
      <UnitHero
        schoolName={sditData.schoolName}
        tagline={sditData.tagline}
        images={sditData.images}
        registerLink={sditData.registerLink}
      />
      <AboutSection
        subtitle={sditAboutData.subtitle}
        title={sditAboutData.title}
        summaryText={sditAboutData.summaryText}
        fullText={sditAboutData.fullText}
        imageSrc={sditAboutData.imageSrc}
        imageAlt={sditAboutData.imageAlt}
      />
      <VideoSection
        subtitle={sditVideoData.subtitle}
        title={sditVideoData.title}
        principalImage={sditVideoData.principalImage}
        vimeoUrl={sditVideoData.vimeoUrl}
      />
      
      <VisiMisiSection visiData={sditVisiData} misiData={sditMisiData} />
      <NilaiUnggulSection />
      <StackingPrograms />
      <EkstrakurikulerSection 
        subtitle="SDIT Al Mubarak"
        title="Ekstrakurikuler Unggulan"
        data={sditEkskulData}
      />
      <GaleriSection {...sditGalleryData} />
    </>
  );
}