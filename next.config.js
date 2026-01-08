/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('mjml', 'mjml-core');
    }
    return config;
  },
};

module.exports = nextConfig;
  