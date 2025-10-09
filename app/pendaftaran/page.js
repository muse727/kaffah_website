import PpdbHero from '../../components/PpdbHero';
import AlurPendaftaran from '../../components/AlurPendaftaran';
import InvestasiPendidikan from '../../components/InvestasiPendidikan';
import DownloadArea from '../../components/DownloadArea';
import FinalCta from '../../components/FinalCta';

// Import data langsung dari file lokal
import { dataAlurPendaftaran } from '../../data/alurPendaftaran';

export default function PendaftaranPage() {
  const alur = dataAlurPendaftaran; // Langsung gunakan data

  return (
    <main>
      <PpdbHero />
      <AlurPendaftaran alur={alur} />
      <InvestasiPendidikan />
      <DownloadArea />
      <FinalCta />
    </main>
  );
}