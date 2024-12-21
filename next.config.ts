import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["avatars.githubusercontent.com", "lh3.googleusercontent.com", "hk-test-s3bucket.s3.us-east-2.amazonaws.com"]
  },
};

export default nextConfig;
