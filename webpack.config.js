var path = require('path'),
  webpack = require('webpack');

var vue = require('vue-loader'),
  ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    app: [
      path.resolve(__dirname, "src", "app", "js", "main.js")
    ]
  },
  output: {
    path: path.resolve(__dirname, "src", "app", "static"),
    filename: 'app.bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin("app.bundle.css", {
      allChunks: true
    })
  ],
  module: {
    loaders: [{
      test: /\.vue$/,
      loader: 'vue'
    }, {
      test: /\.js$/,
      exclude: /node_modules|vue\/src|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
      loader: 'babel'
    }, {
      test: /\.css$/,
      loaders: ["style", "css", "sass"]
    }, {
      test: /\.scss$/,
      loaders: ["style", "css", "sass"]
    }, /*{
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract("style-loader", "css-loader", "sass-loader")
    }*/]
  },
  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime']
  }
};