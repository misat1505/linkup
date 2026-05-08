import type { NextConfig } from "next";

const s3Url = new URL(process.env.S3_URL!);

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
        protocol: s3Url.protocol.replace(":", "") as "http" | "https",
        hostname: s3Url.hostname,
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
