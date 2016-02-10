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
import React from 'react';
import _ from 'underscore';

// Models
import Dialect from 'models/Dialect';
import Dialects from 'models/Dialects';

// Operations
import DirectoryOperations from 'operations/DirectoryOperations';

// Views / Components

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

export default class DialectDropDown extends React.Component {


  static contextTypes = {
      client: React.PropTypes.object,
      muiTheme: React.PropTypes.object,
      router: React.PropTypes.object,
      siteProps: React.PropTypes.object.isRequired
  };


  constructor(props, context) {
    super(props, context);

    this.state = {
      value: 0,
      open: false,
      items: [],
      muiTheme: context.muiTheme ? context.muiTheme : ThemeManager.getMuiTheme(DefaultRawTheme)
    };

    // Create new operations object
    this.dialectOperations = new DirectoryOperations(Dialect, Dialects, context.client, { domain: context.siteProps.domain });

    this.dialectOperations.getDocumentsByPath("/sections", {headers: { 'X-NXenrichers.document': 'ancestry' }}).then((function(dialects){

        var dropdownData = null;

        dropdownData = dialects.map(function( dialect ) {

          var parentLanguageTitle, parentLanguageFamilyTitle;

          if (dialect.get('parentLanguage')) {
            parentLanguageFamilyTitle = dialect.get('parentLanguageFamily').get('dc:title');
            parentLanguageTitle = dialect.get('parentLanguage').get('dc:title');

            return (<ListItem
                      value={'/explore/' + parentLanguageFamilyTitle + '/' + parentLanguageTitle + '/' + dialect.get('dc:title')}
                      key={dialect.get('id')}
                      language={parentLanguageTitle} 
                      primaryText={dialect.get('dc:title')}/>
            );
          }
        });

        if (dropdownData) {

          dropdownData = _.pairs(_.groupBy(dropdownData, function(item){
            return item.props.language;
          }));

          this.setState({
            items: dropdownData
          });

        }

    }).bind(this));

    this._handleRequestChangeDialect = this._handleRequestChangeDialect.bind(this);

  }

  _handleRequestChangeDialect(event, value) {
    this.setState({open: false});
    this.context.router.push(value);
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

    let content = "";

    if (this.state.items.length > 0) {
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
              requestChange: this._handleRequestChangeDialect
          }}>
              {this.state.items.map(function(menuGroup, index) {
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