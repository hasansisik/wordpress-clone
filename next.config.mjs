/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      // Turbopack için genel ayarlar
      resolveAlias: {
        // Mevcut alias ayarları olursa buraya eklenebilir
      },
    },
  },
};

export default nextConfig;
