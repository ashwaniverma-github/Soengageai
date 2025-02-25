/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ibbynqmmnxuvjsptcyyq.supabase.co",
        pathname: "/storage/v1/object/public/posts/**",
      },
    ],
  },
};

module.exports = nextConfig;
