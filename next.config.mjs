/** @type {import('next').NextConfig} */
const nextConfig = (phase) => ({
  reactStrictMode: true,
  // Separate dev and build directories so `next build` never corrupts a running `next dev` server
  distDir: phase === 'phase-development-server' ? '.next' : '.next-build',
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
    const apiBase =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, '') ||
      'http://localhost:5000';
    return [
      {
        source: '/uploads/:path*',
        destination: `${apiBase}/uploads/:path*`,
      },
    ];
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable persistent pack cache on Windows to prevent ENOENT vendor-chunks corruption
      config.cache = false;
    }
    return config;
  },
});

export default nextConfig;
