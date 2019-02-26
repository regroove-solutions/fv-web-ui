const webpack = require("webpack");
const merge = require("webpack-merge");
const common = require("./webpack.common");

const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

/**
 * Development Webpack Configuration
 */
module.exports = merge(common, {
    mode: "production",
    devtool: "",
    optimization: {
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    }
})