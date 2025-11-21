/** @type {import('next').NextConfig} */
const nextConfig = {
 codex/review-current-repository-du94j2

  transpilePackages: ['react-map-gl', 'mapbox-gl'],
  // Vercel Turbopack buildlarında react-map-gl çözümlemesini netleştiriyoruz
  webpack: (config) => {
    config.resolve.alias['react-map-gl'] = require.resolve('react-map-gl/dist/esm/index.js');
    return config;
  },
 main
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
