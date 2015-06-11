define(function(require) {
  'use strict';
  var IndexView = require('./views/index');

  // Handle displaying and cleaning up views
  var currentView;
  var render = function(view) {
    if (currentView) {
      currentView.close();
    }

    currentView = view;

    $('#app-wrapper').html(currentView.render().$el);
  };

  var Router = Backbone.Router.extend({

    routes: {
      '': 'index'
    },
    index: function() {
      // Render index page
      new IndexView();
    }
  });

  return new Router();
});
