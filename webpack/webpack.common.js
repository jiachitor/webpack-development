const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const config = require('./config.js')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    entry: {
        app: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: [
            '.js', '.vue', '.json'
        ],
        alias: {
            '@': resolve('src')
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: [
                    resolve('src'), resolve('test')
                ],
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            }, {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test')]
            }, {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({fallback: "style-loader", use: "css-loader"})
            }, {
                test: /\.(less)$/,
                // loader: 'style!css!less',
                // use: ['style-loader', 'css-loader', 'less-loader']
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    //resolve-url-loader may be chained before sass-loader if necessary
                    use: ['css-loader', 'less-loader']
                })
            }, {
                test: /\.(scss)$/,
                // use: ['style-loader', 'css-loader', 'sass-loader']
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    //resolve-url-loader may be chained before sass-loader if necessary
                    use: ['css-loader', 'sass-loader']
                })
            }, {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader']
            }, {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ['file-loader']
            }
        ]
    }
};
