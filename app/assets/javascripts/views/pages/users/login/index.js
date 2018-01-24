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
import React, {Component, PropTypes} from 'react';
import Immutable, { List, Map } from 'immutable';
import classNames from 'classnames';
import provide from 'react-redux-provide';
import selectn from 'selectn';
import t from 'tcomb-form';
import {User} from 'nuxeo';

import ProviderHelpers from 'common/ProviderHelpers';
import PromiseWrapper from 'views/components/Document/PromiseWrapper';

// Components
import FlatButton from 'material-ui/lib/flat-button';
import IconButton from 'material-ui/lib/icon-button';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';

import fields from 'models/schemas/fields';
import options from 'models/schemas/options';

/**
* Create user entry
*/
@provide
export default class PageUserLogin extends Component {

  static propTypes = {
    pushWindowPath: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    computeLogin: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    properties: PropTypes.object.isRequired,
    computeLogout: PropTypes.object.isRequired,
    label: PropTypes.string,
    routeParams: PropTypes.object
  };


  constructor(props, context){
    super(props, context);

    this.state = {
      open: false,
      loginAttempted: false,
      loginAttemptCleared: false
    };

    this.anchorEl = null;

    ['_handleLogin','_handleLogout','_onNavigateRequest'].forEach( (method => this[method] = this[method].bind(this)) );
  }


  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props);
  }


  shouldComponentUpdate(newProps, newState) {

    return false;

  }


  fetchData(newProps) {

  }


  _handleLogin() {

    let username = this.refs.username.getValue();
    let password = this.refs.password.getValue();
    
    if (username !== null && password !== null) {
      if (username.length > 0 && password.length > 0) {
        this.setState({loginAttempted: true});
        this.props.login(username, password);
      }
    }
  }


  _handleLogout() {
    this.setState({loginAttempted: false});
    this.props.logout();
  }
  

  _onNavigateRequest(path) {

    let dest = '/' + path + '/';

    if (selectn("routeParams.dialect_path", this.props) && path === 'register') {
      dest = '/explore' + this.props.routeParams.dialect_path + '/' + path;
    }

    this.props.pushWindowPath(dest);
  }


  _returnLoginFormContent() {

    const themePalette = this.props.properties.theme.palette.rawTheme.palette;
    const TextFieldStyle = { border: '1px solid', borderColor: '#a2291d', width: '100%', paddingLeft: '5px', height: '34px', lineHeight: '10px', fontSize: '14px' };
    let loginFeedbackMessage = "";
    let loginStatusMessage = "Sign In Below";

    if (this.props.computeLogin.isFetching || this.props.computeLogout.isFetching) {
      loginStatusMessage = "Processing request...";
    }

    if (this.state.loginAttempted) {
      loginFeedbackMessage = "Username or password incorrect.";
      
      if (this.props.computeLogin.isError) {
        loginFeedbackMessage = this.props.computeLogin.error;
      }
    }

    return (<div>
        <h1>User Login</h1>
        <div style={{"width":"100%"}}>
          <h6>{loginStatusMessage}</h6>
          <div><a style={{"cursor":"pointer", "fontWeight":"100", "fontSize":"14px", "fontWeight":"bold"}} onTouchTap={this._onNavigateRequest.bind(this, "forgotpassword")}>Forgot Password?</a></div>
          <div><TextField style={Object.assign({}, TextFieldStyle, {"margin":"15px 0"})} underlineShow={false} ref="username" hintText="Username" /></div>
          <div><TextField style={TextFieldStyle} underlineShow={false} ref="password" type="password" hintText="Password" /></div>
          <p style={{"margin":"10px 0", "fontSize":"12px", "backgroundColor":themePalette.primary4ColorLightest, "padding":"0 3px"}}>{loginFeedbackMessage}</p>
          <RaisedButton style={{"width":"100%"}} secondary={true} onTouchTap={this._handleLogin} label="Sign in"/>
          <h6 style={{"fontWeight":"500", "paddingTop":"10px"}}>New to FirstVoices?</h6>
          <RaisedButton style={{"width":"100%"}} primary={true} onTouchTap={this._onNavigateRequest.bind(this, "register")} label="Register"/>
        </div>
      </div>);
  }


  _returnLoginSuccessContent() {

    let successMessage = (<div>
      <h1>User Login</h1>
      <div style={{"width":"100%"}}>
        <h6>Login Succesfull</h6>
        <p>You are Signed In.</p>
      </div>
    </div>);

    let userName = selectn("response.properties.firstName", this.props.computeLogin);

    let loginStatusMessage = "Sign In Below";

    // Handle success (anonymous or actual)
    if (this.props.computeLogin.success && this.props.computeLogin.isConnected) {
      loginStatusMessage = "Login Succesfull";
    }

    if(userName) {
      successMessage = (<div>
        <h1>User Login</h1>
        <div style={{"width":"100%"}}>
          <h6>{loginStatusMessage}</h6>
          <p>You are Signed In.</p>
          <p>Welcome, <a style={{'textTransform': 'uppercase', 'cursor': 'pointer'}} onTouchTap={this._onNavigateRequest.bind(this, 'profile')}>{userName}</a>.</p>
        </div>
      </div>);
    }

    return successMessage;

  }


  render() {
    
    let loginPageContent = this._returnLoginFormContent();

    // Handle success (anonymous or actual)
    if (this.props.computeLogin.success && this.props.computeLogin.isConnected) {
      loginPageContent = this._returnLoginSuccessContent();
    }
    else if (this.props.computeLogin.isConnected)
    {
      loginPageContent = this._returnLoginSuccessContent();
    }

    return loginPageContent;
  }
}