import PageHeader from '../../components/PageHeader';
import PageWrapper from '../../components/PageWrapper';
import JuaraSection from '../../components/JuaraSection';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function JuaraPage() {
  // Ambil data langsung dari Database!
  const dataDariDatabase = await prisma.juara.findMany({
    orderBy: { year: 'desc' }
  });

  return (
    <PageWrapper>
      <PageHeader 
        title="Prestasi Sekolah"
        tagline="Hall of Fame: Jejak Langkah Sang Juara Kaffah"
        buttonPrimary={{ text: 'Daftar Sekarang', href: '/pendaftaran' }}
        buttonSecondary={{ text: 'Lihat Berita', href: '/berita' }}
      />

      <div style={{ marginTop: '-6rem' }}> 
        {/* Lempar datanya ke komponen */}
        <JuaraSection dataJuara={dataDariDatabase} />
      </div>
    </PageWrapper>
  );
}