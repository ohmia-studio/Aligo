import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    dirs: ["app", "pages", "components", "utils", "lib"],
  },
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
