var path = require('path')
var webpack = require('webpack')
var webpackManifest = require('../lib/webpackManifest')

var WriteFilePlugin = require('write-file-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var HappyPack = require('happypack');
var config = require('./')

// Phaser webpack config , requried by fv-games
const phaserModule = path.resolve('./node_modules/phaser-ce/')
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
const pixi = path.join(phaserModule, 'build/custom/pixi.js')
const p2 = path.join(phaserModule, 'build/custom/p2.js')


module.exports = function (env) {

    var port = 3001;

    var jsSourceDirectory = config.sourceAssets + config.javascriptDirectory + '/';
    var stylesSourceDirectory = config.sourceAssets + config.stylesheetsDirectory + '/';
    var gamesSourceDirectory = config.sourceAssets + config.gamesDirectory + '/';

    var jsPublicDirectory = config.publicAssets + config.javascriptDirectory + '/';

    var absPublicDirectory   = path.resolve(config.publicDirectory)
    var absJSSourceDirectory = path.resolve(jsSourceDirectory)
    var absJSPublicDirectory = path.resolve(jsPublicDirectory)

    var happyPackPlugins = ['transform-react-jsx-component-data-ids', 'transform-decorators-legacy'];

    if (env === 'development') {
        happyPackPlugins.push('transform-react-jsx-location')
    }

    var webpackConfig = {

        context: absJSSourceDirectory,

        node: {
            fs: "empty",
            net: "empty",
            tls: "empty",
            console: true
        },

        plugins: [
            new HappyPack({
                id: 'js',
                cache: true,
                loaders: [{
                    loader: 'babel-loader',
                    query: {
                        plugins: happyPackPlugins,
                        presets: ['react', 'es2015', 'stage-0'],
                        cacheDirectory: true
                    }
                }],
                threads: 4
            })
        ],

        resolve: {
            alias: {
                styles: path.resolve(stylesSourceDirectory),
                models: path.resolve(jsSourceDirectory + 'models/'),
                views: path.resolve(jsSourceDirectory + 'views/'),
                conf: path.resolve(jsSourceDirectory + 'configuration/'),
                operations: path.resolve(jsSourceDirectory + 'operations/'),
                common: path.resolve(jsSourceDirectory + 'common/'),
                games: path.resolve(gamesSourceDirectory),
                phaser: phaser,
                pixi: pixi,
                p2: p2
            },
            extensions: ['.js', '.less']
        },

        module: {
            rules: [
                {
                    test: /\.serviceworker\.js/,
                    loader: 'service-worker-loader',
                    options: {
                        filename: '[name].js',
                        publicPath: '/',
                        outputPath: '/'
                    },
                },
                {
                    test: /\.js$/,
                    use: ['happypack/loader?id=js'],
                    exclude: [
                        path.resolve(__dirname, "node_modules"),
                        /\.serviceworker\.js/
                    ],
                    include: absJSSourceDirectory
                },
                {
                    test: /\.less$/,
                    use: ["style-loader", "css-loader", "less-loader"]
                },
                {
                    test: /\.json$/,
                    use: ["json-loader"]
                },
                {
                    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: "url-loader?limit=10000&minetype=application/font-woff",
                    options:{
                        limit:10000,
                        mimetype:"application/font-woff",
                        name: config.assetsDirectory + config.fontsDirectory + '[name].[hash].[ext]'
                    }
                },
                {
                    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "url-loader",
                    options:{
                        limit:10000,
                        mimetype:"application/octet-stream",
                        name: config.assetsDirectory + config.fontsDirectory + "[name].[hash].[ext]"
                    }
                },
                {
                    test: /\.(jpg|jpeg|png|gif)$/,
                    loader: "file-loader",
                    options: {
                        name: config.assetsDirectory + config.imagesDirectory + "[name].[hash].[ext]"
                    }
                },
                {
                    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "file-loader",
                    options:{
                        name: config.assetsDirectory + config.fontsDirectory + "[name].[hash].[ext]"
                    }
                },
                {
                    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "url-loader",
                    options:{
                        name: config.assetsDirectory + config.imagesDirectory + "[name].[hash].[ext]",
                        limit:10000,
                        mimetype:'image/svg+xml'
                    }
                },
                //service-worker-loader?publicPath=assets/javascripts/&filename=[name].js!
                {
                    test: require.resolve("react"), use: "expose-loader?React"
                },
                {
                    test: /pixi\.js/,
                    use: {
                        loader: 'expose-loader',
                        query: 'PIXI'
                    }
                },
                {
                    test: /phaser-split\.js$/,
                    use: {
                        loader: 'expose-loader',
                        query: 'Phaser'
                    }
                },
                {
                    test: /p2\.js/,
                    use: {
                        loader: 'expose-loader',
                        query: 'p2'
                    }
                }
            ],
            noParse:
                [
                    /node_modules\/json-schema\/lib\/validate\.js///,
                    ///node_modules\/alloyeditor\/dist\/alloy-editor\/alloy-editor-no-react\.js/
                ]

        }
    }


    if (env !== 'test') {
        // Karma doesn't need entry points or output settings

        webpackConfig.entry = {
            app: ['./app.js'],
            shared: ['pixi', 'p2', 'phaser']
        }

        webpackConfig.output = {
            filename: config.assetsDirectory + config.javascriptDirectory + '[name].js',
            path: absPublicDirectory,
            publicPath: jsPublicDirectory,
        }

        // Factor out common dependencies into a shared.js
        webpackConfig.plugins.push(
            new webpack.optimize.CommonsChunkPlugin({
                name: 'shared',
                filename: config.assetsDirectory + config.javascriptDirectory + '[name].js'
            }),
            new WriteFilePlugin(),
        )
    }

    if (env === 'development') {
        webpackConfig.devtool = '#source-map'
        webpack.debug = true

        webpackConfig.devServer = {
            inline: true,
            host: '0.0.0.0',
            port: port
        };

        webpackConfig.entry['app'].push('webpack-dev-server/client?http://0.0.0.0:' + port);
        webpackConfig.entry['app'].push('webpack/hot/only-dev-server');

        webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
    }

    if (env === 'production') {
        webpackConfig.plugins.push(
            new webpackManifest('/', 'public'),
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            })
        );
        /*,

        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
          sourceMap: false,
          compress: {
            warnings: false,
            drop_debugger: true,
            drop_console: true
          }
        }),
        new webpack.NoErrorsPlugin()*/
        // )
    }

    return webpackConfig
}
