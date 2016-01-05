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
      return <Link id={data.id} value={v} />
    }},
    {
      name: 'fv-word:part_of_speech', title: 'Part of Speech'
    },
    {
      name: 'fv:literal_translation', title: 'Literal Translation'
    }
]

var SELECTED_ID = null;
var PAGE = 0;
var PAGE_SIZE = 100;

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
      dataSource:  WordOperations.getWordsByDialect(
        props.client,
        props.dialect,
        null,
        {'X-NXproperties': 'fv-word'},
        {'currentPageIndex': PAGE, 'pageSize': PAGE_SIZE}
      ),
      dataSourceCount: WordOperations.getWordCountByDialect(
        props.client,
        props.dialect,
        null,
        {'X-NXproperties': 'ecm'}
      ).then(function(value){return value;})
    };
  }

  componentDidMount(){
    window.router = this.props.router;
  }

  _onSelectionChange(newSelectedId, data){
    SELECTED_ID = newSelectedId;
    this.props.router.navigate("browse/word/" + newSelectedId , {trigger: true});
  }

  _onPageChange(page) {
    PAGE = page;
    this.setState({
      dataSource:  WordOperations.getWordsByDialect(
        this.props.client,
        this.props.language,
        null,
        {'X-NXproperties': 'fv-word'},
        {'currentPageIndex': PAGE, 'pageSize': PAGE_SIZE})
      });
  }

  _onPageSizeChange(pageSize, props) {
    console.log('test123');
    /*if (pageSize > PAGE_SIZE){
        //when page size gets bigger, the page may not exist
        //so make sure you update that as well
        PAGE = Math.min(PAGE, Math.ceil(props.dataSourceCount / pageSize));
    }
    PAGE_SIZE = pageSize;
    this.setState({});*/
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
      </div>
    }

    return HTML;
  }
}

BrowseDataGrid.contextTypes = {
  router: React.PropTypes.func
};

module.exports = BrowseDataGrid;