## 项目说明

该项目用于初始化webpack开发环境，支持 ES6， less， sass 等。 复杂环境可以基于此进行开发。

webpack 版本 4.x。

## Build Setup

``` bash
# install dependencies
yarn install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

```


## 问题记录

1. 如何升级项目依赖

```
// 升级所有依赖到最新
# yarn upgrade-interactive 

```

2. Webpack 中 css import 使用 alias 相对路径

[Webpack 中 css import 使用 alias 相对路径](https://wiki.zthxxx.me/wiki/%E6%8A%80%E6%9C%AF%E5%BC%80%E5%8F%91/%E5%89%8D%E7%AB%AF/Webpack-%E4%B8%AD-css-import-%E4%BD%BF%E7%94%A8-alias-%E7%9B%B8%E5%AF%B9%E8%B7%AF%E5%BE%84/)

3. 样式文件中引用 sass

```
@import "~bootstrap/config";
```

4. 关于webpack4

[上手webpack4并进阶](https://www.jianshu.com/p/6c998f83e637)


5. JS中常量的替换

webpack的配置 在plugins中加入

```
new webpack.DefinePlugin({
    'process.env.NODE_ENV': '"development"',
    'process.env.webSocket': '"192.168.0.193"'
}),
```

js中使用(在js 使用｛｝将在webpack中定义的变量引入即可。)：

```
export const webSocketUrl = `ws://${process.env.webSocket}/notice/websocket`;

```


