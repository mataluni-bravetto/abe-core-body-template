/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@bravetto/abe-core-body-template'],
  // Enable source maps in development
  productionBrowserSourceMaps: false,
  // Webpack configuration for better debugging
  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = 'eval-source-map';
    }
    return config;
  },
}

module.exports = nextConfig

