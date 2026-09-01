import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
  allowedDevOrigins: ["10.175.69.221", "*.local", "localhost"],
};

export default nextConfig;
