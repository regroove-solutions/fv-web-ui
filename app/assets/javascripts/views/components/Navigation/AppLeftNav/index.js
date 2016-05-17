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
import Immutable from 'immutable';

import provide from 'react-redux-provide';
import selectn from 'selectn';

import {Divider, List, ListItem, LeftNav, AppBar} from 'material-ui/lib';
import { SelectableContainerEnhance } from 'material-ui/lib/hoc/selectable-enhance';

let SelectableList = SelectableContainerEnhance(List);

@provide
export default class AppLeftNav extends Component {

  static propTypes = {
    toggleMenuAction: PropTypes.func.isRequired,
    computeToggleMenuAction: PropTypes.object.isRequired,
    properties: PropTypes.object.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    computeLogin: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.state = this._getInitialState();

    // Bind methods to 'this'
    ['_onNavigateRequest', '_onRequestChange'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  /**
  * Initial state
  */
  _getInitialState() {

    const routes = Immutable.fromJS([
      {
        id: 'home',
        label: "Home",
        path: "/"
      },
      {
        id: 'get-started',
        label: "Get Started",
        path: "/get-started/"
      },
      {
    	id: 'tasks',
        label: "Tasks",
        path: "/tasks/"
      },      
      {
        id: 'explore',
        label: 'Explore',
        path: '/explore/FV/sections/Data/',
      },
      {
        id: 'contribute',
        label: "Contribute",
        path: "/contribute/"
      },
      {
        id: 'play',
        label: "Play",
        path: "/play/"
      }
    ]);

    return {
      routes: routes
    };
  }

  componentWillReceiveProps(newProps) {
    /**
    * If the user is connected, display modified routes (splitting Explore path)
    */
    if (selectn("isConnected", this.props.computeLogin)) {

      let nestedItems = [
          <ListItem key="Workspaces" value="/explore/FV/Workspaces/Data/" secondaryText={<p>View work in progress or unpublished content.</p>} secondaryTextLines={2} primaryText="Workspace Dialects" />,
          <ListItem key="sections" value="/explore/FV/sections/Data/" secondaryText={<p>View dialects as an end user would view them.</p>} secondaryTextLines={2} primaryText="Published Dialects" />
      ];

      let exploreEntry = this.state.routes.findEntry(function(value, key) {
        return value.get('id') === 'explore';
      });

      let newExploreEntry = exploreEntry[1].set('path', null).set('nestedItems', nestedItems);

      let newState = this.state.routes.set(exploreEntry[0], newExploreEntry);

      this.setState({routes: newState});

    } else {
      // If user logged out, revert to initial state
      this.setState(this._getInitialState());
    }
  }

  _onNavigateRequest(event, path) {

    // Request to navigate to
    this.props.pushWindowPath(path);

    // Close side-menu
    this.props.toggleMenuAction();
  }

  _onRequestChange() {
    // Close side-menu
    this.props.toggleMenuAction();
  }

  render() {

    return (
      <LeftNav 
        docked={false}
        open={this.props.computeToggleMenuAction.menuVisible}
        onRequestChange={this._onRequestChange}
        >
          <AppBar title={this.props.properties.title} />

          <SelectableList
            valueLink={{
              value: location.pathname,
              requestChange: this._onNavigateRequest
          }}>

            {this.state.routes.map((d, i) => 
                <ListItem
                  key={d.get('id')}
                  value={d.get('path')}
                  nestedItems={d.get('nestedItems')}
                  primaryText={d.get('label')} />
            )}

          </SelectableList>

          <Divider />

      </LeftNav>
    );
  }
}