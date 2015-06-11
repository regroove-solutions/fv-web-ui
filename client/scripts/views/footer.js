define(function() {
  'use strict';

  var FooterView = Backbone.View.extend({

    el: '#footer-wrapper',

    template: JST['client/templates/common/footer.jst'],

    events: {},

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html(this.template);
      return this;
    }

  });

  return FooterView;
});
