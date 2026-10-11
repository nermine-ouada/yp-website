import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Dashboard image uploads go through Server Actions (default cap is 1MB).
    // Vercel's own request limit is 4.5MB, so stay under it.
    serverActions: { bodySizeLimit: "4mb" },
  },
};

export default nextConfig;
