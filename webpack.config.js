const merge = require('webpack-merge')
const argv = require('yargs-parser')(process.argv.slice(2))
const { resolve } = require('path')
const webpack = require('webpack')
const _mode = argv.mode || 'development'
const _mergeConfig = require(`./config/webpack.${_mode}.js`)
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { ThemedProgressPlugin } = require('themed-progress-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isProd = _mode === 'production'

const webpackBaseConfig = {
  entry: {
    main: resolve('src/index.tsx'),
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'swc-loader',
        },
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader',
        ],
      },
    ],
  },
  resolve: {
    alias: {
      '@': resolve('src/'),
      '@components': resolve('src/components'),
      '@contexts': resolve('src/contexts'),
      '@config': resolve('src/config'),
      '@utils': resolve('src/utils'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: isProd ? 'styles/[name].[contenthash:5].css' : 'styles/[name].css',
      chunkFilename: isProd ? 'styles/[name].[contenthash:5].css' : 'styles/[name].css',
      ignoreOrder: false,
    }),
    new ThemedProgressPlugin(),
    new webpack.DefinePlugin({
      'process.env.CONTRACT_ADDRESS': JSON.stringify(process.env.CONTRACT_ADDRESS || ''),
    }),
  ],
  cache: {
    type: 'filesystem',
  },
}

module.exports = merge.default(webpackBaseConfig, _mergeConfig)
