/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    API_URL: process.env.NODE_ENV === "production" ? "https://your-production-api.com" : "http://localhost:5000",
  },
}

module.exports = nextConfig
