import PageHeader from '../../components/PageHeader';
import PageWrapper from '../../components/PageWrapper';
import SejarahSection from '../../components/SejarahSection';
import VisiMisiYayasan from '../../components/VisiMisiYayasan';
import TimSection from '../../components/TimSection';

// 🔥 IMPORT PRISMA BUAT NYEDOT DATA LOKAL
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Kasih tau Next.js biar halamannya selalu ambil data terbaru
export const dynamic = 'force-dynamic';

export default async function TentangKamiPage() {
  
  // 🔥 SEDOT DATA TIM DARI DATABASE LOKAL
  const dataTim = await prisma.tim.findMany({
    orderBy: {
      createdAt: 'asc' // Biar yang diinput duluan tampil duluan (atau bisa ganti 'desc')
    }
  });

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
      
      {/* 🔥 LEMPAR DATANYA KE KOMPONEN TIM */}
      <TimSection dataTim={dataTim} />
      
    </PageWrapper>
  );
}