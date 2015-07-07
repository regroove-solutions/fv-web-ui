var React = require('react');
var Backbone = require('backbone');
var Sorty = require('sorty'); // Underscore
var classNames = require('classnames');
var Mui = require('material-ui');
var DataGrid = require('react-datagrid');

require('!style!css!react-datagrid/dist/index.min.css');

class Definition extends React.Component {

  render() {

    var classes = classNames({
      'label': true,
      'label-primary': true,
      'label-spaced': true
    });

    return <span className={classes}>
      {this.props.label}
    </span>
  }

}


var nuxeoListDocs;
var {Colors, Spacing, Typography} = Mui.Styles;

     
        /**
         * Models
         */
        var Document = Backbone.Model.extend({
            idAttribute: 'uid',
            initialize: function (data){
           if (data.parentRef != null && data.parentRef.length > 0 ) {
 
               var setParent = data.parentRef;
 
               if (data.type== "Workspace") {
                       setParent = "#";
               }
 
               this.set('parent', setParent);
               this.set('id', data.uid);
               this.set('text', data.title);
               this.set('definitions', data.properties['fv:definitions']);
               this.set('pronunciation', data.properties['fv:pronunciation']);
               this.set('subjects', data.properties['dc:subjects']);
           }
                }
        });
        
        /**
         * Collections
         */
        var Documents = Backbone.Collection.extend({
            model: Document
        });



     // Query documents from Nuxeo
  var workspace;

var columns = [
    //{ name: 'id', title: 'ID'},
    { name: 'title', title: 'Word'},
    { name: 'definitions', title: 'Definitions', render: function(v){
      if (typeof v == 'object' && v.length > 0){

        var rows = [];

        v.forEach(function (li) {
          rows.push(<Definition label={li} />);
        }); 

        return rows
      }
      
    }}, // render function -- make a new React element for this
    { name: 'pronunciation', title: 'Pronunciation'},
    { name: 'subjects', title: 'Category', render: function(v){
      if (typeof v == 'object' && v.length > 0){

        var rows = [];

        v.forEach(function (li) {
          rows.push(<Definition label={li} />);
        }); 

        return rows
      }
      
    }}
]

var SORT_INFO = [ { name: 'title', dir: 'asc'}];

function sort(arr){
  return Sorty(SORT_INFO, arr)
}
//sort data array with the initial sort order
//data = sort(data);

/**
* Fix Sorting / use underscore for filtering, sorting, etc?
* Save / restore state?
*/
var SELECTED_ID = null;


function getData(client, language){

  //var _this = this;

  return new Promise(
        // The resolver function is called with the ability to resolve or
        // reject the promise
        function(resolve, reject) {

          client.operation('Document.Query')
            .params({
              query: "SELECT * FROM Document WHERE (dc:title = '" + language + "' AND ecm:primaryType = 'Workspace')"
            })
          .execute(function(error, response) {

                // Handle error
            if (error) {
              console.log('test');
              throw error;
            }
            // Create a Workspace Document based on returned data
            
            if (response.entries.length > 0) {
              var workspaceID = response.entries[0].uid;

              client.operation('Document.Query')
                .params({
                  query: "SELECT * FROM Document WHERE (ecm:parentId = '" + workspaceID + "' AND ecm:primaryType = 'Word')"
                })
              .execute(function(error, response) {

                    // Handle error
                if (error) {
                  throw error;
                }

                nuxeoListDocs = new Documents(response.entries);
                resolve(sort(nuxeoListDocs.toJSON()));

              });
            } else {
              reject('Workspace not found');
            }

          });

        });
}

class BrowseDataGrid extends React.Component {

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    //this._getSelectedIndex = this._getSelectedIndex.bind(this);
    this._onLeftNavChange = this._onLeftNavChange.bind(this);
    this._onHeaderClick = this._onHeaderClick.bind(this);

    // Hide columns for responsive view!!
    console.log(window.innerWidth);

    this.state = {
      dataSource: getData(props.client, props.language)
    };
  }

  handleColumnOrderChange(index, dropIndex){
    var col = columns[index]
    columns.splice(index, 1) //delete from index, 1 item
    columns.splice(dropIndex, 0, col)
    this.setState({})
  }

  handleSortChange(sortInfo){
    var data;

    SORT_INFO = sortInfo

    data = sort(nuxeoListDocs.toJSON())

    this.setState({dataSource: data});
  }

  handleFilter(column, value, allFilterValues){
    //reset data to original data-array
      var data = nuxeoListDocs.toJSON()

      //go over all filters and apply them
      Object.keys(allFilterValues).forEach(function(name){
        var columnFilter = (allFilterValues[name] + '').toUpperCase()

        if (columnFilter == ''){
          return
        }

        data = data.filter(function(item){
            if ((item[name] + '').toUpperCase().indexOf(columnFilter) === 0){
                return true
            }
        })
      })

      this.setState({dataSource: data})
  }

  onSelectionChange(newSelectedId, data){
    SELECTED_ID = newSelectedId;
    this.props.router.navigate("browse/word/" + newSelectedId , {trigger: true});
  }

  getStyles() {
    return {
      cursor: 'pointer',
      //.mui-font-style-headline
      fontSize: '24px',
      color: Typography.textFullWhite,
      lineHeight: Spacing.desktopKeylineIncrement + 'px',
      fontWeight: Typography.fontWeightLight,
      backgroundColor: Colors.cyan500,
      paddingLeft: Spacing.desktopGutter,
      paddingTop: '0px',
      marginBottom: '8px'
    };
  }

  render() {

      // Styles
      var DataGridStyles = {
        zIndex: 0
      };

    return (
      <div>
        <h2>{this.props.language}</h2>
        <DataGrid
          idProperty="id"
          dataSource={this.state.dataSource}
          columns={columns}
          style={DataGridStyles}
          selected={SELECTED_ID}
          sortInfo={SORT_INFO}
          onFilter={this.handleFilter.bind(this)}
          onSortChange={this.handleSortChange.bind(this)}
          onSelectionChange={this.onSelectionChange.bind(this)}
          onColumnOrderChange={this.handleColumnOrderChange.bind(this)}
          pagination={false}
          liveFilter={true}
          emptyText={'No records'}
          showCellBorders={true} />
      </div>
    );
  }

  toggle() {
    this.refs.leftNav.toggle();
  }

  /*_getSelectedIndex() {
    var currentItem;

    for (var i = menuItems.length - 1; i >= 0; i--) {
      currentItem = menuItems[i];
      if (currentItem.route && this.context.router.isActive(currentItem.route)) return i;
    }
  }*/

  _onLeftNavChange(e, key, payload) {
    this.props.router.navigate(payload.route, true);
    //this.context.router.transitionTo(payload.route);
  }

  _onHeaderClick() {
    this.props.router.navigate('', true);
    //this.context.router.transitionTo('root');
    this.refs.leftNav.close();
  }

}

BrowseDataGrid.contextTypes = {
  router: React.PropTypes.func
};

module.exports = BrowseDataGrid;