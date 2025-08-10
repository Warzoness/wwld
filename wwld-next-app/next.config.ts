import type { NextConfig } from "next";

const BACKEND = (process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080").replace(/\/$/, "");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },              // ảnh Cloudinary
      { protocol: "https", hostname: "wwld-production.up.railway.app" }, // ảnh cũ từ backend prod (nếu còn dùng /uploads)
      { protocol: "http",  hostname: "localhost" },                       // ảnh cũ từ backend dev
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND}/api/:path*`, // Proxy mọi /api/... sang Spring Boot theo ENV
      },
    ];
  },
};

export default nextConfig;
