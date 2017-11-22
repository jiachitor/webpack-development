
const config = require('./config.js')
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

const opn = require('opn')
const path = require('path')
const express = require('express');
const request = require('request');

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.dev.js');

const port = process.env.PORT || 3000;

const app = express();
const compiler = webpack(webpackConfig);

const options = {
  contentBase: './dist',
  hot: true,
  host: 'localhost',
  publicPath: webpackConfig.output.publicPath,
  quiet: true
};

var devMiddleware = require('webpack-dev-middleware')(compiler, options)

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: () => {
    }
})

// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        hotMiddleware.publish({action: 'reload'})
        cb()
    })
})

app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
// app.use(webpackDevMiddleware(compiler, {
//   publicPath: config.output.publicPath
// }));

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
    _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
    console.log('> Listening at ' + uri + '\n')
    // when env is testing, don't need open it
    if (process.env.NODE_ENV !== 'testing') {
        opn(uri)
    }
    _resolve()
})


// 增加代理转发
app.use('/api/*', function (req, res, next) {
    let url = 'http://localhost:8001' + req.baseUrl;
    let url2 = 'http://localhost:8001' + req.originalUrl;

    // 这个 pipe 是 Stream 里面的方法
    // 把一个 readable stream 的所有数据写入到另一个 writable stream 里面去
    if (req.method === 'POST') {
        req.pipe(request[req.method.toLowerCase()](url, {
            body: JSON.stringify(req.body)
        }), {
            end: false
        }).pipe(res)
    } else if (req.method === 'GET') {
        // console.log(req.query)
        req.pipe(request[req.method.toLowerCase()](url2)).pipe(res)
    }

});

// Serve the files on port 3000.
var server = app.listen(port, function () {
  console.log('Example app listening on port 3000!\n');
});

module.exports = {
    ready: readyPromise,
    close: () => {
        server.close()
    }
}
