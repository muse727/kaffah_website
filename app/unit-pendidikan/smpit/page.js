import UnitHero from '../../../components/UnitHero';
import AboutSection from '../../../components/AboutSection';
import VisiMisiSection from '../../../components/VisiMisiSection';
import NilaiUnggulSection from '../../../components/NilaiUnggulSection';
import GaleriSection from '../../../components/GaleriSection';
import EkstrakurikulerSection from '../../../components/EkstrakurikulerSection';
import SambutanKepsek from '../../../components/SambutanKepsek'; // Komponen Premium Lu!
import StackingPrograms from '../../../components/StackingPrograms'; // Komponen Stacking Lu!
import styles from '../../../styles/GaleriSection.module.css';

// DATA HERO
const kis2Data = {
  schoolName: 'KAFFAH ISLAMIC SCHOOL 2 (A.M. FATWA)',
  tagline: 'SEKOLAH QURANI - GENERASI RABBANI',
  images: [
    { src: '/images/smpit-hero-1.jpg', alt: 'Kegiatan KIS 2' },
    { src: '/images/smpit-hero-2.jpg', alt: 'Belajar Mengajar KIS 2' },
    { src: '/images/smpit-hero-3.jpg', alt: 'Ekstrakurikuler KIS 2' },
  ],
  registerLink: '/pendaftaran',
};

// DATA ABOUT (KAFFAH 2)
const kis2AboutData = {
  subtitle: 'Kaffah Islamic School 2',
  title: 'Tentang Cabang A.M. Fatwa',
  summaryText: `Kaffah Islamic School A.M. Fatwa merupakan cabang resmi yang dibuka sebagai respons atas tingginya kepercayaan masyarakat serta banyaknya waiting list di unit utama untuk memperluas layanan pendidikan Islam berkualitas.`,
  fullText: `Kaffah Islamic School A.M. Fatwa merupakan cabang resmi yang dibuka sebagai respons atas tingginya kepercayaan masyarakat serta banyaknya waiting list di unit utama. Kelas jauh ini diselenggarakan di Gedung A.M. Fatwa untuk memperluas layanan pendidikan Islam yang berkualitas dan berkarakter bagi lebih banyak peserta didik.\n\nKerja sama resmi antara Kaffah Islamic School dan A.M. Fatwa ditetapkan melalui penandatanganan MoU pada 11 November 2025. Seluruh aspek pengelolaan pendidikan dilaksanakan sepenuhnya oleh Kaffah Islamic School, dengan sistem, kurikulum, dan standar layanan yang disamakan dengan unit utama (KIS 1).\n\nCabang ini membuka layanan pendidikan lengkap mulai dari KB–TKIT hingga SDIT.`,
  imageSrc: '/images/smpit-about.jpg',
  imageAlt: 'Gedung Kaffah Islamic School 2 A.M. Fatwa',
};

// DATA VISI MISI
const kis2VisiData = {
  title: 'VISI KAFFAH',
  text: '“Menjadikan sekolah qurani dalam mencetak generasi rabbani menuju peradaban bangsa yang Islami”',
  image: { src: '/images/siswi-smpit.png', alt: 'Siswi KIS 2' },
};

const kis2MisiData = {
  title: 'MISI KAFFAH',
  items: [
    'Memadukan (integrated) pendidikan umum dan pendidikan agama menjadi satu jalinan kurikulum.',
    'Menciptakan lingkungan belajar yang harmonis dan proses pembelajaran yang aktif, kreatif, inovatif, efektif, dan menyenangkan.',
    'Mempersiapkan lulusan peserta didik berprestasi dan berkarakter Islami “taqwa, mandiri, cerdas dan kreatif”.',
    'Melakukan pembinaan keagamaan, pengembangan potensi dan bimbingan konseling.',
    'Memberikan jaminan layanan yang prima dan profesional dalam mendukung proses belajar dan bekerja.',
  ],
  image: { src: '/images/siswa-smpit.png', alt: 'Siswa KIS 2' },
};

// DATA SAMBUTAN KEPSEK (KAFFAH 2)
const kis2SambutanData = {
  namaKepsek: 'Muslih Heriyanto, S.Pd., M.M.',
  fotoKepsek: '/images/kepala-sekolah.png',
  paragraf: [
    "Bismillāhirraḥmānirraḥīm. Assalamu’alaikum warahmatullāhi wabarakātuh",
    "Alhamdulillāhi rabbil ‘ālamīn, segala puji bagi Allah SWT. Dengan penuh rasa syukur, kami menyambut Bapak dan Ibu di Kaffah Islamic School, termasuk hadirnya cabang KIS 2 A.M. Fatwa sebagai upaya memperluas layanan pendidikan Islam yang berkualitas.",
    "Kaffah Islamic School A.M. Fatwa melayani pendidikan terpadu mulai dari KB, TKIT, hingga SDIT, dengan sistem, kurikulum, dan standar pengelolaan yang sama dengan unit utama. Di era 4.0 yang penuh tantangan, kami berkomitmen membentuk generasi yang berakhlakul karimah, cinta Al-Qur’an, cerdas, mandiri, dan kreatif sesuai tahap tumbuh kembangnya.",
    "Kami meyakini bahwa sinergi antara sekolah dan orang tua menjadi kunci keberhasilan pendidikan. Semoga Allah SWT senantiasa memberkahi langkah kita dalam mendidik generasi penerus umat.",
    "Wassalamu’alaikum warahmatullāhi wabarakātuh"
  ]
};

// DATA GALERI
const kis2GalleryData = {
  subtitle: 'Galeri Kegiatan',
  title: 'Momen Berharga di Kaffah 2',
  description: 'Dokumentasi berbagai aktivitas seru di KIS 2 A.M. Fatwa.',
  images: [
    { src: '/images/galeri-smpit/foto-1smp.jpg', alt: 'Kegiatan OSIS', span: styles.span_2x2 },
    { src: '/images/galeri-smpit/foto-2.jpg', alt: 'Lomba Cerdas Cermat', span: '' },
    { src: '/images/galeri-smpit/foto-3.jpg', alt: 'Kegiatan Pramuka', span: '' },
    { src: '/images/galeri-smpit/foto-4.jpg', alt: 'Juara Futsal', span: styles.span_1x2 },
    { src: '/images/galeri-smpit/foto-5.jpg', alt: 'Market Day', span: '' },
    { src: '/images/galeri-smpit/foto-6.jpg', alt: 'Studi Tur', span: styles.span_2x1 },
  ],
};

// DATA EKSKUL
const kis2EkskulData = [
  { name: 'Silat', icon: '/icons/ekskul/silat.png' },
  { name: 'Panahan', icon: '/icons/ekskul/panahan.png' },
  { name: 'Karate', icon: '/icons/ekskul/karate.png' },
  { name: 'Coding', icon: '/icons/ekskul/coding.png' },
  { name: 'Marawis', icon: '/icons/ekskul/marawis.png' },
  { name: 'Sains Club', icon: '/icons/ekskul/sains.png' },
  { name: 'Futsal', icon: '/icons/ekskul/futsal.png' },
  { name: 'Tahsin', icon: '/icons/ekskul/tahsin.png' },
  { name: 'Tahfizh', icon: '/icons/ekskul/tahfizh.png' },
];

export default function SmpitPage() {
  return (
    <>
      <UnitHero {...kis2Data} />
      <AboutSection {...kis2AboutData} />
      <SambutanKepsek data={kis2SambutanData} />
      <VisiMisiSection visiData={kis2VisiData} misiData={kis2MisiData} />
      <NilaiUnggulSection />
      
      {/* 🔥 PANGGIL STACKING PROGRAMS DENGAN JUDUL KAFFAH 2 */}
      <StackingPrograms 
        subtitle="Kaffah Islamic School 2" 
        title="Program Kegiatan Kaffah 2" 
      />
      
      <EkstrakurikulerSection 
        subtitle="Kaffah Islamic School 2"
        title="Ekstrakurikuler Unggulan"
        data={kis2EkskulData}
      />
      <GaleriSection {...kis2GalleryData} />
    </>
  );
}