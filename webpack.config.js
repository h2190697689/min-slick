const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = {
    mode: "development",
    entry: "./src/index.js",
    devtool: "source-map",
    output: {
        path: path.resolve(__dirname,"./dist"),
        filename: "bundle.[name].[hash:8].js",
        chunkFilename: "chunk.[name].[hash:8].js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader"
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    // MiniCssExtractPlugin.loader,
                    {
                        loader:"css-loader",
                        options: {
                            // modules: true
                        }
                    },

                ]
            },
            {
                test: /.less$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            // modules: true,
                            importLoaders: 2
                        }
                    },
                    "postcss-loader",
                    "less-loader"
                ]
            }
        ]
    },
    optimization: {
        splitChunks: {
            chunks: "all"
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname,"./public/index.html")
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[hash:8].css",
            chunkFilename: "[name].[hash:8].css"
        })
    ],
    devServer: {
        port: 3003,
        hot: true,
        open: true,
        contentBase: path.resolve(__dirname,"./public"),
        proxy: {
            "/api": {
              target: "http://localhost:3004",
              pathRewrite: {"^/api" : ""}
            }
        }
    }
};
