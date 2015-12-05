var path = require('path'),
  os = require('os'),
  open = require('open'),
  webpack = require('webpack'),
  webpackDevServer = require('webpack-dev-server'),
  ExtractTextPlugin = require('extract-text-webpack-plugin');

var argv = process.argv.slice(2);

var webpackConfig = require('./webpack.config.js');

function getLocalIP() {
    const map = [];
    const ifaces = os.networkInterfaces();
    for (const dev in ifaces) {
        if (dev.indexOf('本地连接') != -1 || dev.indexOf('无线网络连接') != -1 ) {
            return ifaces[dev][1].address;
        }
    }  
    return map;
}

var IPV4 = getLocalIP();

var config = {
  host: 'http://' + IPV4,
  port: 8080,
  _host_: IPV4,
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

webpackConfig.entry.app.unshift("webpack-dev-server/client?" + config.host + ":" + config.port);
webpackConfig.entry.app.unshift("webpack/hot/dev-server");

var compiler = webpack(webpackConfig);
var server = new webpackDevServer(compiler, {
  host: config.host,
  port: config.port,
  contentBase: "src/", //指定访问目录
  hot: true,
  inline: true,
  quiet: false,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
  },
  //publicPath: config_appName + "/static/", //这个应该是必须的，对应到页面引用js资源的目录，但是没有生成真实的js文件
  publicPath: config.host + ":" + config.port + "/" + config_appName + "/static/", //这个应该是必须的，对应到页面引用js资源的目录，但是没有生成真实的js文件
  headers: {
    "X-Custom-Header": "yes"
  },
  stats: {
    colors: true
  },
});

server.listen(config.port, config._host_, function() {
  console.log(config.host + ":" + config.port + "/" + config_appName + "/");
  open(config.host + ":" + config.port + "/" );
});