// next.config.ts
import type { NextConfig } from "next";

const RAW = process.env.BACKEND_URL ?? "http://localhost:8080";
const BACKEND = RAW.replace(/\/$/, ""); // bỏ dấu / cuối

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "wwld-production.up.railway.app" },
      { protocol: "http",  hostname: "localhost" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
