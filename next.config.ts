import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.huggingface.co' },
      { protocol: 'https', hostname: '**.githubusercontent.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.googleusercontent.com' },
      { protocol: 'https', hostname: '**.openai.com' },
      { protocol: 'https', hostname: '**.anthropic.com' },
      { protocol: 'https', hostname: '**.mistral.ai' }
    ],
    // If a domain is not in the list, fallback or unoptimized
    unoptimized: true 
  },
};

export default nextConfig;
