import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        // port: "9000",
        // pathname: "/linkup-bucket/**",
      },
    ],
  },
};

export default nextConfig;
