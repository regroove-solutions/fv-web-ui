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
    }}
]

var SELECTED_ID = null;

class BrowseDataGrid extends React.Component {

  constructor(props) {
    super(props);

    // Hide columns for responsive view!!
    //console.log(window.innerWidth);

    this.state = {
      dataSource:  WordOperations.getWordsByLangauge(props.client, props.dialect)
    };
  }

  componentDidMount(){
    window.router = this.props.router;
  }

  onSelectionChange(newSelectedId, data){
    SELECTED_ID = newSelectedId;
    this.props.router.navigate("browse/word/" + newSelectedId , {trigger: true});
  }

  render() {

      // Styles
      var DataGridStyles = {
        height:"70vh",
        zIndex: 0
      };

    return (
      <div>
        <h2>{this.props.dialect}</h2>
        <DataGrid
          idProperty="id"
          dataSource={this.state.dataSource}
          columns={columns}
          style={DataGridStyles}
          selected={SELECTED_ID}
          onSelectionChange={this.onSelectionChange.bind(this)}
          pagination={false}
          emptyText={'No records'}
          showCellBorders={true} />
      </div>
    );
  }
}

BrowseDataGrid.contextTypes = {
  router: React.PropTypes.func
};

module.exports = BrowseDataGrid;