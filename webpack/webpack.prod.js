const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

// 清空打包目录的插件
const CleanWebpackPlugin = require('clean-webpack-plugin');

// 复制静态资源的插件
const CopyWebpackPlugin = require('copy-webpack-plugin');

// // 生成html的插件
const HtmlWebpackPlugin = require('html-webpack-plugin');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

const glob = require('glob')
const PurifyCSSPlugin = require('purifycss-webpack')
const WebpackParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')

const base = require('./webpack.base.js');
const config = require('./config.js')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

function assetsPath(_path) {
    var assetsSubDirectory = process.env.NODE_ENV === 'production'
        ? config.build.assetsSubDirectory
        : config.dev.assetsSubDirectory
    return path.posix.join(assetsSubDirectory, _path)
}

var htmls = glob.sync('./src/*.html').map(function (item) {
    return new HtmlWebpackPlugin({
        template: item,
        filename: './' + item.slice(6),
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
        },
        chunks:[item.slice(6, -5), 'common'],
        hash:true,//防止缓存
    });
});

module.exports = merge(base, {
    mode: 'production',
    output: {
        filename: assetsPath('js/[name].[chunkhash].js'),
        path: config.build.assetsRoot
    },
    module: {
        rules: []
    },
    plugins: htmls.concat([

        // 定义 JS中常量
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': config.dev.env,
            'process.env.webSocket': '"192.168.0.193"',
            '$STATIC$': JSON.stringify("http://dev.example.com")
        }),
        
        new CleanWebpackPlugin(['dist'], {
            root: path.join(__dirname, '..'),
            verbose: true,
            dry:  false
        }),

        // 复制资源
        // new CopyWebpackPlugin([
        //     {
        //         from: path.resolve(__dirname, '../src/static'),
        //         to: config.build.assetsSubDirectory,
        //         ignore: ['.*']
        //     }
        // ]),

        // 提取css
        new MiniCssExtractPlugin({
            filename: assetsPath('css/[name].[contenthash].css'),
            chunkFilename: "[id].css"
        }),

        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),

        new PurifyCSSPlugin({
            paths: glob.sync(path.join(__dirname, '../src/*.html'))
        }),

        new WebpackParallelUglifyPlugin({
            uglifyJS: {
                output: {
                    beautify: false, //不需要格式化
                    comments: false //不保留注释
                },
                compress: {
                    warnings: false, // 在UglifyJs删除没有用到的代码时不输出警告
                    drop_console: true, // 删除所有的 `console` 语句，可以兼容ie浏览器
                    collapse_vars: true, // 内嵌定义了但是只用到一次的变量
                    reduce_vars: true // 提取出出现多次但是没有定义成变量去引用的静态值
                }
            }
        }),
        
    ])
});
