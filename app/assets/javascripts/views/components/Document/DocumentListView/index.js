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
import classNames from 'classnames';
import DataGrid from 'react-datagrid';

import ClearFix from 'material-ui/lib/clearfix';
import Paper from 'material-ui/lib/paper';

// is TapEvent needed here?!
//var injectTapEventPlugin = require("react-tap-event-plugin");
//injectTapEventPlugin();

// Stylesheet
import '!style!css!react-datagrid/dist/index.min.css';

/**
* Set some initial values
*/
var SELECTED_ID = null;
var PAGE = 1;
var PAGE_SIZE = 20;

class DocumentListView extends React.Component {

  static contextTypes = {
      client: React.PropTypes.object.isRequired,
      muiTheme: React.PropTypes.object.isRequired,
      router: React.PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);

    // Grant access to object inside methods
    this._onSelectionChange = this._onSelectionChange.bind(this);
    this._onPageChange = this._onPageChange.bind(this);
    this._onPageSizeChange = this._onPageSizeChange.bind(this);

    // Hide columns for responsive view!!
    this.state = {
      dataSource: props.onDataRequest(props, PAGE, PAGE_SIZE),
      dataSourceCount: null
    };

    // Get and set data count
    props.onDataCountRequest(props).then((function(count){
          this.setState({
            dataSourceCount: count
          });
    }).bind(this));
  }

  _onSelectionChange(newSelectedId, data){
    SELECTED_ID = newSelectedId;
    this.props.onSelectionChange(newSelectedId);
  }

  _onPageChange(page) {
    PAGE = page;
    this.setState({
      dataSource: this.props.onDataRequest(this.props, PAGE, PAGE_SIZE)
    });
  }

  _onPageSizeChange(pageSize, props) {
    if (pageSize > PAGE_SIZE){
        //when page size gets bigger, the page may not exist
        //so make sure you update that as well
        PAGE = Math.min(PAGE, Math.ceil(this.state.dataSourceCount / pageSize));
    }
    PAGE_SIZE = pageSize;
    this.setState({
      dataSource: this.props.onDataRequest(this.props, PAGE, PAGE_SIZE)
    });
  }

  render() {
    var HTML = null;

    // Styles
    var DataGridStyles = {
      minHeight:"70vh",
      zIndex: 0
    };

    if (!this.state.dataSourceCount === null) {
      HTML = <div>Loading...</div>;
    }
    else if (this.state.dataSourceCount == 0) {
      HTML = <div>No {(this.props.objectDescriptions) ? this.props.objectDescriptions : "items"} found.</div>;
    }
    else {
      HTML = <Paper>
        <ClearFix>
        <DataGrid
          idProperty="id"
          dataSource={this.state.dataSource}
          dataSourceCount={this.state.dataSourceCount}
          columns={this.props.columns}
          rowHeight="55"
          style={DataGridStyles}
          selected={SELECTED_ID}
          onSelectionChange={this._onSelectionChange}
          pagination={true}
          page={PAGE}
          pageSize={PAGE_SIZE}
          onPageChange={this._onPageChange}
          onPageSizeChange={this._onPageSizeChange}
          emptyText={'No records'}
          showCellBorders={true} />
        </ClearFix>
      </Paper>
    }

    return HTML;
  }
}

module.exports = DocumentListView;