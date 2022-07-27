const currentTask = process.env.npm_lifecycle_event
const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

const config = {
    entry: "./app/app.js",
    output: {
        filename: "script.js",
        path: path.resolve(__dirname, "dist"),
    },
    plugins: [new HtmlWebpackPlugin({
        template: "./app/index.html",
        inject: "body"
    })],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    devServer: {
        port: 8080,
        static: path.resolve(__dirname, "dist"),
        hot: true
    },
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