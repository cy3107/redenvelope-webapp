const HtmlWebpackPlugin = require('html-webpack-plugin')
const { resolve, join } = require('path')
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin')
const notifier = require('node-notifier')

const port = 3000

module.exports = {
  devServer: {
    historyApiFallback: true,
    static: {
      directory: join(__dirname, '../public'),
    },
    hot: true,
    port,
  },
  output: {
    publicPath: '/',
    filename: 'scripts/[name].bundle.js',
    assetModuleFilename: 'images/[name][ext][query]',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      favicon: './public/favicon.ico',
      template: resolve(__dirname, '../src/index-dev.html'),
    }),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`应用已启动: http://localhost:${port}`],
      },
      onErrors: function (severity, errors) {
        if (severity !== 'error') {
          return
        }
        const error = errors[0]
        notifier.notify({
          title: 'Webpack Build Error',
          message: `${severity}: ${error.name}`,
          subtitle: error.file || '',
        })
      },
      clearConsole: true,
    }),
  ],
}
