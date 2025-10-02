/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**', // Izinkan semua gambar dari folder uploads
      },
      // Ini untuk jaga-jaga kalau nanti lo pake ngrok lagi
      {
        protocol: 'https',
        hostname: '*.ngrok-free.app', 
      },
    ],
  },
};

export default nextConfig;