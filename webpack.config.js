const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    }]
  },
  entry: path.resolve(__dirname, 'client', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, 'client', 'public', 'index.html'),
    }),
  ],
  devServer: {
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
}
