const { NextFederationPlugin } = require("@module-federation/nextjs-mf");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, options) {
    const { isServer } = options;

    // Hanya aktifkan Module Federation di client side untuk sekarang
    if (!isServer) {
      config.plugins.push(
        new NextFederationPlugin({
          name: "host",
          filename: "static/chunks/remoteEntry.js",
          remotes: {
            remoteLogin: 'remoteLogin@http://localhost:4200/remoteEntry.js'
          },
          shared: {
            react: {
              singleton: true,
              requiredVersion: false,
              eager: true,
              strictVersion: false,
            },
            "react-dom": {
              singleton: true,
              requiredVersion: false,
              eager: true,
              strictVersion: false,
            },
            "styled-jsx": {
              singleton: true,
              requiredVersion: false,
            },
          },
          extraOptions: {
            exposePages: false,
            enableImageLoaderFix: true,
            enableUrlLoaderFix: true,
            skipSharingNextInternals: true,
            automaticAsyncBoundary: false,
          },
        })
      );
    }

    return config;
  },
};

module.exports = nextConfig;
