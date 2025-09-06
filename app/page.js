// app/page.js (VERSI FINAL YANG BENAR)

import Navbar from '../components/Navbar';
import Hero from '../components/Hero'; // <-- NYALAKAN LAGI IMPORT INI
import TentangKami from '../components/TentangKami';
import Keunggulan from '../components/Keunggulan';
import PendidikanSlider from '../components/PendidikanSlider';

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '116px' }}> {/* <-- KUNCI UTAMA 2 (tinggi navbar ~116px) */}
        <Hero /> {/* <-- NYALAKAN LAGI KOMPONEN INI */}
        <TentangKami />
        <Keunggulan />
        <PendidikanSlider />
      </main>
      {/* Tag h1 sementara sekarang bisa kita hapus/komen */}
    </>
  );
}