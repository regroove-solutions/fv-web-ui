'use strict';

var Backbone = require('backbone');
var React = require('react');
var Router = require('./router');
var Nuxeo = require('nuxeo');

var AppWrapper = require('./views/AppWrapper');
var ConfGlobal = require('./configuration/local.json');

var injectTapEventPlugin = require("react-tap-event-plugin");

require('!style!css!normalize.css');

require('bootstrap/less/bootstrap');
require("styles/main");

var app = {

    nuxeoArgs: {
        baseURL: ConfGlobal.baseURL,
        restPath: 'site/api/v1',
        automationPath: 'site/automation',
        auth: {
          method: 'basic',
          username: ConfGlobal.auth.username,
          password: ConfGlobal.auth.password
        },
        timeout: 30000
    },

    init: function () {

		  //Needed for onTouchTap
	   	//Can go away when react 1.0 release
	 	  //Check this repo:
  		//https://github.com/zilverline/react-tap-event-plugin
      injectTapEventPlugin();

	    this.router = new Router(this);

      this.storeClient = new Nuxeo.Client(this.nuxeoArgs);
      this.storeClient.header('X-NXproperties', '*');

      var _this = this;

      /**
      * Workaround for logged in session. Logout before creating a client.
      * Will only work if app and nuxeo on same domain (unless Access-Control-Allow-Origin is set)
      */
      var request = new XMLHttpRequest();

      request.onreadystatechange = (function() {
        if (request.readyState == 4) {
          this.storeClient.connect(function(error, client) {
            if (error) {
              console.log(error);
              throw error;
            }

            _this.appWrapper = React.render(
              <AppWrapper
                client={_this.storeClient}
                router={_this.router}
                title={ConfGlobal.title} />,
            document.getElementById('app-wrapper'));

            Backbone.history.start({pushState: false});

            return _this;
          });
        }
      }).bind(this);

      request.open("GET", ConfGlobal.baseURL + "/logout");
      request.send();
    }
};

module.exports = app;
app.init();