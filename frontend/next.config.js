/** @type {import('next').NextConfig} */
const nextConfig = {
  fastRefresh: true,
  swcMinify: true,
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
