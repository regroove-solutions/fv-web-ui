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
import React, {Component, PropTypes} from 'react';
import _ from 'underscore';
import selectn from 'selectn';
import provide from 'react-redux-provide';

// Components
import Divider from 'material-ui/lib/divider';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item';

import AutoComplete from 'material-ui/lib/auto-complete';

import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import Popover from 'material-ui/lib/popover/popover';

import RaisedButton from 'material-ui/lib/raised-button';
import DropDownArrow from 'material-ui/lib/svg-icons/navigation/arrow-drop-down';
import DefaultRawTheme from 'material-ui/lib/styles/raw-themes/light-raw-theme'
import ThemeManager from 'material-ui/lib/styles/theme-manager';

import {SelectableContainerEnhance} from 'material-ui/lib/hoc/selectable-enhance';

let SelectableList = SelectableContainerEnhance(List);

@provide
export default class DialectDropDown extends Component {

  static propTypes = {
    navigateTo: PropTypes.func.isRequired,
    fetchDialectsAll: PropTypes.func.isRequired,
    computeDialectsAll: PropTypes.object.isRequired,
    computeLogin: PropTypes.object.isRequired,
    properties: PropTypes.object.isRequired,
    pushWindowPath: PropTypes.func.isRequired
  };

  static contextTypes = {
    muiTheme: PropTypes.object
  };


  function () {}

  constructor(props, context) {
    super(props, context);

    this.state = {
      open: false,
    };

    ['_onNavigateRequest'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  fetchData(newProps) {

    let fetchPath = 'sections/';

    if (selectn("isConnected", newProps.computeLogin)) {
      fetchPath = 'Workspaces/';
    }

    newProps.fetchDialectsAll('/' + newProps.properties.domain + '/' + fetchPath);
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props);
  }

  // Refetch if logged in
  componentWillReceiveProps(nextProps) {
    if (nextProps.computeLogin.isConnected !== this.props.computeLogin.isConnected && nextProps.computeLogin.isConnected != undefined) {
      this.fetchData(nextProps);
    }
  }

  _onNavigateRequest(event, path) {
    this.setState({open: false});
    this.props.pushWindowPath('/explore' + path);
  }

  handleTouchTap(event){
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  }

  handleRequestClose(){
    this.setState({
      open: false,
    });
  }

  shouldComponentUpdate(newProps) {
    return newProps.computeDialectsAll.success; 
  }

  render() {

    let dropdownData;

    // Create new operations object
    const { computeDialectsAll } = this.props;
    let dialects = selectn('response.entries', computeDialectsAll);

    if (dialects) {

      dropdownData = dialects.map(function( dialect ) {

        let dialectTitle = selectn('properties.dc:title', dialect);
        let dialectUid = dialect.uid;
        let parentLanguage = selectn('contextParameters.ancestry.language.dc:title', dialect);

        if (parentLanguage) {
          return (<ListItem value={dialect.path} key={dialectUid} language={parentLanguage} primaryText={dialectTitle} />);
        }
      });

      if (dropdownData) {
        dropdownData = _.pairs(_.groupBy(dropdownData, function(item){
          if (item)
            return item.props.language;
        }));
      }
    }


    let content = "";

    if (selectn('response.entries.length', this.props.computeDialectsAll) > 0) {

      content = <div>
        <RaisedButton onTouchTap={this.handleTouchTap.bind(this)} label="Browse Dialects...">
          <DropDownArrow />
        </RaisedButton>

        <Popover
          open={this.state.open} 
          onRequestClose={this.handleRequestClose.bind(this)} 
          anchorEl={this.state.anchorEl}
          anchorOrigin={{'horizontal':'left','vertical':'bottom'}}
          targetOrigin={{'horizontal':'middle','vertical':'bottom'}}>
          <SelectableList
            style={{maxHeight: '550px'}}
            valueLink={{
              value: location.pathname,
              requestChange: this._onNavigateRequest
          }}>
              {dropdownData.map(function(menuGroup, index) {
                return <ListItem initiallyOpen={true} key={index} value={false} primaryText={menuGroup[0]} nestedItems={menuGroup[1]} />;
              })}
          </SelectableList>
        </Popover>
      </div>;
    }


    return (
      <div>
        {content}
      </div>
    );
  }
}