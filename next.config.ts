import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/organization",
        destination: "/src/organization",
      },
      {
        source: "/Events",
        destination: "/src/events",
      },
      {
        source: "/hackathons",
        destination: "/src/hackathons",
      },
      {
        source: "/hackathon/:path*",
        destination: "/src/hackathon/:path*",
      },
      {
        source: "/Builds",
        destination: "/src/builds",
      }
    ];
  },
};

export default nextConfig;
