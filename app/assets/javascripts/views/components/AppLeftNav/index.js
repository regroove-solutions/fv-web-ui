import React from 'react';
import _ from 'underscore';

import Divider from 'material-ui/lib/divider';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import LeftNav from 'material-ui/lib/left-nav';
import AppBar from 'material-ui/lib/app-bar';

import { SelectableContainerEnhance } from 'material-ui/lib/hoc/selectable-enhance';

let SelectableList = SelectableContainerEnhance(List);

export default class AppLeftNav extends React.Component {

  static contextTypes = {
      siteProps: React.PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);

    // Get routes that match this menu
    let routesWithMenus = _.filter(props.routes[0].childRoutes, function(route){
      return _.findWhere(route.menus, props.menu) != undefined; });

    this.state = {
      open: props.open,
      routes: routesWithMenus
    };
  }

  render() {
    return (
      <LeftNav 
        docked={false}
        open={this.props.open}
        onRequestChange={this.props.onRequestChangeLeftNav}
        >
          <AppBar title={this.context.siteProps.title}/>

          <SelectableList
            valueLink={{
              value: location.pathname,
              requestChange: this.props.onRequestChangeList
          }}>

            {this.state.routes.map((d, i) => 
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