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

export default class PageToolbar extends Component {

  static propTypes = {
    computeEntity: PropTypes.object.isRequired,
    computePermissionEntity: PropTypes.object,
    computeLogin: PropTypes.object.isRequired,
    handleNavigateRequest: PropTypes.func.isRequired,
    publishToggleAction: PropTypes.func.isRequired,
    enableToggleAction: PropTypes.func.isRequired,
    disableWorkflowActions: PropTypes.bool,
    children: PropTypes.node,
    label: PropTypes.string
  };

  static defaultProps = {
    disableWorkflowActions: false
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
    ['_documentActionsToggleEnabled', '_documentActionsTogglePublished', '_documentActionsStartWorkflow', '_publishChanges'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  /**
  * Publish changes directly
  */
  _publishChanges() {
    this.props.publishToggleAction(true, false, selectn('response.path', this.props.computeEntity));
  }

  /**
  * Toggle document (enabled/disabled)
  */
  _documentActionsToggleEnabled(event, toggled) {

    this.setState({
      enabledToggled: toggled
    });

    this.props.enableToggleAction(toggled, false, selectn('response.path', this.props.computeEntity));
  }

  /**
  * Toggle published document
  */
  _documentActionsTogglePublished(event, toggled) {
    
    this.setState({
      publishedToggled: toggled
    });

    this.props.publishToggleAction(toggled, false, selectn('response.path', this.props.computeEntity));
  }

  /**
  * Start a workflow
  */
  _documentActionsStartWorkflow(workflow, event) {

    const path = selectn('response.path', this.props.computeEntity);

    switch (workflow) {
      case 'enable':
        this.props.enableToggleAction(true, true, path);
      break;

      case 'disable':
        this.props.enableToggleAction(false, true, path);
      break;

      case 'publish':
        this.props.publishToggleAction(true, true, path);
      break;

      case 'unpublish':
        this.props.publishToggleAction(false, true, path);
      break;
    }
  }

  render() {

    const { computeEntity, computePermissionEntity, computeLogin } = this.props;

    let toolbarGroupItem = {
      float: 'left',
      margin: `${(this.context.muiTheme.toolbar.height - this.context.muiTheme.button.height) / 2}px ${this.context.muiTheme.baseTheme.spacing.desktopGutter}px`,
      position: 'relative'
    }

    let documentEnabled = (this.state.enabledToggled == null) ? (selectn('response.state', computeEntity) == 'Enabled') : this.state.enabledToggled;
    let documentPublished = (this.state.publishedToggled == null) ? (selectn('response.state', computeEntity) == 'Published') : this.state.publishedToggled;

    const permissionEntity = (selectn('response', computePermissionEntity)) ? computePermissionEntity : computeEntity;

    return <Toolbar>

                  <ToolbarGroup float="left">

                    {this.props.children}

                    {(() => {
                      if (!this.props.disableWorkflowActions) {

                          return <AuthorizationFilter filter={{role: 'Record', entity: selectn('response', permissionEntity), login: computeLogin}} style={toolbarGroupItem}>

                            <div>

                              <span style={{paddingRight: '15px'}}>REQUEST: </span>

                              <RaisedButton label="Enable" disabled={selectn('response.state', computeEntity) != 'Disabled' && selectn('response.state', computeEntity) != 'New'} style={{marginRight: '5px', marginLeft: '0'}} secondary={true} onTouchTap={this._documentActionsStartWorkflow.bind(this, 'enable')} />
                              <RaisedButton label="Disable" disabled={selectn('response.state', computeEntity) != 'Enabled' && selectn('response.state', computeEntity) != 'New'} style={{marginRight: '5px', marginLeft: '0'}} secondary={true} onTouchTap={this._documentActionsStartWorkflow.bind(this, 'disable')} />
                              <RaisedButton label="Publish" disabled={selectn('response.state', computeEntity) != 'Enabled'} style={{marginRight: '5px', marginLeft: '0'}} secondary={true} onTouchTap={this._documentActionsStartWorkflow.bind(this, 'publish')} />
                              <RaisedButton label="Unpublish" disabled={selectn('response.state', computeEntity) != 'Published'} style={{marginRight: '5px', marginLeft: '0'}} secondary={true} onTouchTap={this._documentActionsStartWorkflow.bind(this, 'unpublish')} />

                            </div>

                          </AuthorizationFilter>;
                      }
                    })()}

                    <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', permissionEntity)}} style={toolbarGroupItem}>
                      <div style={{display:'inline-block', float: 'left', margin: '17px 5px 10px 5px', position:'relative'}}>
                        <Toggle
                          toggled={documentEnabled || documentPublished}
                          onToggle={this._documentActionsToggleEnabled}
                          ref="enabled"
                          disabled={documentPublished}
                          name="enabled"
                          value="enabled"
                          label="Enabled"/>
                      </div>
                    </AuthorizationFilter>

                    <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', permissionEntity)}} style={toolbarGroupItem}>
                      <div style={{display:'inline-block', float: 'left', margin: '17px 5px 10px 5px', position:'relative'}}>
                        <Toggle
                          toggled={documentPublished}
                          onToggle={this._documentActionsTogglePublished}
                          disabled={!documentEnabled && !documentPublished}
                          name="published"
                          value="published"
                          label="Published"/>
                      </div>
                    </AuthorizationFilter>

                  </ToolbarGroup>

                  <ToolbarGroup float="right">

                    <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', permissionEntity)}} style={toolbarGroupItem}>
                      <RaisedButton disabled={!documentPublished} label="Publish Changes" style={{marginRight: '5px', marginLeft: '0'}} secondary={true} onTouchTap={this._publishChanges} />
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
