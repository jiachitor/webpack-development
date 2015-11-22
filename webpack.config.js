var path = require('path');

var vue = require('vue-loader'),
  webpack = require('webpack');

var config = {
  appName: ''
};

module.exports = function(config) {
  var release = config.release;

  return {
    entry: {
      app: [
        path.resolve(__dirname, "src", config.appName, "main.js")
      ]
    },
    output: {
      path: path.resolve(__dirname, "build", config.appName, "static"),
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
      }]
    },
    babel: {
      presets: ['es2015'],
      plugins: ['transform-runtime']
    }
  }
};
