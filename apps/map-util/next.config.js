const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const lightningcss = require("lightningcss");
const browserslist = require("browserslist");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.optimization.minimize = true;
    config.optimization.minimizer = [
      new CssMinimizerPlugin({
        minify: CssMinimizerPlugin.lightningCssMinify,
        minimizerOptions: {
          targets: lightningcss.browserslistToTargets(browserslist("defaults")),
        },
      }),
    ];
    return config;
  },
};

module.exports = nextConfig;
