import type { NextConfig } from 'next';

const nextConfig: any = {
  eslint: {
    // این خط باعث می‌شود ورسل با وجود ارورهای eslint بیلد را ادامه دهد
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
