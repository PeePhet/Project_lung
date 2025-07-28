import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
    
  },
  devIndicators: false
  
  /* config options here */
};



export default nextConfig;
