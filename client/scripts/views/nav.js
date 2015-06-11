define(function() {
  'use strict';

  var NavView = Backbone.View.extend({

    el: '#nav-wrapper',

    template: JST['client/templates/common/nav.jst'],

    events: {},

    initialize: function() {
      this.render();

      // Initialize collapse button
      $('.button-collapse').sideNav();
    },

    render: function() {
      this.$el.html(this.template);
      return this;
    }

  });

  return NavView;
});
