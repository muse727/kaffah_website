// app/pendaftaran/page.js

import PpdbHero from '../../components/PpdbHero';
import AlurPendaftaran from '../../components/AlurPendaftaran';
import InvestasiPendidikan from '../../components/InvestasiPendidikan'; 
import DownloadArea from '../../components/DownloadArea'; // <-- Import baru
import FinalCta from '../../components/FinalCta';
import { getStrapiData } from '../../lib/strapi';

export default async function PendaftaranPage() {
  // Kita HAPUS pengambilan data untuk banner
  // const bannerData = await getStrapiData('/banner-ppdb?populate=gambar_background');
  
  // Data untuk Alur Pendaftaran tetap kita ambil
  const alurData = await getStrapiData('/alur-pendaftarans?sort=nomor_urut:asc&populate=gambar_ilustrasi');

  return (
    <main>
      {/* Kita tidak mengirim data banner lagi */}
      <PpdbHero /> 
      <AlurPendaftaran alur={alurData?.data} />
        <InvestasiPendidikan />
        <DownloadArea /> {/* <-- Panggil di sini */}
      <FinalCta /> {/* <-- Panggil di paling akhir */}
    </main>
  );
}