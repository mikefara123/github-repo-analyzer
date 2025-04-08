/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Required for socket.io-client to work correctly
    config.externals = [...(config.externals || []), { 'utf-8-validate': 'commonjs utf-8-validate', bufferutil: 'commonjs bufferutil' }];
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig; 