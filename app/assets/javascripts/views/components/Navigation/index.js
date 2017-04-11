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
import ConfGlobal from 'conf/local.json';

import provide from 'react-redux-provide';

import ProviderHelpers from 'common/ProviderHelpers';
import UIHelpers from 'common/UIHelpers';

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
import FlatButton from 'material-ui/lib/flat-button';

import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import NotificationsIcon from 'material-ui/lib/svg-icons/social/notifications';
import ActionHelp from 'material-ui/lib/svg-icons/action/help';
import Popover from 'material-ui/lib/popover/popover';
import Avatar from 'material-ui/lib/avatar';

import AuthenticationFilter from 'views/components/Document/AuthenticationFilter';

import DialectDropDown from 'views/components/Navigation/DialectDropDown';
import Login from 'views/components/Navigation/Login';
import AppLeftNav from 'views/components/Navigation/AppLeftNav';

@provide
export default class Navigation extends Component {

  static defaultProps = {
    frontpage: false
  }

  static propTypes = {
    pushWindowPath: PropTypes.func.isRequired,
    replaceWindowPath: PropTypes.func.isRequired,    
    splitWindowPath: PropTypes.array.isRequired,    
    toggleMenuAction: PropTypes.func.isRequired,
    countTotalTasks: PropTypes.func.isRequired,
    computeCountTotalTasks: PropTypes.object.isRequired,
    properties: PropTypes.object.isRequired,
    computeLogin: PropTypes.object.isRequired,
    computeLoadGuide: PropTypes.object.isRequired,
    computePortal: PropTypes.object,
    fetchDialects: PropTypes.func.isRequired,
    computeDialects: PropTypes.object.isRequired,
    routeParams: PropTypes.object,
    frontpage: PropTypes.bool
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
      hintTextSearch: "Search site: ",
      browseLabel: "Dialects...",
      searchBarVisibleInMobile: false,
      guidePopoverOpen: false,
      guidePopoverAnchorEl: null,
      userRegistrationTasksPath: '/management/registrationRequests/',
      pathOrId: '/' + props.properties.domain + '/' + selectn('routeParams.area', props)
    };

    this._handleMenuToggle = this._handleMenuToggle.bind(this);
    this.handleChangeRequestLeftNav = this.handleChangeRequestLeftNav.bind(this);
    this.handleRequestChangeList = this.handleRequestChangeList.bind(this);
    this._handleNavigationSearchSubmit = this._handleNavigationSearchSubmit.bind(this);
    this._startTour = this._startTour.bind(this);
    this._fetchData = this._fetchData.bind(this);
  }

  _fetchData(props = this.props){
    let fetchPath = selectn('routeParams.area', props);

    if (!fetchPath) {
      if (selectn("isConnected", props.computeLogin)) {
        fetchPath = 'Workspaces';
      } else {
        fetchPath = 'sections';
      }
    }

    const pathOrId = '/' + props.properties.domain + '/' + fetchPath;

    this.setState({
      browseLabel: ((fetchPath == 'Workspaces') ? 'Workspace Dialects...' : 'Published Dialects...'),
      pathOrId: pathOrId
    });

    props.fetchDialects(pathOrId);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.computeLogin != this.props.computeLogin && newProps.computeLogin.isConnected) {
      this.props.countTotalTasks('count_total_tasks', {'query':'SELECT COUNT(ecm:uuid) FROM TaskDoc, FVUserRegistration WHERE (ecm:currentLifeCycleState = \'opened\' OR ecm:currentLifeCycleState = \'created\')', 'language': 'nxql', 'sortOrder': 'ASC'});
    }

    const USER_LOG_IN_STATUS_CHANGED = (newProps.computeLogin.isConnected !== this.props.computeLogin.isConnected && newProps.computeLogin.isConnected != undefined);

    if (USER_LOG_IN_STATUS_CHANGED || newProps.routeParams.area != this.props.routeParams.area) {
      this._fetchData(newProps);
    }
  }

  componentDidMount() {
    this._fetchData();
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

  _handleNavigationSearchSubmit(e) {

    // If search bar is not visible, this button should show it
    if (this.refs.navigationSearchField._getInputNode().offsetParent === null) {
      this.setState({
        searchBarVisibleInMobile: true
      });

      e.preventDefault();
    } else {

      this.setState({
        searchBarVisibleInMobile: false
      });

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

      // Do a dialect search
      if (this.props.routeParams.dialect_path) {
        queryPath = "/explore" + this.props.routeParams.dialect_path;
      }

      // Clear out the input field
      this.refs.navigationSearchField.setValue("");

      if (searchQueryParam && searchQueryParam != '') {
        this.props.replaceWindowPath(queryPath + '/search/' + searchQueryParam); 
      }
    }
  }

  render() {
    const themePalette = this.props.properties.theme.palette.rawTheme.palette;
    const isDialect = this.props.routeParams.hasOwnProperty('dialect_path');
    const isFrontPage = this.props.frontpage;

    const computeCountTotalTasks = ProviderHelpers.getEntry(this.props.computeCountTotalTasks, 'count_total_tasks');
    const computePortal = ProviderHelpers.getEntry(this.props.computePortal, this.props.routeParams.dialect_path + '/Portal');
    const computeDialects = ProviderHelpers.getEntry(this.props.computeDialects, this.state.pathOrId);

    const userTaskCount = selectn('response.entries[0].COUNT(ecm:uuid)', computeCountTotalTasks) || 0;

    const guideCount = selectn('response.resultsCount', this.props.computeLoadGuide) || 0;

    let portalLogo = selectn('response.contextParameters.portal.fv-portal:logo', computePortal);
    let portalTitle = selectn('response.contextParameters.ancestry.dialect.dc:title', computePortal);

    const avatar = (portalLogo) ? <Avatar src={UIHelpers.getThumbnail(portalLogo, 'Thumbnail')} size={50} style={{marginRight: '10px'}} /> : '';

    const title = (portalTitle) ? <a style={{textDecoration: 'none', color: '#fff'}} onTouchTap={this._onNavigateRequest.bind(this, '/explore' + this.props.routeParams.dialect_path)}>{avatar} {portalTitle + " Community Portal"}</a> : this.props.properties.title;

    const hintTextSearch = isDialect ? 'Search dialect:' : this.state.hintTextSearch;

    return <div>
        <AppBar
          title={<span className="hidden-xs">{title}</span>}
          showMenuIconButton={isDialect ? false : true}
          onLeftIconButtonTouchTap={() => this.props.toggleMenuAction("AppLeftNav")}>

          <ToolbarGroup style={{position: 'relative'}}>
            <Login routeParams={this.props.routeParams} label="Sign in"/>

            <ToolbarSeparator className={classNames({'hidden-xs': this.props.computeLogin.isConnected})} style={{float: 'none', marginLeft: 0, marginRight: 0}} />

            <AuthenticationFilter login={this.props.computeLogin} anon={false} routeParams={this.props.routeParams} containerStyle={{display: 'inline'}}>
              <span>
                <Badge
                  badgeContent={userTaskCount}
                  style={{top: '8px', left: '0', padding: '0 0 12px 12px'}}
                  badgeStyle={{top: '12px',left: '42px', width: '15px', height: '15px', borderRadius: '25%', visibility: (userTaskCount == 0) ? 'hidden' : 'visible'}}
                  primary={true}
                >
                  <IconButton onTouchTap={this._onNavigateRequest.bind(this, '/tasks/')} disabled={(userTaskCount == 0) ? true : false}>
                    <NotificationsIcon />
                  </IconButton>
                </Badge>

                <Badge
                  badgeContent={guideCount}
                  style={{top: '8px', left: '-15px', padding: '0 0 12px 12px'}}
                  badgeStyle={{top: '12px',left: '42px', width: '15px', height: '15px', borderRadius: '25%', visibility: (guideCount == 0) ? 'hidden' : 'visible'}}
                  primary={true}
                >
                  <IconButton onTouchTap={(e) => this.setState({guidePopoverOpen: !this.state.guidePopoverOpen, guidePopoverAnchorEl: e.target})} disabled={(guideCount == 0) ? true : false}>
                    <ActionHelp />
                  </IconButton>
                </Badge>
              </span>
            </AuthenticationFilter>

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

            <span className={classNames({'hidden': isFrontPage})}>

            <ToolbarSeparator className="search-bar-seperator" style={{float: 'none', marginRight: 0, marginLeft: 0}} />

            {/* KeymanWeb workaround for hinttext not disappearing */}
            <div style={{background: themePalette.primary1Color, display: 'inline-block'}} className={classNames({'hidden-xs': !this.state.searchBarVisibleInMobile, 'search-bar-mobile': this.state.searchBarVisibleInMobile})}>
              <TextField underlineStyle={{width:'90%'}} style={{marginLeft: (this.state.searchBarVisibleInMobile) ? '15px' : '30px', fontSize: '15px', height: '38px', backgroundColor: '#fff', paddingLeft: '10px', lineHeight: '1', borderRadius: '5px', width: (this.state.searchBarVisibleInMobile) ? '214px' : 'inherit'}} ref="navigationSearchField" hintText={hintTextSearch} onBlur={() => this.setState({hintTextSearch: hintTextSearch })} onFocus={() => this.setState({hintTextSearch: ''})} onEnterKeyDown={this._handleNavigationSearchSubmit} /> 
              <FlatButton className={classNames({'hidden': !this.state.searchBarVisibleInMobile})} label="Cancel" onTouchTap={(e) => {this.setState({searchBarVisibleInMobile: false}); e.preventDefault(); }} />
            </div>

            <IconButton onTouchTap={this._handleNavigationSearchSubmit} iconClassName="material-icons" style={{position:'relative', top: '7px', padding: '0'}} iconStyle={{fontSize: '24px', padding: '3px', borderRadius: '20px', color: themePalette.alternateTextColor, background: themePalette.primary2Color}}>search</IconButton>

            </span>
          </ToolbarGroup>

        </AppBar>

        <Toolbar className={classNames('hidden-xs', {'hidden': isDialect || isFrontPage})}>

          <ToolbarGroup float="right">
            <DialectDropDown
              dialects={selectn('response.entries', computeDialects) || []}
              label={this.state.browseLabel}
              properties={this.props.properties}
              actionFunc={this.props.pushWindowPath}
              computeLogin={this.props.computeLogin}
              routeParams={this.props.routeParams} />
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