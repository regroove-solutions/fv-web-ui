import React from 'react';
import classNames from 'classnames';
import DataGrid from 'react-datagrid';

// is TapEvent needed here?!
//var injectTapEventPlugin = require("react-tap-event-plugin");
//injectTapEventPlugin();

// Models
import Word from 'models/Word';
import Words from 'models/Words';

// Operations
import WordOperations from 'operations/WordOperations';



// Stylesheet
import '!style!css!react-datagrid/dist/index.min.css';

/**
* Set some initial values
*/
var SELECTED_ID = null;
var PAGE = 1;
var PAGE_SIZE = 50;

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
      dataSourceCount: 0
    };

    WordOperations.getWordCountByDialect(
        context.client,
        props.dialect.get('dc:title'),
        null,
        // Use same schemas to make use of caching
        {'X-NXproperties': 'dublincore, fv-word, fvcore'}
    ).then((function(count){
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
      height:"70vh",
      zIndex: 0
    };

    if (this.state.dataSourceCount == 0) {
      HTML = <div>Loading...</div>;
    } else {
      HTML = <div>
        <div>
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
        </div>
        <div className="pull-right"><small><a href={this.context.client._baseURL + '/nxpath/default/default-domain/workspaces/FVData/' + this.props.family + '/' + this.props.language + '/' + this.props.dialect + '/Dictionary@view_documents?tabIds=%3AFVWordTab'} target="_blank">[View in Nuxeo]</a></small></div>
      </div>
    }

    return HTML;
  }
}

module.exports = DocumentListView;