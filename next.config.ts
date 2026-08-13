import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["172.24.0.128", "*.ngrok-free.dev"],
};

export default nextConfig;
