// next.config.ts
import { backendUrl } from "@/lib/consts/const";
import type { NextConfig } from "next";

const BACKEND = backendUrl.replace(/\/$/, ""); // bỏ dấu / cuối

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
