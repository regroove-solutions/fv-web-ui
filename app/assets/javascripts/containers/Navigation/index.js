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
import classNames from 'classnames';

// Components
import AppBar from 'material-ui/lib/app-bar';

import TextField from 'material-ui/lib/text-field';

import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';

import DropDownMenu from 'material-ui/lib/DropDownMenu';
import RaisedButton from 'material-ui/lib/raised-button';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';

import Navigation1 from 'views/components/Navigation/';

import DialectDropDown from 'views/components/Navigation/DialectDropDown';
import Login from 'views/components/Navigation/Login';
import AppLeftNav from 'views/components/Navigation/AppLeftNav';

export default class Navigation extends React.Component {

  static childContextTypes = {
    client: React.PropTypes.object,
    muiTheme: React.PropTypes.object,
    siteProps: React.PropTypes.object
  };

  static contextTypes = {
      muiTheme: React.PropTypes.object.isRequired,
      router: React.PropTypes.object.isRequired,
      siteProps: React.PropTypes.object.isRequired
  };

  getChildContext() {
    console.log(this.props.clientStore);
    return {
      client: this.props.clientStore.client,
      muiTheme: this.context.muiTheme,
      siteProps: this.context.siteProps
    };
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      leftNavOpen: false
    };

    this.handleTouchTapLeftIconButton = this.handleTouchTapLeftIconButton.bind(this);
    this.handleChangeRequestLeftNav = this.handleChangeRequestLeftNav.bind(this);
    this.handleRequestChangeList = this.handleRequestChangeList.bind(this);
  }

  handleTouchTapLeftIconButton () {
    this.setState({
      leftNavOpen: !this.state.leftNavOpen,
    });
  }

  handleChangeRequestLeftNav(open) {
    this.setState({
      leftNavOpen: open,
    });
  }

  handleRequestChangeList(event, value) {
    this.context.router.push(value);
    this.setState({
      leftNavOpen: false,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
console.log('render');
    let LoginCont = <Login label="Sign in"/>;

    if (this.props.userStore.currentUser.isAnonymous != null && !this.props.userStore.currentUser.isAnonymous) {
      LoginCont = "Welcome " + this.props.userStore.currentUser.properties.username + "! ";
    }

    return <Navigation1 />;
  }
}