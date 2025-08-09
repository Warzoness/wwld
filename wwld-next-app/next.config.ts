import type { NextConfig } from "next";

// Cấu hình chính
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8080/api/:path*", // Proxy tới Spring Boot
      },
    ];
  },
};

export default nextConfig;
