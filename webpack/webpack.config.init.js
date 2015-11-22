var path = require('path'),
  webpack = require('webpack');

var vue = require('vue-loader'),
  ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    app: [
      path.resolve(__dirname, "src", config_appName, "js", "main.js")
    ]
  },
  output: {
    path: path.resolve(__dirname, "build", config_appName, "static"),
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    loaders: [{
      test: /\.vue$/,
      loader: 'vue'
    }, {
      test: /\.js$/,
      // excluding some local linked packages.
      // for normal use cases only node_modules is needed.
      exclude: /node_modules|vue\/src|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
      loader: 'babel'
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract('css!sass')
    }]
  },
  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime']
  }
};