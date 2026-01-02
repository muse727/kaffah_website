import { Poppins, Roboto } from 'next/font/google';
import '../styles/globals.css';
import 'aos/dist/aos.css';
import { AOSInit } from '../components/AOSInit';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';
import WakafPopup from '../components/WakafPopup';
import { AuthProvider } from './providers'; // Import sudah ada

// Konfigurasi Font ... (sama seperti sebelumnya)
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
});

export const metadata = {
  title: 'Yayasan Wakfiah Al Mubarak',
  description: 'Mendidik dengan Iman, Ilmu, dan Akhlak untuk Generasi Rabbani',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${poppins.variable} ${roboto.variable}`}>
        {/* 👇 BUNGKUS SEMUANYA DENGAN AUTHPROVIDER DISINI 👇 */}
        <AuthProvider>
            <AOSInit />
            <Navbar />
            <WakafPopup />
            {children}
            <Footer />
            <Chatbot />
        </AuthProvider>
        {/* 👆 TUTUP AUTHPROVIDER DISINI 👆 */}
      </body>
    </html>
  );
}