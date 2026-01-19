import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React Compiler (Next.js 15+)
  reactCompiler: true,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dfibivartddugsms.public.blob.vercel-storage.com',
      },
    ],
  },

  // Caching & Performance
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['@prisma/client', 'bcryptjs'],
  },

  // Security & Performance Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        // Cache static assets for 1 year
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

