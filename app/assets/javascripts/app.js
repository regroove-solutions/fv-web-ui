'use strict';

var Backbone = require('backbone');
var React = require('react');
var Router = require('./router');
//var $ = require('jquery');

var AppWrapper = require('./views/AppWrapper');

var injectTapEventPlugin = require("react-tap-event-plugin");

require('!style!css!normalize.css');

require('bootstrap/less/bootstrap');
require("styles/main");

var app = {
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
        // Render essential views for layout
        this.appWrapper = React.render(<AppWrapper router={this.router} title="First Voices" />, document.getElementById('app-wrapper'));

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

        return this;
    }
};

module.exports = app;
app.init();