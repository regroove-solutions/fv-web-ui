var React = require('react');
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var classNames = require('classnames');
var DataGrid = require('react-datagrid');

var Word = require('models/Word');
var Words = require('models/Words');

var WordOperations = require('../../../operations/WordOperations');

require('!style!css!react-datagrid/dist/index.min.css');

var Link = React.createClass({
  render: function() {
    return <a onTouchTap={this._handleTouchTap}>{this.props.value}</a>
  },

  _handleTouchTap: function() {
    window.router.navigate("browse/word/" + this.props.id , {trigger: true});
  }
});

var columns = [
    { name: 'title', title: 'Word', render: function(v, data, cellProps){
      return <Link id={data.id} key={data.id} value={v} />
    }},
    {
      name: 'fv:definitions', title: 'Definitions', render: function(v, data, cellProps){
      if (v != undefined && v.length > 0) {
        var rows = [];

        for (var i = 0; i < v.length ; ++i) {
          rows.push(<tr><th>{v[i].language}</th><td>{v[i].translation}</td></tr>);
        }

        return  <div><table className="innerRowTable" border="1" cellspacing="5" cellpadding="5" id={data['dc:title']} key={data.id}>
                    {rows}
                </table></div>
      }
    }},
    {
      name: 'fv:literal_translation', title: 'Literal Translation', render: function(v, data, cellProps){
      if (v != undefined && v.length > 0) {
        var rows = [];

        for (var i = 0; i < v.length ; ++i) {
          rows.push(<tr><th>{v[i].language}</th><td>{v[i].translation}</td></tr>);
        }

        return  <div><table className="innerRowTable" id={data['dc:title']} key={data.id}>
                    {rows}
                </table></div>
      }
    }},
    {
      name: 'fv-word:part_of_speech', title: 'Part of Speech'
    },
    {
      name: 'fv-word:pronunciation', title: 'Pronunciation'
    },
    {
      name: 'fv-word:categories', title: 'Categories'
    },
]

/**
* Set some initial values
*/
var SELECTED_ID = null;
var PAGE = 1;
var PAGE_SIZE = 50;

class BrowseDataGrid extends React.Component {

  constructor(props) {
    super(props);

    // Grant access to object inside methods
    this._onSelectionChange = this._onSelectionChange.bind(this);
    this._onPageChange = this._onPageChange.bind(this);
    this._onPageSizeChange = this._onPageSizeChange.bind(this);

    // Hide columns for responsive view!!
    //console.log(window.innerWidth);

    this.state = {
      dataSource: this._getWordsByDialect(props, PAGE, PAGE_SIZE),
      dataSourceCount: 0
    };

    WordOperations.getWordCountByDialect(
        props.client,
        props.dialect,
        null,
        // Use same schemas to make use of caching
        {'X-NXproperties': 'dublincore, fv-word, fvcore'}
    ).then((function(count){
          this.setState({
            dataSourceCount: count
          });
    }).bind(this));
  }

  componentDidMount(){
    window.router = this.props.router;
  }

  _getWordsByDialect(props, page, pageSize, query = null) {
    return WordOperations.getWordsByDialect(
        props.client,
        props.dialect,
        query,
        {'X-NXproperties': 'dublincore, fv-word, fvcore'},
        {'currentPageIndex': (page - 1), 'pageSize': pageSize}
    );
  }

  _onSelectionChange(newSelectedId, data){
    SELECTED_ID = newSelectedId;
    this.props.router.navigate("browse/word/" + newSelectedId , {trigger: true});
  }

  _onPageChange(page) {
    PAGE = page;
    this.setState({
      dataSource: this._getWordsByDialect(this.props, PAGE, PAGE_SIZE)
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
      dataSource: this._getWordsByDialect(this.props, PAGE, PAGE_SIZE)
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
        <h2>{this.props.dialect}</h2>
        <DataGrid
          idProperty="id"
          dataSource={this.state.dataSource}
          dataSourceCount={this.state.dataSourceCount}
          columns={columns}
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
        <div className="pull-right"><small><a href={this.props.client._baseURL + '/nxpath/default/default-domain/workspaces/FVData/' + this.props.family + '/' + this.props.language + '/' + this.props.dialect + '/Dictionary@view_documents?tabIds=%3AFVWordTab'} target="_blank">[View in Nuxeo]</a></small></div>
      </div>
    }

    return HTML;
  }
}

BrowseDataGrid.contextTypes = {
  router: React.PropTypes.func
};

module.exports = BrowseDataGrid;