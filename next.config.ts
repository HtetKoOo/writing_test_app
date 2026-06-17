import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://express-js-2kxb.onrender.com/api/:path*', // Backend ဆီ လွှဲပေးမယ်
      },
    ];
  },
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
