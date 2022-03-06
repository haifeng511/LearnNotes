/**
 * webpack.config.js webpack的配置文件
 *
 * 所有构建工具都是基于nodejs平台运行的，模块化采用commonjs，所以这里使用module.exports暴露模块
 */

// 这里使用node的知识，用resolve拼接绝对路径
const path = require('path');

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
                    // 将css文件变成commonjs模块加载到js文件中，里面内容是样式字符串
                    'css-loader'
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
    ],
    // 模式
    mode: 'development'
    //    mode:'production'
};
