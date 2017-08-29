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
import provide from 'react-redux-provide';
import selectn from 'selectn';

// Components
import Popover from 'material-ui/lib/popover/popover';
import FlatButton from 'material-ui/lib/flat-button';
import IconButton from 'material-ui/lib/icon-button';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';

import ActionExitToAppIcon from 'material-ui/lib/svg-icons/action/exit-to-app';

import CircularProgress from 'material-ui/lib/circular-progress';

@provide
export default class Login extends Component {

  static propTypes = {
    pushWindowPath: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    computeLogin: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    properties: PropTypes.object.isRequired,
    computeLogout: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    routeParams: PropTypes.object
  };

  componentDidUpdate(prevProps) {
    //if (prevProps.userStore.currentUser !== this.props.userStore.currentUser) {
    //  this._handleClose();
    //}
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      open: false,
      anchorEl: null,
      loginAttempted: false
    };

    ['_handleOpen','_handleClose','_handleLogin','_handleLogout','_onNavigateRequest'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  _handleOpen(event){

    event.preventDefault();

    this.setState({
      anchorEl: event.currentTarget,
      open: true
    });
  }

  _handleClose(){
    this.setState({
      open: false
    });
  }

  _handleLogin() {

    let username = this.refs.username.getValue();
    let password = this.refs.password.getValue();
    
    if ( username !== null && password !== null) {
      this.setState({loginAttempted: true});
      this.props.login(username, password);
    }

    this._handleClose();
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

    this._handleClose();
    this.props.pushWindowPath(dest);
  }

  render() {

    const themePalette = this.props.properties.theme.palette.rawTheme.palette;

    let loginFeedbackMessage = "";

    if (this.props.computeLogin.isFetching || this.props.computeLogout.isFetching) {
      return <div style={{display: "inline-block", paddingRight: "10px"}}>Processing request...</div>;
    }

    // Handle success (anonymous or actual)
    if (this.props.computeLogin.success && this.props.computeLogin.isConnected) {

        return (
          <div className="hidden-xs" style={{display: "inline-block", paddingRight: '15px'}}>
            Welcome <strong><a style={{color: '#000'}} onTouchTap={this._onNavigateRequest.bind(this, 'profile')}>{selectn("response.properties.username", this.props.computeLogin)}</a></strong>!
          </div>
        );
    } else {
      if (this.state.loginAttempted) {
          loginFeedbackMessage = "Username or password incorrect.";

        if (this.props.computeLogin.isError) {
          loginFeedbackMessage = this.props.computeLogin.error;
        }
      }
    }

    return (
      <div style={{display: "inline-block", paddingRight: "10px", paddingTop: '15px'}}>
        <FlatButton label={this.props.label} style={{color: themePalette.alternateTextColor}} onTouchTap={this._handleOpen} />

        <Popover open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this._handleClose}>

          <div style={{padding:20}}>

            <h2>Sign in</h2>

            <div><TextField ref="username" hintText="Username:" /></div>
            <div><TextField ref="password" type="password" hintText="Password:" /></div>

            <p>{loginFeedbackMessage}</p>

            <RaisedButton onTouchTap={this._handleClose} primary={false} label="Cancel"/> 
            <RaisedButton primary={true} onTouchTap={this._handleLogin} label="Sign in"/>

            <FlatButton label="Register" style={{color: themePalette.alternateTextColor}} onTouchTap={this._onNavigateRequest.bind(this, 'register')} />

            <p style={{paddingTop: '10px', marginTop: '10px', borderTop: '1px dashed #dadada', textAlign: 'right', fontSize: '0.9em'}}><a style={{color: '#000', cursor: 'pointer'}} onTouchTap={this._onNavigateRequest.bind(this, 'forgotpassword')}>Forgot your password?</a></p>

          </div>

        </Popover>

      </div>
    );
  }
}