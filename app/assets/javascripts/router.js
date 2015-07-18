'use strict';

var Backbone = require('backbone');
var Router = require('./router');

var AppWrapper = require('./views/AppWrapper');

var AppRouter = Backbone.Router.extend({
  initialize: function(app) {
  	this.app = app;
  },
  routes: {
    '': 'index',
    'browse': 'browse',
    'browse/:language': 'browseLanguage',
    'browse/word/:word': 'browseWord',
    'get-started': 'getStarted',
    'contribute': 'contribute',
    'contribute/edit/:word': 'editWord',
    'contribute/:language/word': 'contributeWord',
    'play': 'play',
    'play/:language/:game': 'playGame',
  },
  index: function() {
    this.app.appWrapper.changePage('')
  },
  browse: function() {
    this.app.appWrapper.changePage('browse');
  },
  play: function() {
    this.app.appWrapper.changePage('play');
  },
  playGame: function(language, game){
    this.app.appWrapper.changePage('play/game', {
      'routeParams': {'game' : game, 'language' : language}
    });
  },
  browseLanguage: function(language){
    this.app.appWrapper.changePage('browse/language', {
      'routeParams': {'language' : language}
    });
  },
  browseWord: function(word){
    this.app.appWrapper.changePage('browse/word', {
      'routeParams': {'word' : word}
    });
  },
  getStarted: function() {
    this.app.appWrapper.changePage('introduction');
  },
  contribute: function() {
    this.app.appWrapper.changePage('contribute');
  },
  editWord: function(word){
    this.app.appWrapper.changePage('contribute/edit/word', {
      'routeParams': {'word' : word}
    });
  },
  contributeWord: function(language) {
    this.app.appWrapper.changePage('contribute/word', {
      'routeParams': {'language' : language}
    });
  }
});

module.exports = AppRouter;
