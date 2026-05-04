import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@packages/ui"],
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
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
  turbopack: {
    resolveAlias: {
      "@packages/api-contract": "../../packages/api-contract/src",
      "@packages/schemas": "../../packages/schemas/src",
    },
  },
};

export default nextConfig;
