const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const workspaceRoot = path.resolve(__dirname, "./");
const projectRoot = path.resolve(__dirname, "./");

module.exports = exports = {
    mode: "development",
    entry: {
        vendors: path.resolve(projectRoot, "./src/vendors.js"),
        main: path.resolve(projectRoot, "./src/main.js")
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js"
    },
    devtool: "source-map",
    module: {
        rules: [
            { test: /\.txt$/, use: "raw-loader" },
            {
                test: /[\/]angular$/,
                use: "exports-loader?window.angular"
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: "./src/index.html" }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            moment: "moment",
            _: "lodash"
            // angular: 'angular',
            // 'window.angular': 'angular'
        })
    ],
    optimization:{
        occurrenceOrder: true,
        splitChunks: {
            cacheGroups: {
                vendors: {
                    name: "vendors",
                    test(module, chunks) {
                        console.log(`[${module.context}]`);
                        const names = [];
                        chunks.forEach((chunk) => {
                            names.push(chunk.name);
                        });
                        console.log(names.join(' | '));
                        let hasVendors = false;
                        chunks.forEach((chunk) => {
                            if (chunk.name === "vendors") {
                                hasVendors = true;
                            }
                        });
                        return hasVendors;
                    },
                    // test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    chunks: "all"
                },
            }
        }
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: false,
        port: 9000
    }
};
