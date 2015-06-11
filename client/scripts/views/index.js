define(function() {
  'use strict';

  var IndexView = Backbone.View.extend({

    el: '#app-wrapper',

    template: JST['client/templates/index.jst'],

    events: {
      'click .button-collapse': 'showMenu'
    },

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html(this.template);

      React.render(
        React.createElement(MyWidget),
        this.$('#react-test').get(0)
      );

      return this;
    },

    showMenu: function() {
      alert('test');
    }

  });

  return IndexView;
});
