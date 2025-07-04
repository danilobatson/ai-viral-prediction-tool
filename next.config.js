/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // API configuration
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type,Authorization' },
        ],
      },
    ];
  },
  
  // Environment variables
  env: {
    LUNARCRUSH_API_KEY: process.env.LUNARCRUSH_API_KEY,
  },
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Build configuration
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Experimental features
  experimental: {
    appDir: false, // Using pages directory
  }
};

module.exports = nextConfig;
