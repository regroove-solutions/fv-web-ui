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

// Models
import Dialect from 'models/Dialect';
import Dialects from 'models/Dialects';

// Operations
import DirectoryOperations from 'operations/DirectoryOperations';

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
export default class DialectDropDown extends React.Component {

  static propTypes = {
    navigateTo: PropTypes.func.isRequired,
    fetchDocuments: PropTypes.func.isRequired,
    computeDocuments: PropTypes.object.isRequired
  };

  static contextTypes = {
    muiTheme: React.PropTypes.object
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      open: false,
    };

    this.props.fetchDocuments('/FV/sections/', 'FVDialect');

    ['_onNavigateRequest'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  _onNavigateRequest(event, path) {
    this.setState({open: false});
    //this.props.navigateTo(path);
    location.assign(path);
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
    // Only render (expensive) method when results are ready.
    return newProps.computeDocuments.success; 
  }

  render() {

    let dropdownData;

    // Create new operations object
    const { computeDocuments } = this.props;
    let dialects = selectn('response.entries', computeDocuments);

    if (dialects) {

      dropdownData = dialects.map(function( dialect ) {

        let dialectTitle = selectn('properties.dc:title', dialect);
        let dialectUid = dialect.uid;
        let parentLanguage = selectn('contextParameters.ancestry.language.dc:title', dialect);

        let splitPath = dialect.path.split('/');

        if (parentLanguage) {
          return (<ListItem value={'/explore/' + splitPath[splitPath.length - 3] + "/" + splitPath[splitPath.length-2] + "/" + splitPath[splitPath.length - 1]} key={dialectUid} language={parentLanguage} primaryText={dialectTitle} />);
        }
      });

      if (dropdownData) {
        dropdownData = _.pairs(_.groupBy(dropdownData, function(item){
          return item.props.language;
        }));
      }
    }


    let content = "";

    if (selectn('response.entries', this.props.computeDocuments)) {

      content = <div>
        <RaisedButton onTouchTap={this.handleTouchTap.bind(this)}  label="Browse Dialects...">
          <DropDownArrow />
        </RaisedButton>

        <Popover
          open={this.state.open} 
          onRequestClose={this.handleRequestClose.bind(this)} 
          anchorEl={this.state.anchorEl}
          anchorOrigin={{'horizontal':'left','vertical':'bottom'}}
          targetOrigin={{'horizontal':'middle','vertical':'bottom'}}>
          <SelectableList
            valueLink={{
              value: location.pathname,
              requestChange: this._onNavigateRequest
          }}>
              {dropdownData.map(function(menuGroup, index) {
                return <ListItem initiallyOpen={true} key={index} value={index} primaryText={menuGroup[0]} nestedItems={menuGroup[1]} />;
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