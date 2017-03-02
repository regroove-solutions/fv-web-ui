var path            = require('path')
var webpack         = require('webpack')
var webpackManifest = require('../lib/webpackManifest')

var HappyPack       = require('happypack');
var config          = require('./')

// Phaser webpack config , requried by fv-games
const phaserModule = path.resolve('./node_modules/phaser-ce/')
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
const pixi = path.join(phaserModule, 'build/custom/pixi.js')
const p2 = path.join(phaserModule, 'build/custom/p2.js')


module.exports = function(env) {

  var port = 3001;

  var jsSourceDirectory = config.sourceAssets + config.javascriptDirectory + '/';
  var stylesSourceDirectory = config.sourceAssets + config.stylesheetsDirectory + '/';
  var gamesSourceDirectory = config.sourceAssets + config.gamesDirectory + '/';

  var jsPublicDirectory = config.publicAssets + config.javascriptDirectory + '/';

  var absPublicDirectory = path.resolve(config.publicDirectory)
  var absJSSourceDirectory = path.resolve(jsSourceDirectory)
  var absJSPublicDirectory = path.resolve(jsPublicDirectory)
  var absGamesDirectory = path.resolve()

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
        loaders: [ {
            loader: 'babel-loader',
            query: {
              plugins: happyPackPlugins,
              presets: ['react', 'es2015', 'stage-0'],
              cacheDirectory: true
            }
          } ],
        threads: 4
      })
    ],

    resolve: {
      alias: {
        styles : path.resolve(stylesSourceDirectory),
        models: path.resolve(jsSourceDirectory + 'models/'),
        views: path.resolve(jsSourceDirectory + 'views/'),
        conf: path.resolve(jsSourceDirectory + 'configuration/'),
        operations: path.resolve(jsSourceDirectory + 'operations/'),
        common: path.resolve(jsSourceDirectory + 'common/'),
        games:path.resolve(gamesSourceDirectory),
        phaser:phaser,
        pixi:pixi,
        p2:p2
      },
      extensions: ['.js', '.less']
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          use: ['happypack/loader?id=js'],
          exclude: path.resolve(__dirname, "node_modules"),
          include: absJSSourceDirectory
        },
        {
          test: /\.less$/,
          use: ["style-loader","css-loader","less-loader"]
        },
        {
          test: /\.json$/,
          use:["json-loader"]
        },
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: ["url-loader?limit=10000&minetype=application/font-woff"]
        },
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          use: ["url-loader?limit=10000&minetype=application/octet-stream"]
        },
        {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          use: ["file-loader"]
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          use: ["url-loader?limit=10000&minetype=image/svg+xml"]
        },
        {
          test: require.resolve("react"), use: "expose-loader?React"
        },
        {
          test:/pixi\.js/,
          use:{
              loader:'expose-loader',
              query:'PIXI'
          }
        },
        {
          test:/phaser-split\.js$/,
          use:{
              loader:'expose-loader',
              query:'Phaser'
          }
        },
        {
          test:/p2\.js/,
          use:{
              loader:'expose-loader',
              query:'p2'
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


  if(env !== 'test') {
    // Karma doesn't need entry points or output settings

    webpackConfig.entry= {
      app: ['./app.js'],
      shared:['pixi', 'p2', 'phaser']
    }

    webpackConfig.output= {
      filename: env === 'production' ? '[name]-[hash].js' : '[name].js',
      path: absJSPublicDirectory,
      publicPath: config.assetsDirectory + config.javascriptDirectory + '/'
    }

    // Factor out common dependencies into a shared.js
    webpackConfig.plugins.push(
      new webpack.optimize.CommonsChunkPlugin({
        name: 'shared',
        filename: env === 'production' ? '[name]-[hash].js' : '[name].js',
      })
    )
  }

  if(env === 'development') {
    webpackConfig.devtool = '#source-map'
    webpack.debug = true

    webpackConfig.devServer = {
      inline:true,
      host: '0.0.0.0',
      port: port
    };

    webpackConfig.entry['app'].push('webpack-dev-server/client?http://0.0.0.0:' + port);
    webpackConfig.entry['app'].push('webpack/hot/only-dev-server');

    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
  }

  if(env === 'production') {
    webpackConfig.plugins.push(
      new webpackManifest('/', 'public'),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      })/*,
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
    )
  }

  return webpackConfig
}
