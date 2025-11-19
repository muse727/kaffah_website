import PageHeader from '../../components/PageHeader';
import PageWrapper from '../../components/PageWrapper';
import JuaraSection from '../../components/JuaraSection';

export default function JuaraPage() {
  return (
    <PageWrapper>
      {/* Header Halaman */}
      <PageHeader 
        title="Prestasi Sekolah"
        tagline="Hall of Fame: Jejak Langkah Sang Juara Al Mubarak"
        buttonPrimary={{ text: 'Daftar Sekarang', href: '/pendaftaran' }}
        buttonSecondary={{ text: 'Lihat Berita', href: '/berita' }}
      />

      {/* Komponen Juara yang sudah kita buat */}
      {/* Kita bungkus div biar backgroundnya nyambung rapi */}
      <div style={{ marginTop: '-6rem' }}> 
        <JuaraSection />
      </div>
    </PageWrapper>
  );
}