'use strict';

// RequireJS configuration
require.config({
  paths: {}
});

define('init', function(require) {

  
  var router = require('./routes');
  var NavView = require('./views/nav');
  var FooterView = require('./views/footer');


  // Create Navigation View
  new NavView();

  // Create Footer View
  new FooterView();

  // Use GET and POST to support all browsers
  // Also adds '_method' parameter with correct HTTP headers
  Backbone.emulateHTTP = true;

  // Start listening to route changes
  Backbone.history.start();

  // Set up global click event handler to use pushState for links
  // use 'data-bypass' attribute on anchors to allow normal link behavior
  $(document).on('click', 'a:not([data-bypass])', function(event) {

    var href = $(this).attr('href');
    var protocol = this.protocol + '//';

    if (href.slice(protocol.length) !== protocol) {
      event.preventDefault();
      router.navigate(href, true);
    }

  });

  $('.modal-trigger').leanModal();

  console.log('Welcome to Yeogurt');
});

// Initialize the application.
require(['init']);
