import React from 'react';
import classNames from 'classnames';

import AppBar from 'material-ui/lib/app-bar';

import TextField from 'material-ui/lib/text-field';

import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';

import DropDownMenu from 'material-ui/lib/DropDownMenu';
import RaisedButton from 'material-ui/lib/raised-button';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import DialectDropDown from 'views/components/Common/DialectDropDown';
import AppLeftNav from 'views/components/AppLeftNav';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';

export default class Navigation extends React.Component {
  static contextTypes = {
      client: React.PropTypes.object.isRequired,
      muiTheme: React.PropTypes.object.isRequired,
      router: React.PropTypes.object.isRequired,
      siteProps: React.PropTypes.object.isRequired
  };

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

  render() {

    return <div>
        <AppBar
          title={this.context.siteProps.title}
          onLeftIconButtonTouchTap={this.handleTouchTapLeftIconButton}>

          <ToolbarGroup float="right">
            <TextField hintText="Search:" />
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
          menu={{main: true}}
          open={this.state.leftNavOpen}
          onRequestChangeLeftNav={this.handleChangeRequestLeftNav}
          onRequestChangeList={this.handleRequestChangeList}
          routes={this.props.routes}
          docked={false} />
    </div>;
  }
}