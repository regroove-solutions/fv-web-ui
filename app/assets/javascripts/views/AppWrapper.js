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
import ReactDOM from 'react-dom';
import provide from 'react-redux-provide';

import AppFrontController from './AppFrontController';

// Components & Themes
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import ThemeDecorator from 'material-ui/lib/styles/theme-decorator';

import FirstVoicesTheme from 'views/themes/FirstVoicesTheme.js';
import Navigation from 'views/components/Navigation';
import Footer from 'views/components/Navigation/Footer';


const getPosition = function getPosition() {
    var doc = document, w = window;
    var x, y, docEl;
    
    if ( typeof w.pageYOffset === 'number' ) {
        x = w.pageXOffset;
        y = w.pageYOffset;
    } else {
        docEl = (doc.compatMode && doc.compatMode === 'CSS1Compat')?
                doc.documentElement: doc.body;
        x = docEl.scrollLeft;
        y = docEl.scrollTop;
    }
    return {x:x, y:y};
};

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

    // Set KeymanWeb to manual mode -- no auto-attaching to inputs
    KeymanWeb.SetMode('manual');

    this.state = {
      kmw: KeymanWeb
    };
  }

  KWControlChange() {
    KeymanWeb.SetActiveKeyboard(KWControl.value);
  }

  KWHelpClick(event) {

    KeymanWeb.SetActiveKeyboard('Keyboard_Tsilhqotin_kmw');

    if (KeymanWeb.IsHelpVisible()) {
      KeymanWeb.HideHelp();
    }
    else {
      KeymanWeb.ShowHelp(window.innerWidth - 500, getPosition().y + 200);
      KeymanWeb.FocusLastActiveElement();
    }

  }

  componentDidMount() {

    setTimeout(function () {

      const scriptKeymanWebDialect = document.createElement("script");

      scriptKeymanWebDialect.src = "http://www.firstvoices.com/kmw/Tsilhqotin-Xeni-Gwetin_kmw.js";
      scriptKeymanWebDialect.async = true;
      scriptKeymanWebDialect.onload = this.keyboardLoaded;

      document.body.appendChild(scriptKeymanWebDialect);

      window.onscroll = function() {
        KeymanWeb.SetHelpPos(window.innerWidth - 500,getPosition().y + 200);
      };

    }.bind(this), 0)
  }

  render() {
    return <div>
      <Navigation />
      <div className="main">
        <AppFrontController />
        <div id="test" style={{position: 'fixed', bottom: '0', right: '0', zIndex: '9999'}}>
          <para>Keyboard: <select id='KWControl' onChange={this.KWControlChange}><option value="Keyboard_Tsilhqotin_kmw">TESTA</option></select>
          <img src='form_help.jpg' onTouchTap={this.KWHelpClick} /></para>
        </div>
      </div>
      <Footer />
    </div>;
  }
}