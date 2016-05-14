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

import ProviderHelpers from 'common/ProviderHelpers';

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
    fetchDialects: PropTypes.func.isRequired,
    computeDialects: PropTypes.object.isRequired,
    computeLogin: PropTypes.object.isRequired,
    properties: PropTypes.object.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    routeParams: PropTypes.object
  };

  static contextTypes = {
    muiTheme: PropTypes.object
  };


  function () {}

  constructor(props, context) {
    super(props, context);

    this.state = {
      open: false,
      browseLabel: 'Dialects...',
      pathOrId: null
    };

    ['_onNavigateRequest'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  fetchData(newProps) {

    let fetchPath = selectn('routeParams.area', newProps);

    if (!fetchPath) {
      if (selectn("isConnected", newProps.computeLogin)) {
        fetchPath = 'Workspaces';
      } else {
        fetchPath = 'sections';
      }
    }

    const pathOrId = '/' + newProps.properties.domain + '/' + fetchPath;

    this.setState({
      browseLabel: ((fetchPath == 'Workspaces') ? 'Workspace Dialects...' : 'Published Dialects...'),
      pathOrId: pathOrId
    });

    newProps.fetchDialects(pathOrId);
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props);
  }

  // Refetch if logged in
  componentWillReceiveProps(nextProps) {

    const USER_LOG_IN_STATUS_CHANGED = (nextProps.computeLogin.isConnected !== this.props.computeLogin.isConnected && nextProps.computeLogin.isConnected != undefined);

    if (USER_LOG_IN_STATUS_CHANGED || nextProps.routeParams.area != this.props.routeParams.area) {
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

  render() {

    let dropdownData;

    let dialects = ProviderHelpers.getEntry(this.props.computeDialects, this.state.pathOrId);

    if (selectn('response.entries', dialects)) {

      dropdownData = selectn('response.entries', dialects).map(function( dialect ) {

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

    if (selectn('response.entries.length', dialects) > 0) {

      content = <div>
        <RaisedButton onTouchTap={this.handleTouchTap.bind(this)} label={this.state.browseLabel}>
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