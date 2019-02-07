var path             = require('path')
var assign           = require('object-assign')
var config           = require('../config/webpack')('development')
var gulp             = require('gulp')
var logger           = require('../lib/compileLogger')
var webpack          = require('webpack')
var browserSync      = require('browser-sync')
var gutil            = require("gulp-util")
var webpack          = require("webpack")
var webpackDevServer = require("webpack-dev-server")
var globalConfig     = require('../config')

var absPublicDirectory = path.resolve(globalConfig.publicDirectory)

gulp.task("webpack-dev-server", function(callback) {

	var built = false;

	var compiler = webpack(config);
    new webpackDevServer(compiler, {
    	hot: true,
    	open: true,
    	contentBase: absPublicDirectory,
    	publicPath: 'http://' + config.devServer.host + ':' + config.devServer.port + config.output.publicPath,
    	historyApiFallback: true,
        stats: { colors: true }
    }).listen(config.devServer.port, config.devServer.host, function(err) {
        if(err) throw new gutil.PluginError("webpack-dev-server", err);

        gutil.log("[webpack-dev-server]", "http://" + config.devServer.host + ":" + config.devServer.port + "/");

        // keep the server alive or continue?
        // callback();
        if(!built) { built = true; callback() }
    });
});
