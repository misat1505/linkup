import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  images: {
    dangerouslyAllowLocalIP: true,
    deviceSizes: [320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [25, 50, 75, 90, 100],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        // port: "9000",
        // pathname: "/linkup-bucket/**",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias["@packages"] = path.resolve(
      __dirname,
      "../../packages",
    );
    return config;
  },
};

export default nextConfig;
