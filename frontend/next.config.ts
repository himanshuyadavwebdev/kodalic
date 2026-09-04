import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.175.69.221", "*.local", "localhost"],
  poweredByHeader: false,
  turbopack: { root: __dirname },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "header", key: "host", value: "kodalic.com" }],
        destination: "https://www.kodalic.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
