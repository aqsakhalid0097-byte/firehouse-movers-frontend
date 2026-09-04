import type { NextConfig } from 'next';

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  'http://127.0.0.1:8000';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: '/media/:path*',
        destination: `${backendUrl}/media/:path*`,
      },
      {
        source: '/static/:path*',
        destination: `${backendUrl}/static/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: false,
      },
      {
        source: '/about-us',
        destination: '/about',
        permanent: false,
      },
      {
        source: '/dashboard',
        destination: '/',
        permanent: false,
      },
      {
        source: '/my-awards',
        destination: '/awards',
        permanent: false,
      },
      {
        source: '/team/members',
        destination: '/team',
        permanent: false,
      },
      {
        source: '/departments',
        destination: '/department',
        permanent: false,
      },
      {
        source: '/communication',
        destination: '/communication/dashboard',
        permanent: false,
      },
      {
        source: '/logs',
        destination: '/communication/dashboard',
        permanent: false,
      },
      {
        source: '/vehicle-availability',
        destination: '/vehicle/vehicle-availability',
        permanent: false,
      },
      {
        source: '/station/report',
        destination: '/station/report/1',
        permanent: false,
      },
      {
        source: '/station/:stationId',
        destination: '/station/report/:stationId',
        permanent: false,
      },
      {
        source: '/report/:stationId',
        destination: '/station/report/:stationId',
        permanent: false,
      },
      {
        source: '/stations',
        destination: '/station/report/1',
        permanent: false,
      },
      {
        source: '/report',
        destination: '/station/report/1',
        permanent: false,
      },
      {
        source: '/inspections/vehicle',
        destination: '/truck-inspection',
        permanent: false,
      },
      {
        source: '/inspections/onsite',
        destination: '/onsite-inspection',
        permanent: false,
      },
      {
        source: '/awards/gift_card',
        destination: '/awards/gifts',
        permanent: false,
      },
      {
        source: '/awards/gift-cards',
        destination: '/awards/gifts',
        permanent: false,
      },
      {
        source: '/restricted',
        destination: '/403',
        permanent: false,
      },
      {
        source: '/access-denied',
        destination: '/403',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
