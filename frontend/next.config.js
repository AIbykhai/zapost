/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/analyze-account',
        destination: 'http://localhost:3001/analyze-account',
      },
    ];
  },
};

module.exports = nextConfig; 