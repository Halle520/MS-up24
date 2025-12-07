//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {},
  // Enable source maps for LocatorJS
  productionBrowserSourceMaps: false,
  // Webpack config for LocatorJS
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Ensure source maps are enabled in development
      config.devtool = 'eval-source-map';

      // Add LocatorJS webpack loader
      config.module.rules.push({
        test: /\.(tsx|ts|jsx|js)$/,
        exclude: /node_modules/,
        use: [{
          loader: '@locator/webpack-loader',
          options: {
            env: 'development'
          }
        }]
      });
    }
    return config;
  },

};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
