import UnitHero from '../../../components/UnitHero';
import AboutSection from '../../../components/AboutSection';
import VideoSection from '../../../components/VideoSection';
import VisiMisiSection from '../../../components/VisiMisiSection';
import ProgramUnggulan from '../../../components/ProgramUnggulan';
import GaleriSection from '../../../components/GaleriSection';
import styles from '../../../styles/GaleriSection.module.css';
import EkstrakurikulerSection from '../../../components/EkstrakurikulerSection';

// --- GANTI DATA DI BAWAH INI DENGAN KONTEN SMPIT ---

// 1. Data untuk Hero Section (Section 1)
const smpitHeroData = {
  schoolName: 'SMP IT AL MUBARAK',
  tagline: 'SHALIH TANGGUH BERDAYAGUNA', // Contoh tagline
  images: [
    { src: '/images/smpit-hero-1.jpg', alt: 'Kegiatan Belajar Siswa SMPIT' },
    { src: '/images/smpit-hero-2.jpg', alt: 'Prestasi Siswa SMPIT Al Mubarak' },
    { src: '/images/smpit-hero-3.jpg', alt: 'Ekstrakurikuler SMPIT Al Mubarak' },
  ],
  registerLink: '/pendaftaran',
};

// 2. Data untuk Tentang Kami (Section 2)
const smpitAboutData = {
  subtitle: 'SMPIT Al Mubarak',
  title: 'Tentang Kami',
  summaryText: `SMPIT Al Mubarak berkomitmen untuk melanjutkan pondasi pendidikan karakter dari jenjang dasar, dengan fokus pada pendalaman ilmu agama dan peningkatan kompetensi akademik untuk menghadapi tantangan zaman.`,
  fullText: `SMPIT Al Mubarak berkomitmen untuk melanjutkan pondasi pendidikan karakter dari jenjang dasar, dengan fokus pada pendalaman ilmu agama dan peningkatan kompetensi akademik untuk menghadapi tantangan zaman.

Kurikulum kami dirancang secara terpadu untuk menyeimbangkan antara keunggulan akademis, penguatan aqidah, dan pengembangan keterampilan hidup (life skills). Siswa didorong untuk berpikir kritis, kreatif, dan kolaboratif.

Dengan dukungan tenaga pendidik yang profesional dan lingkungan yang islami, kami bertujuan untuk mencetak lulusan yang tidak hanya siap melanjutkan ke jenjang pendidikan yang lebih tinggi, tetapi juga menjadi pribadi yang shalih, cerdas, dan bermanfaat bagi ummat.`,
  imageSrc: '/images/smpit-about.jpg',
  imageAlt: 'Siswa-siswi SMPIT Al Mubarak berdiskusi',
};

// 3. Data untuk Sambutan Kepala Sekolah (Section 3)
const smpitVideoData = {
  subtitle: 'SMPIT Al Mubarak',
  title: 'Sambutan Kepala Sekolah',
  principalImage: '/images/kepala-sekolah-smpit.png',
  vimeoUrl: 'https://player.vimeo.com/video/YOUR_VIMEO_ID_SMP', // <-- GANTI DENGAN ID VIDEO VIMEO SMP
};

const smpitVisiData = {
  title: 'VISI',
  text: 'Terwujudnya generasi Sholih, Tangguh dan Berdayaguna.',
  image: {
    src: '/images/siswi-smpit.png', // <-- Siapkan gambar siswi SMP
    alt: 'Siswi SMPIT Al Mubarak',
  },
};

const smpitMisiData = {
  title: 'MISI',
  items: [
    'Mengintegrasikan kurikulum nasional dan kurikulum agama dalam bingkai kurikulum SIT.',
    'Menciptakan lingkungan belajar yang aktif, kreatif, inovatif, efektif, dan menyenangkan.',
    'Menumbuh kembangkan siswa berkarakter sholih, Tangguh dan Berdayaguna melalui Pendidikan Pesantren City.',
    'Melakukan pembinaan keagamaan, pengembangan potensi dan bimbingan konseling.',
    'Menginternalisasikan nilai-nilai keislaman dalam proses dan program pembelajaran.',
  ],
  image: {
    src: '/images/siswa-smpit.png', // <-- Siapkan gambar siswa SMP
    alt: 'Siswa SMPIT Al Mubarak',
  },
};

// DATA UNTUK GALERI SMPIT
const smpitGalleryData = {
  subtitle: 'Galeri Kegiatan',
  title: 'Momen Seru di SMPIT Al Mubarak',
  description: 'Dokumentasi berbagai aktivitas akademik, ekstrakurikuler, dan prestasi siswa-siswi SMPIT.',
  images: [
    // Kamu bisa atur layout berbeda untuk SMPIT dengan mengubah nilai 'span'
    { src: '/images/galeri-smpit/foto-1smp.jpg', alt: 'Kegiatan OSIS', span: '' },
    { src: '/images/galeri-smpit/foto-2.jpg', alt: 'Lomba Cerdas Cermat', span: styles.span_2x1 },
    { src: '/images/galeri-smpit/foto-3.jpg', alt: 'Kegiatan Pramuka', span: styles.span_1x2 },
    { src: '/images/galeri-smpit/foto-4.jpg', alt: 'Juara Futsal', span: styles.span_2x2 },
    { src: '/images/galeri-smpit/foto-5.jpg', alt: 'Market Day', span: '' },
    { src: '/images/galeri-smpit/foto-6.jpg', alt: 'Studi Tur', span: '' },
  ],
};

const smpitEkskulData = [
  { name: 'Hadroh', icon: '/icons/ekskul/hadroh.png' },
  { name: 'Coding', icon: '/icons/ekskul/coding.png' },
  { name: 'Acapella', icon: '/icons/ekskul/acapella.png' },
  { name: 'Silat', icon: '/icons/ekskul/silat.png' },
  { name: 'Nasyid', icon: '/icons/ekskul/nasyid.png' },
  { name: 'English Club', icon: '/icons/ekskul/english.png' },
  { name: 'Pramuka', icon: '/icons/ekskul/pramuka.png' },
  { name: 'Futsal', icon: '/icons/ekskul/futsal.png' },
];

export default function SmpitPage() {
  return (
    <>
      {/* Section 1 */}
      <UnitHero
        schoolName={smpitHeroData.schoolName}
        tagline={smpitHeroData.tagline}
        images={smpitHeroData.images}
        registerLink={smpitHeroData.registerLink}
      />
      
      {/* Section 2 */}
      <AboutSection
        subtitle={smpitAboutData.subtitle}
        title={smpitAboutData.title}
        summaryText={smpitAboutData.summaryText}
        fullText={smpitAboutData.fullText}
        imageSrc={smpitAboutData.imageSrc}
        imageAlt={smpitAboutData.imageAlt}
      />

      {/* Section 3 */}
      <VideoSection
        subtitle={smpitVideoData.subtitle}
        title={smpitVideoData.title}
        principalImage={smpitVideoData.principalImage}
        vimeoUrl={smpitVideoData.vimeoUrl}
      />
      
      {/* Section 4 */}
      <VisiMisiSection visiData={smpitVisiData} misiData={smpitMisiData} />

      <ProgramUnggulan />
      <EkstrakurikulerSection 
        subtitle="SMPIT Al Mubarak"
        title="Pengembangan Diri & Prestasi"
        data={smpitEkskulData}
      />
      <GaleriSection {...smpitGalleryData} />

      {/* Di sini nanti kita bisa tambahkan section-section khusus SMPIT */}
    </>
  );
}