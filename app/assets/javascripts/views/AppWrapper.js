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
import selectn from 'selectn';

import AppFrontController from './AppFrontController';

// Components & Themes
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import ThemeDecorator from 'material-ui/lib/styles/theme-decorator';

import FirstVoicesTheme from 'views/themes/FirstVoicesTheme.js';
import FontIcon from 'material-ui/lib/font-icon';
import Footer from 'views/components/Navigation/Footer';
import Paper from 'material-ui/lib/paper';
import FlatButton from 'material-ui/lib/flat-button';

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
    getUser: PropTypes.func.isRequired,
    computeDialectsAll: PropTypes.object.isRequired
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
      kmw: KeymanWeb,
      kmwSelectedKeyboard: null,
      kmwLoadedKeyboards: []
    };

    // Bind methods to 'this'
    ['_KMWSwitchKeyboard', '_KMWToggleKeyboard'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  /**
  * Load keymanweb keyboard dynamically
  */ 
  _KMWSwitchKeyboard(event) {

    let index = event.nativeEvent.target.selectedIndex;
    let newState = {
      kmwSelectedKeyboard: event.target[index].value
    };

    if (event.nativeEvent.target[index].dataset.keyboardFile) {
      const scriptKeymanWebDialect = document.createElement("script");

      // Only load keyboard if it hasn't been loaded before
      if (this.state.kmwLoadedKeyboards.indexOf(event.target[index].value) === -1) {
        scriptKeymanWebDialect.src = event.target[index].dataset.keyboardFile;
        scriptKeymanWebDialect.async = true;

        document.body.appendChild(scriptKeymanWebDialect);

        // Add keyboard to loaded keyboard array
        newState['kmwLoadedKeyboards'] = this.state.kmwLoadedKeyboards.concat([event.target[index].value]);
      }

      this.setState(newState);
    }
  }

  _KMWToggleKeyboard(event) {

    KeymanWeb.SetActiveKeyboard(this.state.kmwSelectedKeyboard);

    if (KeymanWeb.IsHelpVisible()) {
      KeymanWeb.HideHelp();
    }
    else {
      KeymanWeb.ShowHelp(window.innerWidth - 500, getPosition().y + 200);
      KeymanWeb.FocusLastActiveElement();
    }

  }

  componentDidMount() {
    window.onscroll = function() {
      KeymanWeb.SetHelpPos(window.innerWidth - 500,getPosition().y + 200);
    };
  }

  render() {

    let dialectsWithKeyboards;
    let keyboardPicker;

    if (selectn('response.entries', this.props.computeDialectsAll)) {

      dialectsWithKeyboards = selectn('response.entries', this.props.computeDialectsAll).filter(function(dialect){
        return selectn('properties.fvdialect:keymanweb.length', dialect) > 0;
      });

      if (dialectsWithKeyboards.length > 0) {
        keyboardPicker = <Paper zDepth={1} id="kmw-switcher" style={{position: 'fixed', bottom: '0', right: '0', zIndex: '9999', padding: '5px 15px'}}>

          Select Keyboard:

          <select ref="kmw_keyboard_select" style={{marginLeft: '8px'}} id='KWControl' onChange={this._KMWSwitchKeyboard}>

            <option>Select from list:</option>

            {dialectsWithKeyboards.map(function(dialect){
              let keyboards = selectn('properties.fvdialect:keymanweb', dialect);

              return keyboards.map(function(keyboard) {
                return <option value={keyboard['key']} data-keyboard-file={keyboard['jsfile']}>{keyboard['name']}</option>;
              });
            })}

          </select>

          <FlatButton style={{marginLeft: '8px'}} onTouchTap={this._KMWToggleKeyboard} label="Show" />

        </Paper>;
      }
    }

    return <div>
        <AppFrontController />
        {keyboardPicker}
        <Footer />
    </div>;
  }
}