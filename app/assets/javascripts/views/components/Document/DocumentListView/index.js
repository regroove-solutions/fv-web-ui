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
import classNames from 'classnames';
import selectn from 'selectn';
import DataGrid from 'react-datagrid';

import ClearFix from 'material-ui/lib/clearfix';
import Paper from 'material-ui/lib/paper';

// is TapEvent needed here?! Test on mobile
//var injectTapEventPlugin = require("react-tap-event-plugin");
//injectTapEventPlugin();

// Stylesheet
import '!style!css!react-datagrid/dist/index.min.css';

/**
* Set some initial values
*/

var GRID_PROPERTIES  = {
	SELECTED_ID: null, 
	PAGE: 1,
  PAGE_SIZE: 10
};

const GRID_PROPERTIES_DEFAULT = Object.assign({}, GRID_PROPERTIES);;

export default class DocumentListView extends Component {

  constructor(props, context) {
    super(props, context);

    // Bind methods to 'this'
    ['_handleSelectionChange', '_onPageChange', '_onPageSizeChange', 'resetGrid'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  _handleSelectionChange(newSelectedId, data){
    GRID_PROPERTIES.SELECTED_ID = newSelectedId;
    this.props.onSelectionChange(data);
  }

  _onPageChange(page) {
    GRID_PROPERTIES.PAGE = page;
    this.props.refetcher(this.props, (GRID_PROPERTIES.PAGE - 1), GRID_PROPERTIES.PAGE_SIZE);
  }

  _onPageSizeChange(pageSize, props) {

    if (pageSize > GRID_PROPERTIES.PAGE_SIZE){
        GRID_PROPERTIES.PAGE = Math.min(GRID_PROPERTIES.PAGE, Math.ceil(this.props.data.response.totalSize / pageSize));
    }

    GRID_PROPERTIES.PAGE_SIZE = pageSize;

    // Refresh data
    this.props.refetcher(this.props, (GRID_PROPERTIES.PAGE - 1), GRID_PROPERTIES.PAGE_SIZE);
  }
  
  resetGrid() {
	  GRID_PROPERTIES = GRID_PROPERTIES_DEFAULT;
  }

  componentWillUnmount() {
    this.resetGrid();
  }
  
  render() {

    // Styles
    var DataGridStyles = {
      minHeight:"70vh",
      zIndex: 0
    };

    return <Paper>
        <ClearFix>
        <DataGrid
          idProperty="uid"
          dataSource={selectn('response.entries', this.props.data)}
          dataSourceCount={selectn('response.totalSize', this.props.data)}
          columns={this.props.columns}
          rowHeight="55"
          style={DataGridStyles}
          selected={GRID_PROPERTIES.SELECTED_ID}
          onSelectionChange={this._handleSelectionChange}
          onColumnOrderChange={this.props.onColumnOrderChange}
          onSortChange={this.props.onSortChange}
          pagination={true}
          sortInfo={this.props.sortInfo}
          page={GRID_PROPERTIES.PAGE}
          pageSize={GRID_PROPERTIES.PAGE_SIZE}
          onPageChange={this._onPageChange}
          onPageSizeChange={this._onPageSizeChange}
          emptyText={'No records'}
          showCellBorders={true} />
        </ClearFix>
    </Paper>;
  }
}