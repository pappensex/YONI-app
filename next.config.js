/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['user-images.githubusercontent.com'],
  },
}

module.exports = nextConfig
