/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/u/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",

        pathname: "/a/**",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",

        pathname: "/embed/avatars/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",

        pathname: "/**",
      },
      { protocol: "https", hostname: "obwr52bngc.ufs.sh", pathname: "/f/*" },
    ],
  },
};

module.exports = nextConfig;
