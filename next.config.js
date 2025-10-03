/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['api.nanobananaapi.ai', 'nanobananaapi.ai'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
