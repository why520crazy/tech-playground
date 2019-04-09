const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ConcatPlugin = require("webpack-concat-plugin");
const webpack = require("webpack");
const workspaceRoot = path.resolve(__dirname, "./");
const projectRoot = path.resolve(__dirname, "./");

const vendorsScripts = ["jquery", "angular", "angular-animate", "moment"];

let count = 0;
module.exports = exports = {
    mode: "development",
    entry: {
        // vendors: ["jquery", "angular", "angular-animate", "moment"],
        // vendors: path.resolve(projectRoot, "./src/vendors.js"),
        main: path.resolve(projectRoot, "./src/main.js")
    },
    resolve: {
        alias: {
            // 'jquery': BOWER_DIR + '/jquery/dist/jquery.js',
            // 'moment': BOWER_DIR + '/moment/moment.js',
            // 'jquery.elastic': BOWER_DIR + '/jquery.elastic.source.js',
            // 'lodash': BOWER_DIR + '/lodash/lodash.js',
            // angular: "angular/angular.js"
            // 'clipboard': BOWER_DIR + '/clipboard/dist/clipboard.js',
            // '@ngx-translate/core': '@ngx-translate/core/bundles/core.umd.js',
            // '@angular/upgrade/static': '@angular/upgrade/bundles/upgrade-static.umd.js'
        }
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js"
    },
    devtool: "none",
    // devtool: "source-map",

    module: {
        rules: [
            { test: /\.txt$/, use: "raw-loader" }
            // {
            //     test: /[\/]angular$/,
            //     use: "exports-loader?angular"
            // }
        ]
    },
    plugins: [
        new ConcatPlugin({
            // examples
            uglify: false,
            sourceMap: false,
            name: "vendors",
            fileName: "[name].bundle.js",
            filesToConcat: [
                "jquery",
                "angular/angular.js",
                "angular-animate/angular-animate.js",
                "moment"
            ],
            attributes: {
                async: true
            }
        }),
        new HtmlWebpackPlugin({ template: "./src/index.html" }),
        new webpack.ContextReplacementPlugin(
            /moment[\/\\]locale$/,
            /zh-cn|ja|zh-tw/
        ),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            moment: "moment",
            _: "lodash"
            // angular: "angular"
            // 'window.angular': 'angular'
        })
    ],
    externals: {
        jquery: "jQuery",
        moment: "moment",
        lodash: "_",
        angular: "angular"
    },
    // optimization: {
    //     // runtimeChunk: true,
    //     splitChunks: {
    //         cacheGroups: {
    //             vendors: {
    //                 name: "vendors1",
    //                 test(module, chunks) {
    //                     // let result = false;
    //                     // vendorsScripts.forEach(vendorsScript => {
    //                     //     if (
    //                     //         module.context.includes(
    //                     //             `node_modules/${vendorsScript}`
    //                     //         )
    //                     //     ) {
    //                     //         console.log(`[${module.context}]`);
    //                     //         result = true;
    //                     //     }
    //                     // });
    //                     // return result;
    //                     count++;
    //                     const names = [];
    //                     chunks.forEach(chunk => {
    //                         names.push(chunk.name);
    //                     });
    //                     console.log(
    //                         `${module.context} \n ` +
    //                             names.join(",") +
    //                             ` | count:${count}`
    //                     );
    //                     let hasVendors = false;
    //                     chunks.forEach(chunk => {
    //                         if (chunk.name === "vendors") {
    //                             hasVendors = true;
    //                         }
    //                     });
    //                     return hasVendors;
    //                 },
    //                 // test: /[\\/]node_modules[\\/]/,
    //                 priority: -10,
    //                 chunks: "initial"
    //             },
    //             default: {
    //                 minChunks: 2,
    //                 priority: -20,
    //                 reuseExistingChunk: true
    //             }
    //         }
    //     }
    // },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: false,
        port: 9000
    }
};
