import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.osisi.xyz",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "industrious-chickadee-771.convex.cloud",
        port: "",
        pathname: "/api/storage/**",
      },
      // Add more patterns if you have other image sources
      {
        protocol: "https",
        hostname: "*.convex.cloud", // This allows any convex.cloud subdomain
        port: "",
        pathname: "/api/storage/**",
      },
    ],
  },
};

export default nextConfig;
