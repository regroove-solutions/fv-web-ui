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
import React from 'react';
import _ from 'underscore';

// Views / Components

import Popover from 'material-ui/lib/popover/popover';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';

export default class Login extends React.Component {

  static contextTypes = {
      client: React.PropTypes.object,
      muiTheme: React.PropTypes.object,
      router: React.PropTypes.object,
      siteProps: React.PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      open: false,
    };

    this._handleOpen = this._handleOpen.bind(this);
    this._handleClose = this._handleClose.bind(this);
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

  render() {

    const actions = [
      <FlatButton
        label="Cancel"
        secondary={true}
        onTouchTap={this._handleClose} />,
      <FlatButton
        label="Sign in"
        primary={true}
        onTouchTap={this._handleClose} />,
    ];

    return (
      <div style={{display: "inline-block", paddingRight: "10px"}}>
        <FlatButton label={this.props.label} onTouchTap={this._handleOpen} />

<Popover open={this.state.open}
  anchorEl={this.state.anchorEl}
  anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
  targetOrigin={{horizontal: 'left', vertical: 'top'}}
  onRequestClose={this._handleClose} >
  <div style={{padding:20}}>
    <h2>Sign in</h2>
    <p>
      <div><TextField hintText="Username:" /></div>
      <div><TextField hintText="Password:" /></div>
    </p>
    <RaisedButton onTouchTap={this._handleClose} primary={false} label="Cancel"/> 
    <RaisedButton primary={true} label="Sign in"/>
  </div>
</Popover>


      </div>
    );
  }
}