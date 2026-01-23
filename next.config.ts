import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
  },
  // Gestion des erreurs pour les images manquantes
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;
