# Webpack学习笔记

[TOC]

## 1. Webpack的概念和作用

webpack 是一种前端资源构建工具，一个**静态模块打包器**(module bundler)

webpack 会将前端的所有资源文件(js/json/css/img/less/...)都会作为模块处理，根据模块的依赖关系进行静态分析，打包生成对应的静态资源(bundle)



## 2. webpack的五个核心概念

### 2.1 入口(entry)

入口指示以那个文件为入口起点开始打包，分析内部依赖图

可以通过在 [webpack 配置](https://www.webpackjs.com/configuration)中配置 `entry` 属性，来指定一个入口起点（或多个入口起点）。默认值为 `./src`。

`entry` 配置的最简单例子：

**webpack.config.js**

```js
module.exports = {
  entry: './path/to/my/entry/file.js'
};
```

### 2.2 输出(output)

output指示在哪里输出所创建的bundles，以及如何命名文件，默认值为 `./dist`

**webpack.config.js**

```js
const path = require('path');

module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js'
  }
};
```

### 2.3 loader

载入程序，webpack本身只能理解JavaScript，通过loader处理非JavaScript文件

在 webpack 的配置中 **loader** 有两个目标：

1. `test` 属性，用于标识出应该被对应的 loader 进行转换的某个或某些文件。
2. `use` 属性，表示进行转换时，应该使用哪个 loader。

### 2.4 插件(plugins)

插件(Plugins)可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量等

想要使用一个插件，你只需要 `require()` 它，然后把它添加到 `plugins` 数组中，多数插件可以通过选项(option)自定义。

在一个配置文件中因为不同目的而多次使用同一个插件，需要通过使用 `new` 操作符来创建它的一个实例

**webpack.config.js**

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const webpack = require('webpack'); // 用于访问内置插件

const config = {
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
     //「在 require()/import 语句中被解析为 '.txt' 的路径」时，在webpack对它打包之前，先使用 raw-loader 转换一下
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};

module.exports = config;
```

### 2.5 模块（mode）

通过选择 `development(开发环境)` 或 `production(生产环境)` 之中的一个，来设置 `mode` 参数，你可以启用相应模式下的 webpack 内置的优化

```javascript
module.exports = {
  mode: 'production'
};
```



## 3. Webpack基本使用

安装webpack

npm install webpack webpack-cli -g

### 3.1 基本使用

 * webpack能够处理js和json文件，不能直接处理css/img文件
 * 生产环境和开发环境将ES6模块化编译成浏览器能识别的模块化
 * 生产环境比开发环境的代码更加简洁，内容进行压缩处理过

```js
/**
 * index.js webpack入口文件
 * 
 * webpack能够处理js和json文件，不能直接处理css/img文件
 * 生产环境和开发环境将ES6模块化编译成浏览器能识别的模块化
 * 生产环境比开发环境的代码更加简洁，内容进行压缩处理过
 * 
 * 运行指令：
 * 开发环境：webpack ./src/index.js -o ./build/ --mode=development  
 * 在build文件夹下会产生main.js  是浏览器可运行的js文件
 * 可使用node ./build/main.js 运行,也可新建index.html 引用打包后的main.js
 * main.js文件是未进行处理的
 * 
 * 生产环境：webpack ./src/index.js -o ./build --mode=production
 * 在build文件夹下阐释main.js 内容是经过压缩和处理的
 * (()=>{"use strict";const e=JSON.parse('{"name":"xxx","age":23}');console.log(e),console.log(3)})();
 * 
 */

import data from './data.json'
console.log(data);

function add(x,y){
    return x+y;
}

console.log(add(1,2));


```



### 3.2 打包样式资源

需要下载style-loader 、css-loader、less（高版本的less-loader可以不用下载less）、less-loader

```bash
npm install --save-dev style-loader css-loader less less-loader
```

webpack打包样式资源需要进行配置webpack.config.js ，配置文件信息如下，配置信息好了之后，执行webpack,在index.html引入打包好的bundle.js文件可以查看页面的样式发生变化

使用MiniCssExtractPlugin插件，提取JS中的CSS成单独文件

使用postcss-loader进行CSS兼容性处理

```js
/**
 * webpack.config.js webpack的配置文件
 *
 * 所有构建工具都是基于nodejs平台运行的，模块化采用commonjs，所以这里使用module.exports暴露模块
 */

// 这里使用node的知识，用resolve拼接绝对路径
const path = require('path');
// 提取js中的css成单独文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

//压缩CSS
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

// 设置nodejs环境变量
// process.env.NODE_ENV = 'development';

//  webpack配置
module.exports = {
    //   入口起点
    entry: './src/index.js',
    // 输出
    output: {
        // 输出文件名
        filename: 'bundle.js',
        //   输出路径  __dirname是nodejs的变量，代表当前文件目录的绝对路径
        path: path.resolve(__dirname, 'dist')
    },
    // loader配置
    module: {
        // loader的详细配置
        rules: [
            {
                // 匹配哪些文件，这边是正则表达式，代表以.css结尾的文件
                test: /\.css$/,
                use: [
                    // use数组中loader执行顺序，从右到做，从下到上，依次进行
                    // 创建style标签，将js中的样式资源插入进行，添加到head标签中生效
                    'style-loader',
                     // 这个loader取代style-loader。作用：提取js中的css成单独文件
      			    //  MiniCssExtractPlugin.loader,
                    // 将css文件变成commonjs模块加载到js文件中，里面内容是样式字符串
                    'css-loader',
                     /*
                        css兼容性处理：postcss --> postcss-loader postcss-preset-env

                        帮postcss找到package.json中browserslist里面的配置，通过配置加载指定的css兼容性样式

                        "browserslist": {
                          // 开发环境 --> 设置node环境变量：process.env.NODE_ENV = development
                          "development": [
                            "last 1 chrome version",
                            "last 1 firefox version",
                            "last 1 safari version"
                          ],
                          // 生产环境：默认是看生产环境
                          "production": [
                            ">0.2%",
                            "not dead",
                            "not op_mini all"
                          ]
                        }
                      */
                      // 使用loader的默认配置
                      // 'postcss-loader',
                      // 修改loader的配置
                      {
                        loader: 'postcss-loader',
                        options: {
                          ident: 'postcss',
                          plugins: () => [
                            // postcss的插件
                            require('postcss-preset-env')()
                          ]
                        }
                      }
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    // 将less文件编译成css文件
                    // 需要下载less 和less-loader
                    'less-loader'
                ]
            }
        ]
    },
    //  plugins的配置
    plugins: [
        // plugins的详细配置
         new MiniCssExtractPlugin({
          // 对输出的css文件进行重命名
          filename: 'css/built.css'
        })
          // 压缩css
    	new OptimizeCssAssetsWebpackPlugin()
    ],
  ],
    // 模式
    mode: 'development'
    //    mode:'production'
};

```

### 3.3 打包html资源

打包html资源需要下载HTML插件html-webpack-plugin 可以配置

```
npm i html-webpack-plugin -D
```

插件资源，需要先下载，然后在配置中引入，再通过new一个实例进行使用，具体代码如下：

```js
/*
  webpack配置
*/
const { resolve } = require('path');
// 引入html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            // loader的配置
        ]
    },
    plugins: [
        // plugins的配置
        // html-webpack-plugin
        // 功能：默认会创建一个空的HTML，自动引入打包输出的所有资源（JS/CSS）
        // 需求：需要有结构的HTML文件
        new HtmlWebpackPlugin({
            // 复制 './src/index.html' 文件，并自动引入打包输出的所有资源（JS/CSS）,生成的文件是dist目录下的index.html
            template: './src/index.html',
             // 压缩html代码
              minify: {
                // 移除空格
                collapseWhitespace: true,
                // 移除注释
                removeComments: true
              }
        })
    ],
    mode: 'development'
};

```

### 3.4 打包图片资源

需要下载 url-loader file-loader html-loader

```
npm i url-loader file-loader html-loader -D
```

```js
// webpack配置

const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: resolve(__dirname,'build')
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use:['style-loader','css-loader','less-loader']
            },
            {
                // 问题：默认处理不了html中img图片
                // 处理图片资源
                test: /\.(jpg|png|gif)$/,
                // 使用一个则用loader，而不是use
                // 下载 url-loader file-loader
                // url-loader 允许你有条件地将文件转换为内联的 base-64 URL (当文件小于给定的阈值)
                // 这会减少小文件的 HTTP 请求数。如果文件大于该阈值，会自动的交给 file- loader 处理
                loader: 'url-loader',
                options: {
                    // 图片大小小于8kb，就会被base64处理
                    // 优点: 减少请求数量（减轻服务器压力）
                    // 缺点：图片体积会更大（文件请求速度更慢）
                    limit: 8 * 1024,
                    // 问题：因为url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs
                    // 解析时会出问题：[object Module]
                    // 解决：关闭url-loader的es6模块化，使用commonjs解析
                    esModule: false,
                    // 给图片进行重命名
                    // [hash:10]取图片的hash的前10位
                    // [ext]取文件原来扩展名
                    name: '[hash:10].[ext]'
                },
                /**
                 * 在 webpack 5 中使用旧的资产加载器（即file-loader/ url-loader/ raw-loader）和资产模块时，
                 * 您可能希望阻止资产模块再次处理您的资产，因为这会导致资产重复。
                 * 这可以通过将资产的模块类型设置为 来完成'javascript/auto'。
                 * 信息来源：https://webpack.js.org/guides/asset-modules/#general-asset-type
                 */
                type:'javascript/auto'
            },
            {
                test: /\.html$/,
                // 处理html文件的img图片（负责引入img，从而能被url-loader进行处理）
                loader: 'html-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ],
    mode: 'development'
}

```

### 3.5 打包其他资源

file-loader 和 url-loader 可以接收并加载任何文件，然后将其输出到构建目录。这就是说，我们可以将它们用于任何类型的文件，包括字体

JSON 支持实际上是webpack内置的，也就是说 import Data from './data.json' 默认将正常运行。要导入 CSV、TSV 和 XML，可以使用 csv-loader 和 xml-loader

### 3.6 devServer

开发服务器配置，内容放在mode下一行

.运行指令: npx webpack-dev-server

```js
 mode: 'development',
// 开发服务器 devServer：用来自动化（自动编译，自动打开浏览器，自动刷新浏览器~~）
  // 特点：只会在内存中编译打包，不会有任何输出
  // 启动devServer指令为：npx webpack-dev-server
  devServer: {
    // 项目构建后路径
    contentBase: resolve(__dirname, 'build'),
    // 启动gzip压缩
    compress: true,
    // 端口号
    port: 3000,
    // 自动打开浏览器
    open: true
  }
```



### 3.7 JS语法检查和兼容性处理

语法检查使用使用eslint-loader

兼容性处理使用babel-loader

```js
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/built.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
        
        /*
        语法检查： eslint-loader  eslint
          注意：只检查自己写的源代码，第三方的库是不用检查的
          设置检查规则：
            package.json中eslintConfig中设置~
              "eslintConfig": {
                "extends": "airbnb-base"
              }
            airbnb --> eslint-config-airbnb-base  eslint-plugin-import eslint
      */
         {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'eslint-loader',
            options: {
              // 自动修复eslint的错误
              fix: true
            }
          },
        
      /*
        js兼容性处理：babel-loader @babel/core 
          1. 基本js兼容性处理 --> @babel/preset-env
            问题：只能转换基本语法，如promise高级语法不能转换
          2. 全部js兼容性处理 --> @babel/polyfill  
            问题：我只要解决部分兼容性问题，但是将所有兼容性代码全部引入，体积太大了~
          3. 需要做兼容性处理的就做：按需加载  --> core-js
      */  
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          // 预设：指示babel做怎么样的兼容性处理
          presets: [
            [
              '@babel/preset-env',
              {
                // 按需加载
                useBuiltIns: 'usage',
                // 指定core-js版本
                corejs: {
                  version: 3
                },
                // 指定兼容性做到哪个版本浏览器
                targets: {
                  chrome: '60',
                  firefox: '60',
                  ie: '9',
                  safari: '10',
                  edge: '17'
                }
              }
            ]
          ]
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  mode: 'development'
};

```



## 4.  Webpack优化

