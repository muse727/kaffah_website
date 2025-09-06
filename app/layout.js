import { Poppins, Roboto } from 'next/font/google';
import '../styles/globals.css';
import 'aos/dist/aos.css'; // Pastikan AOS CSS tetap diimport
import { AOSInit } from '../components/AOSInit'; // Komponen baru untuk inisialisasi AOS

// Konfigurasi Font dari Google Fonts
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins', // Kita gunakan sebagai CSS Variable
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto', // Kita gunakan sebagai CSS Variable
});

export const metadata = {
  title: 'Yayasan Wakfiah Al Mubarak',
  description: 'Mendidik dengan Iman, Ilmu, dan Akhlak untuk Generasi Rabbani',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${poppins.variable} ${roboto.variable}`}>
        <AOSInit /> {/* <--- POSISI BENAR, di dalam body */}
        {children}
      </body>
    </html>
  );
}