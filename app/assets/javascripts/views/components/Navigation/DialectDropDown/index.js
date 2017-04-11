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

import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import Popover from 'material-ui/lib/popover/popover';

import RaisedButton from 'material-ui/lib/raised-button';
import ActionGrade from 'material-ui/lib/svg-icons/action/grade';
import DropDownArrow from 'material-ui/lib/svg-icons/navigation/arrow-drop-down';
import DefaultRawTheme from 'material-ui/lib/styles/raw-themes/light-raw-theme'
import ThemeManager from 'material-ui/lib/styles/theme-manager';

import {SelectableContainerEnhance} from 'material-ui/lib/hoc/selectable-enhance';

let SelectableList = SelectableContainerEnhance(List);

export default class DialectDropDown extends Component {

  static propTypes = {
    label: PropTypes.string.isRequired,
    computeLogin: PropTypes.object.isRequired,
    properties: PropTypes.object.isRequired,
    actionFunc: PropTypes.func.isRequired,
    dialects: PropTypes.array.isRequired,
    routeParams: PropTypes.object
  };

  static contextTypes = {
    muiTheme: PropTypes.object
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      open: false,
      dropdownData: []
    };

    ['_onNavigateRequest', '_groupedDialects'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  _onNavigateRequest(event, path) {
    this.setState({open: false});
    this.props.actionFunc('/explore' + path);
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

  _groupedDialects(dialects) {
      let dropdownData = dialects.map(function( dialect ) {

        let dialectTitle = selectn('properties.dc:title', dialect);
        let dialectUid = dialect.uid;
        let parentLanguage = selectn('contextParameters.ancestry.language.dc:title', dialect);

        let rightIcon = null;

        if ( ProviderHelpers.isActiveRole(selectn('contextParameters.dialect.roles', dialect)) ) {
          rightIcon = <ActionGrade />;
        }

        if (parentLanguage) {
          return (<ListItem value={dialect.path} key={dialectUid} rightIcon={rightIcon} language={parentLanguage} primaryText={dialectTitle} />);
        }
      });

      if (dropdownData) {
        dropdownData = _.pairs(_.groupBy(dropdownData, function(item){
          if (item)
            return item.props.language;
        }));
      }

      return dropdownData;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.dialects != nextProps.dialects) {
      this.setState({
        dropdownData: this._groupedDialects(nextProps.dialects)
      })
    }
  }

  componentDidMount() {
      this.setState({
        dropdownData: this._groupedDialects(this.props.dialects)
      })
  }
  
  

  render() {

    let { dialects } = this.props;

    return <div>
        <RaisedButton onTouchTap={this.handleTouchTap.bind(this)} label={this.props.label}>
          <DropDownArrow />
        </RaisedButton>

        <Popover
          open={this.state.open} 
          onRequestClose={this.handleRequestClose.bind(this)} 
          anchorEl={this.state.anchorEl}
          anchorOrigin={{'horizontal':'left','vertical':'bottom'}}
          targetOrigin={{'horizontal':'middle','vertical':'bottom'}}>
          {this.state.dropdownData.length > 0 ? <SelectableList
            style={{maxHeight: '550px', minWidth:'300px'}}
            valueLink={{
              value: location.pathname,
              requestChange: this._onNavigateRequest
          }}>
              {this.state.dropdownData.map(function(menuGroup, index) {
                return <ListItem initiallyOpen={true} key={index} value={false} primaryText={menuGroup[0]} nestedItems={menuGroup[1]} />;
              })}
          </SelectableList> : <div style={{maxHeight: '550px', minWidth:'300px'}}>Loading...</div>}
        </Popover>
      </div>;
  }
}