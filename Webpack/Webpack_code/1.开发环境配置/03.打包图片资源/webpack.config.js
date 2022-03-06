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
