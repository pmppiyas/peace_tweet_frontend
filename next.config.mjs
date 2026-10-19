/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    const rawApi =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      'https://api.peacetweet.com/api/v1';
    const apiBase = rawApi.replace(/\/api\/v1\/?$/, '');
    return [
      {
        source: '/uploads/:path*',
        destination: `${apiBase}/uploads/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/message',
        destination: '/messages',
        permanent: true,
      },
      {
        source: '/duas',
        destination: '/',
        permanent: true,
      },
    ];
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
