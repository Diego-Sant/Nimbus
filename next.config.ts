import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5000MB',
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.freepik.com'
      },
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com'
      },
      {
        protocol: 'https',
        hostname: 'cloud.appwrite.io'
      },
    ]
  }
};

export default nextConfig;
