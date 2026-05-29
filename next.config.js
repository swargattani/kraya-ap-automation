/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  api: {
    bodyParser: false,
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose', 'tesseract.js', 'pdf-parse'],
  },
};

module.exports = nextConfig;
