'use strict';

var Backbone = require('backbone');
var React = require('react');
var Router = require('./router');
var Nuxeo = require('nuxeo');
//var $ = require('jquery');

var AppWrapper = require('./views/AppWrapper');

var injectTapEventPlugin = require("react-tap-event-plugin");

require('!style!css!normalize.css');

require('bootstrap/less/bootstrap');
require("styles/main");

var app = {

    nuxeoArgs: {
        baseURL: 'http://ec2-50-112-240-83.us-west-2.compute.amazonaws.com/nuxeo',
        restPath: 'site/api/v1',
        automationPath: 'site/automation',
        auth: {
          method: 'basic',
          username: 'Administrator',
          password: 'X7PcEXuaYsxmgjJ'
        },
        timeout: 3000
    },

    init: function () {

		//Needed for onTouchTap
		//Can go away when react 1.0 release
		//Check this repo:
		//https://github.com/zilverline/react-tap-event-plugin
		injectTapEventPlugin();

        //Backbone.$ = $;

        // Use GET and POST to support all browsers
        // Also adds '_method' parameter with correct HTTP headers
        //Backbone.emulateHTTP = true;

	    //React.render(<AppBarWrapper title="First Voices"/>, document.getElementById('header-container'));
	    //React.render(<LeftNavWrapper/>, document.getElementById('left-nav-container'));
	    this.router = new Router(this);
      this.storeClient = new Nuxeo.Client(this.nuxeoArgs);
      this.storeClient.header('X-NXDocumentProperties', '*');

      var _this = this;

      this.storeClient.connect(function(error, client) {
        if (error) {
          // cannot connect
          throw error;
        }
 
        // OK, the returned client is connected
        _this.appWrapper = React.render(<AppWrapper client={_this.storeClient} router={_this.router} title="First Voices" />, document.getElementById('app-wrapper'));
        // Render essential views for layout
        

        Backbone.history.start({pushState: false});

        // Set up global click event handler to use pushState for links
        // use 'data-bypass' attribute on anchors to allow normal link behavior
        /*$(document).on('click', 'a:not([data-bypass])', function(event) {

            var href = $(this).attr('href');
            var protocol = this.protocol + '//';

            if (href.slice(protocol.length) !== protocol) {
              event.preventDefault();
              app.router.navigate(href, true);
            }

        });*/

        return _this;
      });

    }
};

module.exports = app;
app.init();