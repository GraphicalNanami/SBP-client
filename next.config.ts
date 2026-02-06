import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/organization",
        destination: "/src/organization",
      },
      {
        source: "/hackathon/:path*",
        destination: "/src/hackathon/:path*",
      },
    ];
  },
};

export default nextConfig;
