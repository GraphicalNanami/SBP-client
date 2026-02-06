import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/organization",
        destination: "/src/organization",
      },
    ];
  },
};

export default nextConfig;
