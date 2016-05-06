/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React, { Component, PropTypes } from 'react';
import provide from 'react-redux-provide';

import AppFrontController from './AppFrontController';

// Components & Themes
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import ThemeDecorator from 'material-ui/lib/styles/theme-decorator';

import FirstVoicesTheme from 'views/themes/FirstVoicesTheme.js';
import Navigation from 'views/components/Navigation';
import Footer from 'views/components/Navigation/Footer';


@ThemeDecorator(ThemeManager.getMuiTheme(FirstVoicesTheme))
@provide
export default class AppWrapper extends Component {

  static propTypes = {
    connect: PropTypes.func.isRequired,
    getUser: PropTypes.func.isRequired
  };

  static childContextTypes = {
    muiTheme: React.PropTypes.object,
    kmw: React.PropTypes.object
  };

  /**
  * Pass essential context to all children
  */
  getChildContext() {

    let newContext = {
      muiTheme: ThemeManager.getMuiTheme(FirstVoicesTheme),
      kmw: this.state.kmw
    };

    return newContext;
  }

  constructor(props, context) {
    super(props, context);

    // Connect to Nuxeo
    this.props.connect();
    this.props.getUser();

    this.state = {
      // kmw: tavultesoft.keymanweb // version 2.0
      kmw: KeymanWeb // version 1.0
    };
  }

  componentDidMount() {

    setTimeout(function () {
      
      // Keymanweb v1.0

      const scriptKeymanWebDialect = document.createElement("script");

      scriptKeymanWebDialect.src = "http://www.firstvoices.com/kmw/Tsilhqotin-Xeni-Gwetin_kmw.js";
      scriptKeymanWebDialect.async = true;
      scriptKeymanWebDialect.onload = this.keyboardLoaded;

      document.body.appendChild(scriptKeymanWebDialect);

      /*
      // Keymanweb v2.0

      var _this = this;

      (function(kmw) {
        kmw.init();
        kmw.addKeyboards('@eng');
        kmw.addKeyboards('fv_dakelh_kmw');
      })(tavultesoft.keymanweb);
      */

    }.bind(this), 0)
  }

  render() {
    return <div>
      <Navigation />
      <div className="main">
        <AppFrontController />
      </div>
      <Footer />
    </div>;
  }
}