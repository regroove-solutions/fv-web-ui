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
import classNames from 'classnames';

import provide from 'react-redux-provide';

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

import DialectDropDown from 'views/components/Navigation/DialectDropDown';
import Login from 'views/components/Navigation/Login';
import AppLeftNav from 'views/components/Navigation/AppLeftNav';

@provide
export default class Navigation extends Component {

  static propTypes = {
    toggleMenuAction: PropTypes.func.isRequired,
    properties: PropTypes.object.isRequired,
    computeLogin: PropTypes.object.isRequired
  };

  /*static childContextTypes = {
    client: React.PropTypes.object,
    muiTheme: React.PropTypes.object,
    siteProps: React.PropTypes.object
  };

  static contextTypes = {
      muiTheme: React.PropTypes.object.isRequired,
      siteProps: React.PropTypes.object.isRequired
  };

  getChildContext() {
    return {
      //client: this.props.clientStore.client,
      muiTheme: this.context.muiTheme,
      siteProps: this.context.siteProps
    };
  }*/

  constructor(props, context){
    super(props, context);

    this._handleMenuToggle = this._handleMenuToggle.bind(this);
    this.handleChangeRequestLeftNav = this.handleChangeRequestLeftNav.bind(this);
    this.handleRequestChangeList = this.handleRequestChangeList.bind(this);
  }

  _handleMenuToggle (event) {
    //console.log(event);

    //const test = this.props.toggle("helloworld");
    //console.log(test);

    /*this.setState({
      leftNavOpen: !this.state.leftNavOpen,
    });*/
  }

  handleChangeRequestLeftNav(open) {
    console.log('ok2!');
    this.setState({
      leftNavOpen: open,
    });
  }

  handleRequestChangeList(event, value) {
    console.log('ok!');
    //this.context.router.push(value);
    this.setState({
      leftNavOpen: false,
    });
  }

  render() {

    let LoginCont = <Login label="Sign in"/>;

    /*if (this.props.computeLogin.newState === 'test') {
      LoginCont = "Welcome " + this.props.computeLogin + "! ";
    }*/

    return <div>
        <AppBar
          title={this.props.properties.title}
          onLeftIconButtonTouchTap={() => this.props.toggleMenuAction("AppLeftNav")}>

          <ToolbarGroup>
            {LoginCont}
            <TextField ref="navigationSearchTextField" hintText="Search:" onEnterKeyDown={this._handleTextFieldSubmit} />
            
            <IconMenu
                iconButtonElement={
                  <IconButton><MoreVertIcon /></IconButton>
                }
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
              >
                <MenuItem primaryText="Refresh" />
                <MenuItem primaryText="Help" />
                <MenuItem primaryText="Sign out" />
            </IconMenu>
          </ToolbarGroup>

        </AppBar>

        <Toolbar>

          <ToolbarGroup float="right">
            <DialectDropDown />
          </ToolbarGroup>

        </Toolbar>

        <AppLeftNav
          test="me1!"
          menu={{main: true}}
          open={false}
          //onRequestChangeLeftNav={this.handleChangeRequestLeftNav}
          //onRequestChangeList={this.handleRequestChangeList}
          docked={false} />
    </div>;
  }
}