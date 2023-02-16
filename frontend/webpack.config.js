const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

let mode = 'development';
if (process.env.NODE_ENV === 'production') {
    mode = 'production';
}


module.exports = {
    mode: mode,
    entry: './src/app.js',
    output: {
        filename: 'script/[name].[contenthash].js',
        path: path.resolve(__dirname, 'build'),
        assetModuleFilename: 'assets/[hash][ext][query]',
        clean: true,
    },
    devServer: {
        watchFiles: path.join(__dirname, 'src'),
        port: 9000,
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src/pages/index.html'),
        }),
        new MiniCssExtractPlugin({
            filename: './style/index.[contenthash].css',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {
                test: /\.(js|jsx|tsx|ts)$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            },
            {
                test: /\.(pcss|css)$/i,
                use: [
                    ('development' === mode)
                        ? MiniCssExtractPlugin.loader
                        : "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                            url: false
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                config: path.resolve(__dirname, "postcss.config.js"),
                            },
                        },
                    },
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)($|\?)|\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "[path][name].[ext]"
                    },
                }
            }
        ],
    },
    devtool: 'source-map',
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            test: /\.js(\?.*)?$/i,
        })],
    },
};

