import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*', // Backend ဆီ လွှဲပေးမယ်
      },
    ];
  },
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
