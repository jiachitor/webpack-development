var path = require('path'),
  open = require('open'),
  webpack = require('webpack'),
  webpackDevServer = require('webpack-dev-server'),
  ExtractTextPlugin = require('extract-text-webpack-plugin');

var argv = process.argv.slice(2);

var webpackConfig = require('./webpack.config.js');

var config = {
  host: 'http://localhost',
  port: 8080,
  _host_: 'localhost',
};

if (argv[0] === '--production') {
  // 生产环境下
  webpackConfig.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: false
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
} else {
  // 开发环境下
  webpackConfig.devtool = '#source-map'
}

webpackConfig.entry.app.unshift("webpack-dev-server/client?http://localhost:8080");
webpackConfig.entry.app.unshift("webpack/hot/dev-server");

var compiler = webpack(webpackConfig);
var server = new webpackDevServer(compiler, {
  host: config.host,
  port: config.port,
  contentBase: "src/" + config_appName, //指定访问目录
  hot: true,
  inline: true,
  quiet: false,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
  },
  publicPath: "/static/", //这个应该是必须的，对应到页面引用js资源的目录，但是没有生成真实的js文件
  headers: {
    "X-Custom-Header": "yes"
  },
  stats: {
    colors: true
  },
});
server.listen(config.port, config._host_, function() {
  console.log(config.host + ":" + config.port + "/");
  open(config.host + ":" + config.port + "/" + config_appName + "/");
});