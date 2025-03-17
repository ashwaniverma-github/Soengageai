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
    domains: [
      "ibbynqmmnxuvjsptcyyq.supabase.co",
      "black-forest-labs-flux-1-dev.hf.space",
      "replicate.delivery",
      "lh3.googleusercontent.com",
    ],
  },
};

module.exports = nextConfig;
