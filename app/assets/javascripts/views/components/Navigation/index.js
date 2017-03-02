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
import selectn from 'selectn';

import provide from 'react-redux-provide';

import ProviderHelpers from 'common/ProviderHelpers';

import Shepherd from 'tether-shepherd';

// Components
import AppBar from 'material-ui/lib/app-bar';

import TextField from 'material-ui/lib/text-field';

import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';

import Badge from 'material-ui/lib/badge';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import RaisedButton from 'material-ui/lib/raised-button';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import NotificationsIcon from 'material-ui/lib/svg-icons/social/notifications';
import ActionHelp from 'material-ui/lib/svg-icons/action/help';
import Popover from 'material-ui/lib/popover/popover';

import DialectDropDown from 'views/components/Navigation/DialectDropDown';
import Login from 'views/components/Navigation/Login';
import AppLeftNav from 'views/components/Navigation/AppLeftNav';

@provide
export default class Navigation extends Component {

  static propTypes = {
    pushWindowPath: PropTypes.func.isRequired,
    replaceWindowPath: PropTypes.func.isRequired,    
    splitWindowPath: PropTypes.array.isRequired,    
    toggleMenuAction: PropTypes.func.isRequired,
    fetchUserTasks: PropTypes.func.isRequired,
    properties: PropTypes.object.isRequired,
    computeLogin: PropTypes.object.isRequired,
    computeUserTasks: PropTypes.object.isRequired,
    computeLoadGuide: PropTypes.object.isRequired,
    routeParams: PropTypes.object
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

    this.state = {
      hintTextSearch: "Search site:",
      guidePopoverOpen: false,
      guidePopoverAnchorEl: null
    };

    this._handleMenuToggle = this._handleMenuToggle.bind(this);
    this.handleChangeRequestLeftNav = this.handleChangeRequestLeftNav.bind(this);
    this.handleRequestChangeList = this.handleRequestChangeList.bind(this);
    this._handleNavigationSearchSubmit = this._handleNavigationSearchSubmit.bind(this);
    this._startTour = this._startTour.bind(this);
    //this._test = this._test.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.computeLogin != this.props.computeLogin) {
      this.props.fetchUserTasks(selectn('response.id', newProps.computeLogin));
    }
  }

  _handleMenuToggle (event) {
    //console.log(event);

    //const test = this.props.toggle("helloworld");
    //console.log(test);

    /*this.setState({
      leftNavOpen: !this.state.leftNavOpen,
    });*/
  }

  _onNavigateRequest(path) {
    this.props.pushWindowPath(path);
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

  _startTour(tourContent) {

      this.setState({guidePopoverOpen: false});

      let newTour = new Shepherd.Tour({
        defaults: {
          classes: 'shepherd-theme-arrows'
        }
      });

      (selectn('properties.fvguide:steps', tourContent) || []).map(function(step, i) {
        newTour.addStep('step' + i, {
          title: selectn('title', step),
          text: selectn('text', step),
          attachTo: selectn('attachTo', step),
          advanceOn: selectn('advanceOn', step),
          showCancelLink: selectn('showCancelLink', step)
        });
      });

      newTour.start();
  }

  _handleNavigationSearchSubmit() {
	  let searchQueryParam = this.refs.navigationSearchField.getValue();	  
      let path = "/" + this.props.splitWindowPath.join("/");
      let queryPath = "";    
      
      // Do a global search in either the workspace or section
      if(path.includes("/explore/FV/Workspaces/Data")) {
    	  queryPath = "/explore/FV/Workspaces/Data"
      }      
      else if(path.includes("/explore/FV/sections/Data")) {
    	  queryPath = "/explore/FV/sections/Data"
      }
      else {
    	  queryPath = "/explore/FV/sections/Data"    	  
      }
      
      // Clear out the input field
      this.refs.navigationSearchField.setValue("");
	  this.props.replaceWindowPath(queryPath + '/search/' + searchQueryParam); 
  } 

  render() {

    const computeUserTasks = ProviderHelpers.getEntry(this.props.computeUserTasks, selectn('response.id', this.props.computeLogin));

    const userTaskCount = selectn('response.length', computeUserTasks) || 0;
    const guideCount = selectn('response.resultsCount', this.props.computeLoadGuide) || 0;

    return <div>
        <AppBar
          title={this.props.properties.title}
          onLeftIconButtonTouchTap={() => this.props.toggleMenuAction("AppLeftNav")}>

          <ToolbarGroup>
            <Login label="Sign in"/>

            <ToolbarSeparator style={{float: 'none', marginLeft: 0, marginRight: 0}} />

            <Badge
              badgeContent={userTaskCount}
              style={{top: '8px', left: '0', padding: '0 0 12px 12px'}}
              badgeStyle={{top: '12px',left: '42px', width: '15px', height: '15px', borderRadius: '25%', visibility: (userTaskCount == 0) ? 'hidden' : 'visible'}}
              primary={true}
            >
              <IconButton onTouchTap={this._onNavigateRequest.bind(this, '/tasks/')} disabled={(userTaskCount == 0) ? true : false} tooltip="Active Tasks">
                <NotificationsIcon />
              </IconButton>
            </Badge>

            <Badge
              badgeContent={guideCount}
              style={{top: '8px', left: '-15px', padding: '0 0 12px 12px'}}
              badgeStyle={{top: '12px',left: '42px', width: '15px', height: '15px', borderRadius: '25%', visibility: (guideCount == 0) ? 'hidden' : 'visible'}}
              primary={true}
            >
              <IconButton onTouchTap={(e) => this.setState({guidePopoverOpen: !this.state.guidePopoverOpen, guidePopoverAnchorEl: e.target})} disabled={(guideCount == 0) ? true : false} tooltip="Guides">
                <ActionHelp />
              </IconButton>
            </Badge>

            <Popover
            open={this.state.guidePopoverOpen}
            anchorEl={this.state.guidePopoverAnchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
          >
            <div>
              <div className={classNames('panel', 'panel-default')} style={{marginBottom: 0}}>
  <div className="panel-heading">
    <h3 className="panel-title">Interactive Guides</h3>
  </div>
  <div className="panel-body">
    <p>Learn how to use this page quickly and efficiently:</p>
    <table>
      <tbody>
      {(selectn('response.entries', this.props.computeLoadGuide) || []).map(function(guide, i) {
        return <tr key={'guide' + i}>
        <td>{selectn('properties.dc:title', guide)}<br/>{selectn('properties.dc:description', guide)}</td>
        <td><RaisedButton onTouchTap={this._startTour.bind(this, guide)} primary={false} label="Launch Guide"/></td>
        </tr>;
      }.bind(this))}
</tbody>
      </table>
    
  </div>
</div>
              
            </div>
          </Popover>

            <ToolbarSeparator style={{float: 'none', marginRight: '30px', marginLeft: 0}} />

            {/* KeymanWeb workaround for hinttext not disappearing */}
            <TextField ref="navigationSearchField" hintText={this.state.hintTextSearch} onBlur={() => this.setState({hintTextSearch: 'Search:'})} onFocus={() => this.setState({hintTextSearch: ''})} onEnterKeyDown={this._handleNavigationSearchSubmit} />

            {/*<IconMenu
                iconButtonElement={
                  <IconButton><MoreVertIcon /></IconButton>
                }
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
              >
                <MenuItem primaryText="Refresh" />
                <MenuItem primaryText="Help" />
                <MenuItem primaryText="Sign out" />
            </IconMenu>*/}
          </ToolbarGroup>

        </AppBar>

        <Toolbar>

          <ToolbarGroup float="right">
            <DialectDropDown routeParams={this.props.routeParams} />
          </ToolbarGroup>

        </Toolbar>

        <AppLeftNav
          menu={{main: true}}
          open={false}
          //onRequestChangeLeftNav={this.handleChangeRequestLeftNav}
          //onRequestChangeList={this.handleRequestChangeList}
          docked={false} />
    </div>;
  }
}