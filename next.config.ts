import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Meal photos are self-hosted in /public; this allows the Pexels CDN
    // fallback used when a local file is missing (see src/components/site/MealPhoto.tsx).
    remotePatterns: [{ protocol: "https", hostname: "images.pexels.com" }],
  },
};

export default nextConfig;
