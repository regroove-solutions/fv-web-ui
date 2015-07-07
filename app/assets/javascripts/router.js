'use strict';

var Backbone = require('backbone');
var React = require('react');
var Router = require('./router');

var AppWrapper = require('./views/AppWrapper');
//var ListView = require('./views/components/ListView');

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
    'contribute': 'contribute'
  },
  index: function() {
    this.app.appWrapper.changePage('')
  },
  browse: function() {
    this.app.appWrapper.changePage('browse');
  },
  browseLanguage: function(language){
    this.app.appWrapper.changePage('browse/language', { 'routeParams': {'language' : language} });
  },
  browseWord: function(word){
    this.app.appWrapper.changePage('browse/word', { 'routeParams': {'word' : word} });
  },
  getStarted: function() {
    this.app.appWrapper.changePage('introduction');
  },
  contribute: function() {
    this.app.appWrapper.changePage('contribute');
  }
});

module.exports = AppRouter;
