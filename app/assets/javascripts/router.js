'use strict';

var Backbone = require('backbone');
var React = require('react');
var Router = require('./router');

var AppWrapper = require('./views/AppWrapper');
var ListView = require('./views/components/ListView');

var AppRouter = Backbone.Router.extend({
  initialize: function(app) {
  	this.app = app;
  },
  routes: {
    '': 'index',
    'browse': 'browse'
  },
  index: function() {
    this.app.appWrapper.changePage('')
  },
  browse: function() {
    this.app.appWrapper.changePage('browse');
  }
});

module.exports = AppRouter;
