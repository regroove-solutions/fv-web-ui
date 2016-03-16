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

import provide from 'react-redux-provide';

import {Divider, List, ListItem, LeftNav, AppBar} from 'material-ui/lib';
import { SelectableContainerEnhance } from 'material-ui/lib/hoc/selectable-enhance';

let SelectableList = SelectableContainerEnhance(List);

@provide
export default class AppLeftNav extends Component {

  static propTypes = {
    navigateTo: PropTypes.func.isRequired,
    computeNavigateTo: PropTypes.object.isRequired,
    toggleMenuAction: PropTypes.func.isRequired,
    computeToggleMenuAction: PropTypes.object.isRequired,
    properties: PropTypes.object.isRequired,
    pushWindowPath: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);

    // Bind methods to 'this'
    ['_onNavigateRequest', '_onRequestChange'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  _onNavigateRequest(event, path) {

    // Request to navigate to
    this.props.navigateTo(path);

    // Close side-menu
    this.props.toggleMenuAction();
  }

  _onRequestChange() {
    // Close side-menu
    this.props.toggleMenuAction();
  }

  componentWillReceiveProps(nextProps) {
    // Push new url if not null
    if (nextProps.computeNavigateTo.path != null) {
      nextProps.pushWindowPath(nextProps.computeNavigateTo.path);
    }
  }

  render() {

    // TODO: Externalize these
    const routes = [
      {
        label: "Get Started",
        path: "/get-started/"
      },
      {
        label: "Explore",
        path: "/explore/"
      },
      {
        label: "Contribute",
        path: "/contribute/"
      },
      {
        label: "Play",
        path: "/play/"
      }
    ];

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

            {routes.map((d, i) => 
                <ListItem
                  key={d.path}
                  value={d.path}
                  primaryText={d.label} />
            )}

          </SelectableList>

          <Divider />

      </LeftNav>
    );
  }
}