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
    'explore': 'exploreFamilies',
    'explore/:family': 'exploreFamily',
    'explore/:family/:language': 'exploreLanguage', 
    'explore/:family/:language/:dialect': 'exploreDialect',         
    'browse/:language': 'browseLanguage',
    'browse/word/:word': 'browseWord',
    'get-started': 'getStarted',
    'contribute': 'contribute',
    'contribute/edit/:word': 'editWord',
    'contribute/:language/word': 'contributeWord',
    'play/:language': 'play',
    'play/:language/:game/:category': 'playGame',
  },
  index: function() {
    this.app.appWrapper.changePage('')
  },
  browse: function() {
    this.app.appWrapper.changePage('browse');
  },
  play: function(language) {
    this.app.appWrapper.changePage('play', {
      'routeParams': {'language' : language}
    });
  },
  playGame: function(language, game, category){
    this.app.appWrapper.changePage('play/game', {
      'routeParams': {'game' : game, 'language' : language, 'category' : category}
    });
  }, 
  browseLanguage: function(language){
    this.app.appWrapper.changePage('browse/language', {
      'routeParams': {'language' : language}
    });
  },
  exploreFamilies: function(){
	    this.app.appWrapper.changePage('explore/families');
  },   
  exploreFamily: function(family){
	this.app.appWrapper.changePage('explore/family', {
	  'routeParams': {'family' : family}
	});
  },  
  exploreLanguage: function(family, language){
	this.app.appWrapper.changePage('explore/language', {
	  'routeParams': {'family' : family, 'language' : language}
	});
  },
  exploreDialect: function(family, language, dialect){
		this.app.appWrapper.changePage('explore/dialect', {
		  'routeParams': {'family' : family, 'language' : language, 'dialect' : dialect}
		});
	  },    
  browseWord: function(word){
    this.app.appWrapper.changePage('browse/word', {
      'routeParams': {'word' : word}
    });
  },
  getStarted: function() {
    this.app.appWrapper.changePage('get-started');
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
