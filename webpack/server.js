const config = require('./config.js')
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

const opn = require('opn')
const path = require('path')
const express = require('express')
const request = require('request')

require('console-stamp')(console, "HH:MM:ss.l");

const app = express()

const port = process.env.PORT || 3000

app.use(require('morgan')('short'));

let _resolve
let readyPromise = new Promise(resolve => {
    _resolve = resolve
});

// ************************************
// This is the real meat of the example
// ************************************
(function() {

    let uri = 'http://localhost:' + port

    // Step 1: Create & configure a webpack compiler
    let webpack = require('webpack');
    let webpackConfig = require(process.env.WEBPACK_CONFIG ? process.env.WEBPACK_CONFIG : './webpack.dev');
    let compiler = webpack(webpackConfig);

    const options = {
        logLevel: 'warn',
        contentBase: './dist',
        hot: true,
        host: 'localhost',
        publicPath: webpackConfig.output.publicPath,
        quiet: true
    };

    let devMiddleware = require('webpack-dev-middleware')(compiler, options)

    let hotMiddleware = require('webpack-hot-middleware')(compiler, {
        log: console.log,
        path: '/__webpack_hmr',
        heartbeat: 10 * 1000
    })

    app.use(require('connect-history-api-fallback')())

    // Step 2: Attach the dev middleware to the compiler & the server
    app.use(devMiddleware)

    // Step 3: Attach the hot middleware to the compiler & the server
    app.use(hotMiddleware)

    console.log('> Starting dev server...')
    devMiddleware.waitUntilValid(() => {
        console.log('> Listening at ' + uri + '\n')
        // when env is testing, don't need open it
        if (process.env.NODE_ENV !== 'testing') {
            opn(uri)
        }
        _resolve()
    })
    
})();

// 增加代理转发
app.use('/api/*', function(req, res, next) {
    let url = 'http://localhost:8001' + req.baseUrl
    let url2 = 'http://localhost:8001' + req.originalUrl

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

})

// Serve the files on port 3000.
var server = app.listen(port, function() {
    console.log('Example app listening on port 3000!\n')
})

module.exports = {
    ready: readyPromise,
    close: () => {
        server.close()
    }
}
