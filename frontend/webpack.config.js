const path = require("path")
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: './src/js/index.tsx',
    output: {
        filename: 'js/[name].[fullhash].bundle.js',
        path: path.resolve(__dirname, 'static'),
        publicPath: "/static/"
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [{
            test: /\.(ts|js)x?$/,
            exclude: /node_modules/,
            use: 'ts-loader',
        },{
            test: /\.css$/,
            use: [ 'style-loader', 'css-loader' ]
        },{
            test: /\.(png|svg|jpg|gif)$/,
            use: ['file-loader']
        },{
            test: /\.html$/,
            use: ['html-loader']
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: 'body',
            template: path.join(__dirname, "src/html/index.html")
        }),
        //new CopyWebpackPlugin({
            //patterns: [
                //{ from: "source", to: "dest" },
                //{ from: "source", to: "dest" },
            //],
        //})
    ],
};
