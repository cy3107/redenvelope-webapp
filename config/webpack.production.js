const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { join, resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  output: {
    path: join(__dirname, '../dist'),
    publicPath: '/',
    filename: 'scripts/[name].[contenthash:5].bundle.js',
    assetModuleFilename: 'images/[name].[contenthash:5][ext]',
  },
  performance: {
    maxAssetSize: 512000,
    maxEntrypointSize: 512000,
    hints: 'warning',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin({ parallel: true }),
      new TerserPlugin({ parallel: true }),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'RedEnvelope DApp',
      filename: 'index.html',
      template: resolve(__dirname, '../src/index-prod.html'),
      favicon: './public/favicon.ico',
    }),
  ],
}
