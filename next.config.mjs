/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["msedge-tts", "ws"],
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "h67vy9xnqpkimvev.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
