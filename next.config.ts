import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "tgbyevvogyckrahohyee.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.openai.com",
      },
    ],
  },
};

export default nextConfig;
