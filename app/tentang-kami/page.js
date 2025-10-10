import PageHeader from '../../components/PageHeader';
import PageWrapper from '../../components/PageWrapper';
import SejarahSection from '../../components/SejarahSection';
import VisiMisiYayasan from '../../components/VisiMisiYayasan';
import TimSection from '../../components/TimSection';

export default function TentangKamiPage() {
  return (
    <PageWrapper>
      <PageHeader 
        title="Tentang Kami"
        tagline="“Mencetak Generasi Qurani dan Berakhlak Mulia”"
        buttonPrimary={{ text: 'Daftar Sekarang', href: '/pendaftaran' }}
        buttonSecondary={{ text: 'Lihat Visi & Misi', href: '/unit-pendidikan/sdit#visi-misi' }} // Contoh link ke Visi Misi
      />

      <div id="sejarah">
        <SejarahSection />
      </div>
      <VisiMisiYayasan />
      <TimSection />
    </PageWrapper>
  );
}