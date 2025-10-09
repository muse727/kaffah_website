/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https', // Asumsi WordPress lo pakai https
        hostname: 'cms.sitalmubarak.com',
      },
    ],
  },
};

export default nextConfig;