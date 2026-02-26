// app/layout.js
import { Poppins, Roboto } from 'next/font/google';
import '../styles/globals.css';
import 'aos/dist/aos.css';
import { AOSInit } from '../components/AOSInit';
import { AuthProvider } from './providers'; 
import ClientWrapper from '../components/ClientWrapper'; // 👈 Import Satpam kita

// Konfigurasi Font
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
        <AuthProvider>
            <AOSInit />
            {/* 👇 Serahkan urusan layouting ke Satpam kita 👇 */}
            <ClientWrapper>
              {children}
            </ClientWrapper>
            {/* 👆 Selesai 👆 */}
        </AuthProvider>
      </body>
    </html>
  );
}