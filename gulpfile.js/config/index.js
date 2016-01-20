var config = {}

config.publicDirectory = "./public";
config.sourceDirectory = "./app";

config.assetsDirectory = "/assets";
config.javascriptDirectory = "/javascripts";
config.stylesheetsDirectory = "/stylesheets";

config.publicAssets    = config.publicDirectory + config.assetsDirectory;
config.sourceAssets    = config.sourceDirectory + config.assetsDirectory;

module.exports = config;
