/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Windows SWC Binary Support - Fallback to Babel if SWC fails
  swcMinify: true,
  experimental: {
    optimizePackageImports: ['@reduxjs/toolkit', 'react-redux'],
  },
  
  // Ensure proper ESM/CommonJS handling on Windows
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    return config;
  },
  
  // Headers for security and performance
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
            value: 'SAMEORIGIN',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
