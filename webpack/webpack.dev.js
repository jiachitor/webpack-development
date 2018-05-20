const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const glob = require('glob')

const base = require('./webpack.base.js');
const config = require('./config.js')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

function assetsPath(_path) {
    var assetsSubDirectory = process.env.NODE_ENV === 'production' ?
        config.build.assetsSubDirectory :
        config.dev.assetsSubDirectory
    return path.posix.join(assetsSubDirectory, _path)
}

var htmls = glob.sync('./src/*.html').map(function(item) {
    return new HtmlWebpackPlugin({
        template: item,
        filename: './' + item.slice(6),
        chunks: [item.slice(6, -5), 'common'],
        vendor: './vendor.dll.js', //与dll配置文件中output.fileName对齐
        inject: true,
        hash: true, //防止缓存
        minify: {
            removeAttributeQuotes: true //压缩 去掉引号
        }
    });
});

module.exports = merge(base, {
    mode: 'development',
    devtool: '#cheap-module-eval-source-map',
    // 扩展插件，在Webpack构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要的事情。
    module: {
        rules: []
    },
    plugins: [

        // 定义 JS中常量
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': config.dev.env,
            '$STATIC$': JSON.stringify("~@static")
        }),

        new webpack.DllReferencePlugin({
            manifest: path.resolve(__dirname, '..', 'dist', 'manifest.json')
        }),

        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),

        // 提取css
        new MiniCssExtractPlugin({
            filename: assetsPath('css/[name].css'),
            chunkFilename: "[id].css"
        }),

        new FriendlyErrorsPlugin()
    ].concat(htmls)
});
