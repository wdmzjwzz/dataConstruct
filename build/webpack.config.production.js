
const path = require("path");
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require("html-webpack-plugin")
module.exports = (env, argv) => ({
    mode: 'production',
    // 入口
    entry: {
        page: './src/view/index.tsx', // UI代码入口起点
    },
    // 出口
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname,  '../dist'),
        publicPath: '/'
    },
    // 模块
    module: {
        rules: [
            { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
            {
                test: /\.(js|jsx)$/,//一个匹配loaders所处理的文件的拓展名的正则表达式，这里用来匹配js和jsx文件（必须）
                exclude: /(node_modules|bower_components)/,//屏蔽不需要处理的文件（文件夹）（可选）
                loader: 'babel-loader',//loader的名称（必须）
            },
            { test: /\.css$/, use: ['style-loader', { loader: 'css-loader' }] },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader'],
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader'
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader'
            },
            {
                test: /\.(vert|frag)$/,
                use: {
                    loader: path.resolve(__dirname, './glsl-loader'),
                }
            }
        ],
    },

    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, '../dist/index.html'),
            template: 'public/index.html',
            inject: true,
            inlineSource: '.(js)$',
            chunks: ["page"]
        })
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js'], // 解析扩展。（当我们通过路导入文件，找不到改文件时，会尝试加入这些后缀继续寻找文件）
        alias: {
            '@': path.join(__dirname, '..', "src"), // 在项目中使用@符号代替src路径，导入文件路径更方便
            '@components': path.join(__dirname, '../src/view/components')
        }
    },

})