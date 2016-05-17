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
import ConfGlobal from 'conf/local.json';
import selectn from 'selectn';

import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import RaisedButton from 'material-ui/lib/raised-button';
import Toggle from 'material-ui/lib/toggle';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import IconButton from 'material-ui/lib/icon-button';
import NavigationExpandMoreIcon from 'material-ui/lib/svg-icons/navigation/expand-more';

import AuthorizationFilter from 'views/components/Document/AuthorizationFilter';

/**
* Header for dialect pages
*/
export default class PageToolbar extends Component {

  static propTypes = {
    computeEntity: PropTypes.object.isRequired,
    handleNavigateRequest: PropTypes.func.isRequired,
    publishToggleAction: PropTypes.func.isRequired,
    enableToggleAction: PropTypes.func.isRequired,
    label: PropTypes.string
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired
  };

  constructor(props, context){
    super(props, context);

    this.state = {
      enabledToggled: null,
      publishedToggled: null
    };

    // Bind methods to 'this'
    ['_dialectActionsToggleEnabled', '_dialectActionsTogglePublished'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  /**
  * Toggle dialect (enabled/disabled)
  */
  _dialectActionsToggleEnabled(event, toggled) {

    this.setState({
      enabledToggled: toggled
    });

    this.props.enableToggleAction(toggled);
  }

  /**
  * Toggle published dialect
  */
  _dialectActionsTogglePublished(event, toggled) {
    this.setState({
      publishedToggled: toggled
    });

    this.props.publishToggleAction(toggled);
  }

  render() {

    const { computeEntity } = this.props;

    let toolbarGroupItem = {
      float: 'left',
      margin: `${(this.context.muiTheme.toolbar.height - this.context.muiTheme.button.height) / 2}px ${this.context.muiTheme.baseTheme.spacing.desktopGutter}px`,
      position: 'relative'
    }

    let dialectEnabled = (this.state.enabledToggled == null) ? (selectn('response.state', computeEntity) == 'Enabled') : this.state.enabledToggled;
    let dialectPublished = (this.state.publishedToggled == null) ? (selectn('response.state', computeEntity) == 'Published') : this.state.publishedToggled;

    return <Toolbar>

                  <ToolbarGroup float="left">

                    <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', computeEntity)}} style={toolbarGroupItem}>
                      <div style={{display:'inline-block', float: 'left', margin: '17px 5px 10px 5px', position:'relative'}}>
                        <Toggle
                          toggled={dialectEnabled || dialectPublished}
                          onToggle={this._dialectActionsToggleEnabled}
                          ref="enabled"
                          disabled={dialectPublished}
                          name="enabled"
                          value="enabled"
                          label="Enabled"/>
                      </div>
                    </AuthorizationFilter>

                    <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', computeEntity)}} style={toolbarGroupItem}>
                      <div style={{display:'inline-block', float: 'left', margin: '17px 5px 10px 5px', position:'relative'}}>
                        <Toggle
                          toggled={dialectPublished}
                          onToggle={this._dialectActionsTogglePublished}
                          disabled={!dialectEnabled && !dialectPublished}
                          name="published"
                          value="published"
                          label="Published"/>
                      </div>
                    </AuthorizationFilter>

                  </ToolbarGroup>

                  <ToolbarGroup float="right">

                    <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', computeEntity)}} style={toolbarGroupItem}>
                      <RaisedButton disabled={!dialectPublished} label="Publish Changes" style={{marginRight: '5px', marginLeft: '0'}} secondary={true} onTouchTap={this._portalActionsPublish} />
                    </AuthorizationFilter>

                    <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', computeEntity)}} style={toolbarGroupItem}>
                      <RaisedButton label={"Edit " + this.props.label} style={{marginRight: '5px', marginLeft: '0'}} primary={true} onTouchTap={this.props.handleNavigateRequest.bind(this, this.props.windowPath.replace('sections', 'Workspaces') + '/edit')} />
                    </AuthorizationFilter>

                    <ToolbarSeparator />

                    <IconMenu iconButtonElement={
                      <IconButton tooltip="More Options" touch={true}>
                        <NavigationExpandMoreIcon />
                      </IconButton>
                    }>
                      <MenuItem onTouchTap={this.props.handleNavigateRequest.bind(this, this.props.windowPath + '/reports')} primaryText="Reports" />
                    </IconMenu>
                    
                  </ToolbarGroup>

                </Toolbar>;
  }
}
