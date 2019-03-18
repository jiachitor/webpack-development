const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const glob = require('glob')
var hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

//导入vue-loader插件
const VueLoaderPlugin = require('vue-loader/lib/plugin');

// 使用HappyPack进行javascript的多进程打包操作，提升打包速度，并增加打包时间显示。(生产和开发环境都需要)
const HappyPack = require('happypack')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

const config = require('./config.js')

const PATHS = {
    src: path.join(__dirname, '../src'),
    dist: path.join(__dirname, '../dist')
};

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

function assetsPath(_path_) {
    let assetsSubDirectory;
    if (process.env.NODE_ENV === 'production') {
        assetsSubDirectory = 'static' //可根据实际情况修改
    } else {
        assetsSubDirectory = 'static'
    }

    return path.posix.join(assetsSubDirectory, _path_)
}

var entryJSpages = glob.sync('./src/script/pages/*.js').reduce(function(prev, curr) {
    if (process.env.NODE_ENV === 'production') {
        prev[curr.slice(19, -3)] = [curr];
    } else {
        prev[curr.slice(19, -3)] = [curr, hotMiddlewareScript];
    }
    return prev;
}, {});

var entryJS = Object.assign(
    entryJSpages
)

module.exports = {
    // entry 和 module.rules.loader 选项相对于此目录开始解析
    context: path.resolve(__dirname, '../'),
    // 入口文件配置，Webpack 执行构建的第一步将从 Entry 开始，完成整个工程的打包。
    entry: entryJS,
    // 输出结果，在Webpack经过一系列处理并得出最终想要的代码后输出结果，配置项用于指定输出文件夹，默认是./dist
    output: {
        path: PATHS.dist,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production' ?
            config.build.assetsPublicPath : config.dev.assetsPublicPath
    },
    /*webpack4.x的最新优化配置项，用于提取公共代码，跟`entry`是同一层级*/
    optimization: {
        splitChunks: {
            chunks: 'initial', // 必须三选一： "initial" | "all"(默认就是all) | "async"
            minSize: 0, // 最小尺寸，默认0
            minChunks: 1, // 最小 chunk ，默认1
            maxAsyncRequests: 2, // 最大异步请求数， 默认1
            maxInitialRequests: 5, // 最大初始化请求数，默认1
            name: "common", // 名称，此选项课接收 function
            // cacheGroups: {
            //     // 这里开始设置缓存的 chunks
            //     priority: '0', // 缓存组优先级 false | object |
            //     vendors: {
            //         // key 为entry中定义的 入口名称
            //         test: /[\\/]node_modules[\\/]/, // 正则规则验证，如果符合就提取 chunk
            //         name: 'vendors', // 要缓存的 分隔出来的 chunk 名称
            //         minSize: 0,
            //         minChunks: 1,
            //         enforce: true,
            //         chunks: 'all', // 必须三选一： "initial" | "all" | "async"(默认就是异步)
            //         maxAsyncRequests: 1, // 最大异步请求数， 默认1
            //         maxInitialRequests: 1, // 最大初始化请求数，默认1
            //         reuseExistingChunk: true, // 可设置是否重用该chunk（查看源码没有发现默认值）
            //     }
            // }
        }
    },
    resolve: {
        alias: {
            vue$: 'vue/dist/vue.esm.js',
            '@src': resolve('src'),
            '@script': resolve('src/script'),
            '@static': resolve('src/static')
        },
        // 省略后缀,
        extensions: ['.js', '.json', 'jsm', '.css', '.less', '.scss', '.sass', '.jsx', '.vue']
    },
    // 模块，在Webpack里一切皆模块，Webpack会从配置的Entry开始递归找出所有依赖的模块，最常用的是rules配置项，功能是匹配对应的后缀，从而针对代码文件完成格式转换和压缩合并等指定的操作
    module: {
        rules: [{
                test: /\.(js)$/,
                loader: 'eslint-loader', // 模块转换器，用于把模块原内容按照需求转换成新内容，这个是配合Module模块中的rules中的配置项来使用
                enforce: 'pre',
                include: [
                    resolve('src'), resolve('test')
                ],
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            }, {
                test: /\.js$/,
                loader: 'happypack/loader?id=happy-babel-js',
                include: [resolve('src'), resolve('test')],
                exclude: /node_modules/,
            }, {
                test: /\.jsx?$/,
                loader: 'happypack/loader?id=happy-babel-js',
                include: [resolve('src')],
                exclude: /node_modules/,
            }, {
                test: /\.vue$/,
                use: 'vue-loader',
                include: path.resolve('src'),
                exclude: /node_modules/
            },

            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                    },
                ],
            },{
                test: /\.css$/,
                use: ['css-hot-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
                include: [resolve('src')], //限制范围，提高打包速度
                exclude: /node_modules/
            }, {
                test: /\.less$/,
                use: ['css-hot-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader'],
                include: [resolve('src')],
                exclude: /node_modules/
            },
            // {
            //     test: /\.scss$/,
            //     use: ['css-hot-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
            //     include: [resolve('src')],
            //     exclude: /node_modules/
            // },
            { //file-loader 解决css等文件中引入图片路径的问题
                // url-loader 当图片较小的时候会把图片BASE64编码，大于limit参数的时候还是使用file-loader 进行拷贝
                test: /\.(png|jpg|jpeg|gif|svg)/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: assetsPath('images/[name].[hash:7].[ext]'), // 图片输出的路径
                        limit: 1 * 1024
                    }
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000, // if less than 10 kb, add base64 encoded image to css
                    name: assetsPath('medias/[name].[hash:7].[ext]') // if more than 10 kb move to this folder in build using file-loader
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    plugins: [
        //使用vue-loader插件
        new VueLoaderPlugin(),
        new HappyPack({
            id: 'happy-babel-js',
            loaders: ['babel-loader?cacheDirectory=true'],
            threadPool: happyThreadPool
        }),
        new ProgressBarPlugin({
            format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)'
        }),
    ]

};
