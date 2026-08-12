import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Admin-entered thumbnail URLs may point to any external host.
    // Uploaded/local images are served from the same origin.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
