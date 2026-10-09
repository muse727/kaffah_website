import UnitHero from '../../../components/UnitHero';
import AboutSection from '../../../components/AboutSection';
import VisiMisiSection from '../../../components/VisiMisiSection';
import NilaiUnggulSection from '../../../components/NilaiUnggulSection';
import StackingPrograms from '../../../components/StackingPrograms';
import GaleriSection from '../../../components/GaleriSection';
import EkstrakurikulerSection from '../../../components/EkstrakurikulerSection';
import SambutanKepsek from '../../../components/SambutanKepsek'; // Komponen Baru!
import styles from '../../../styles/GaleriSection.module.css';

// DATA HERO
const sditData = {
  schoolName: 'KAFFAH ISLAMIC SCHOOL 1',
  tagline: 'SEKOLAH QURANI - GENERASI RABBANI',
  images: [
    { src: '/images/sdit-hero-1.jpg', alt: 'Kegiatan Wisuda SDIT Kaffah' },
    { src: '/images/sdit-hero-2.jpg', alt: 'Kegiatan Belajar Mengajar SDIT Kaffah' },
    { src: '/images/sdit-hero-3.jpg', alt: 'Kegiatan Olahraga SDIT Kaffah' },
    { src: '/images/sdit-hero-4.jpg', alt: 'Kegiatan Seni SDIT Kaffah' },
  ],
  registerLink: '/pendaftaran',
};

// DATA ABOUT
const sditAboutData = {
  subtitle: 'Kaffah Islamic School 1',
  title: 'Tentang Kami',
  summaryText: `SDIT Kaffah Islamic School merupakan salah satu sekolah dasar Islam terpadu yang berdiri di atas tanah wakaf KH. Fathullah Harun. Didirikan pada tahun 2016 sebagai wujud kepedulian terhadap pentingnya pendidikan Islam yang berkualitas, menjawab tantangan zaman sekaligus menjaga nilai-nilai keislaman.`,
  fullText: `SDIT Kaffah Islamic School merupakan salah satu sekolah dasar Islam terpadu yang berdiri di atas tanah wakaf KH. Fathullah Harun. Sekolah ini didirikan pada tahun 2016 sebagai wujud kepedulian terhadap pentingnya pendidikan Islam yang berkualitas, yang mampu menjawab tantangan zaman sekaligus menjaga nilai-nilai keislaman.\n\nNama sekolah dilekatkan pada sosok ulama besar Betawi, KH. Fathullah Harun bin H. Harun bin H. Murtadho, seorang tokoh ulama kharismatik yang telah berkiprah luas dalam dakwah Islam, tidak hanya di Jakarta tetapi juga hingga ke negeri jiran, Malaysia. Dengan semangat perjuangan dan keteladanan beliau, SDIT Kaffah Islamic School hadir untuk mewujudkan generasi Qurani yang Rabbani, berakhlak mulia, cerdas, mandiri, serta siap menghadapi tantangan global.\n\nDalam pelaksanaannya, sekolah ini menekankan keterpaduan antara ilmu pengetahuan umum, nilai-nilai agama Islam, serta pengembangan keterampilan peserta didik. Branding yang diusung adalah “Sekolah Qurani – Generasi Rabbani”, yang bermakna bahwa seluruh aktivitas pembelajaran, kegiatan kokurikuler, maupun ekstrakurikuler diintegrasikan dengan nilai-nilai Al-Qur’an, sehingga peserta didik tidak hanya unggul secara akademik, tetapi juga memiliki kepribadian Islami yang kuat.`,
  imageSrc: '/images/sdit-about.jpg',
  imageAlt: 'Siswa-siswi Kaffah 1',
};

// DATA SAMBUTAN KEPSEK
const sditSambutanData = {
  namaKepsek: 'Muslih Heriyanto, S.Pd., M.M.',
  fotoKepsek: '/images/kepala-sekolah.png',
  paragraf: [
    "Bismillahirrahmanirrahiim. Assalamu’alaikum wr.wb.",
    "Welcome to SDIT Kaffah Islamic School, Alhamdulillahirobil ‘aalamiin. Puji syukur atas ni’mat yang Allah SWT berikan kepada kita semua. Kami sangat berterima kasih kepada Bapak dan Ibu sekalian telah mempercayai kami menjadi partner dalam membimbing dan mendidik anak-anaknya. Kami berusaha untuk menjalankan amanah ini dengan baik agar pertanggungjawaban di hadapan Allah SWT kelak menjadi ringan.",
    "Memasuki era 4.0 ini yang penuh dengan kompetisi, kita perlu menyiapkan mental anak-anak kita agar mampu bersaing dengan baik yang memiliki moral/adab islami, kemandirian, kecerdasan, dan juga kreatifitas-inovasi sesuai tumbuh kembangnya.",
    "Setiap siswa SDIT Kaffah Islamic School memiliki hak untuk berprestasi dan mendapatkan perhatian yang baik. Sehingga kerjasama antara sekolah dengan para orang tua siswa dalam menjalankan program sekolah sangat penting.",
    "Sekali lagi kami ucapkan selamat datang di SDIT Kaffah Islamic School. Marilah bekerjasama agar anak-anak kita dapat berkembang dengan baik sehingga menjadi insan yang berakhlakul karimah, penghafal qur’an, bertaqwa dan cerdas."
  ]
};

// DATA VISI MISI
const sditVisiData = {
  title: 'VISI KAFFAH',
  text: '“Menjadikan sekolah qurani dalam mencetak generasi rabbani menuju peradaban bangsa yang Islami”',
  image: { src: '/images/siswi-sdit.png', alt: 'Siswi Kaffah' },
};

const sditMisiData = {
  title: 'MISI KAFFAH',
  items: [
    'Memadukan (integrated) pendidikan umum dan pendidikan agama menjadi satu jalinan kurikulum.',
    'Menciptakan lingkungan belajar yang harmonis dan proses pembelajaran yang aktif, kreatif, inovatif, efektif, dan menyenangkan.',
    'Mempersiapkan lulusan peserta didik berprestasi dan berkarakter Islami “taqwa, mandiri, cerdas dan kreatif”.',
    'Melakukan pembinaan keagamaan, pengembangan potensi dan bimbingan konseling.',
    'Memberikan jaminan layanan yang prima dan profesional dalam mendukung proses belajar dan bekerja.',
  ],
  image: { src: '/images/siswa-sdit.png', alt: 'Siswa Kaffah' },
};

// DATA GALERI
const sditGalleryData = {
  subtitle: 'Galeri Kegiatan',
  title: 'Momen Berharga di Kaffah 1',
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

// DATA EKSKUL
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
      <UnitHero {...sditData} />
      <AboutSection {...sditAboutData} />
      <SambutanKepsek data={sditSambutanData} />
      <VisiMisiSection visiData={sditVisiData} misiData={sditMisiData} />
      <NilaiUnggulSection />
      <StackingPrograms />
      <EkstrakurikulerSection subtitle="Kaffah Islamic School 1" title="Ekstrakurikuler Unggulan" data={sditEkskulData} />
      <GaleriSection {...sditGalleryData} />
    </>
  );
}