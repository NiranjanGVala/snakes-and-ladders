const currentTask = process.env.npm_lifecycle_event
const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const WorkboxPlugin = require('workbox-webpack-plugin');

const config = {
    entry: "./app/app.js",
    output: {
        filename: "script.js",
        path: path.resolve(__dirname, "docs"),
        assetModuleFilename: "media/[name][ext]"
    },
    plugins: [new HtmlWebpackPlugin({
        template: "./app/index.html",
        inject: "body"
    }),
    new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        maximumFileSizeToCacheInBytes: 10000000,
        skipWaiting: true
    }),],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(mp3|ogg|wav)$/i,
                type: "asset/resource"
            }
        ]
    },
    devServer: {
        host: "0.0.0.0",
        port: 8080,
        allowedHosts: "all",
        static: path.resolve(__dirname, "docs"),
        hot: true
    },
    devtool: false,
    mode: "development"
}

if (currentTask === "build") {
    config.mode = "production"
    config.output.clean = true
    config.plugins.push(new MiniCssExtractPlugin({
        filename: "style.css"
    }))
    config.module.rules[0].use[0] = MiniCssExtractPlugin.loader
}

module.exports = config