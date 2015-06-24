var React = require('react');
var Backbone = require('backbone');
var Sorty = require('sorty'); // Underscore
var Mui = require('material-ui');
var DataGrid = require('react-datagrid');

require('!style!css!react-datagrid/dist/index.min.css');

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
               this.set('definitions', data.properties['fv:Definitions']);
               this.set('pronunciation', data.properties['fv:Pronunciation']);
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
  var lilwatWorkspace;

var dataOriginal = [
    { id: '1', word: 'Wolf', translation: 'Bobson', category: 'Nature', status: 'Enabled'},
    { id: '2', word: 'Spoon', translation: 'Mclaren', category: 'Kitchen', status: 'Draft'}
]

var data = [].concat(dataOriginal);

var columns = [
    { name: 'id', title: 'ID'},
    { name: 'title', title: 'Word'},
    { name: 'definitions', title: 'Definitions'}, // render function -- make a new React element for this
    { name: 'pronunciation', title: 'Pronunciation'},
    { name: 'category', title: 'Category'},
    { name: 'status', title: 'Status'}
]

var SORT_INFO = [ { name: 'word', dir: 'asc'}];

function sort(arr){
  return Sorty(SORT_INFO, arr)
}
//sort data array with the initial sort order
data = sort(data);

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
/*
BUG? Document.GetChildren not sending any properties?
          client.operation('Document.Query')
            .params({
              query: "SELECT * FROM Document WHERE (ecm:primaryType = 'Workspace' AND dc:title = '" + language + "')"
            })
          .execute(function(error, response) {

                // Handle error
            if (error) {
              throw error;
            }

            // Create a Workspace Document based on returned data
            lilwatWorkspace = new Document(response.entries[0]);
            //resolve(response.entries);
                //nuxeoDocsTreeView = new MenuTreeView({model: nuxeoDocs});
                //nuxeoDocsTreeView.render();

client.operation('Document.GetChildren')
         .input(lilwatWorkspace.get("id"))
         .execute(function(error, children) {

           if (error) {
             throw error;
           }
           
           // Create Documents object using data
           var nuxeoListDocs = new Documents(children.entries);
           console.log(children.entries);
           //console.log(nuxeoListDocs.toJSON());
           resolve(nuxeoListDocs.toJSON());
         });

          });*/


          client.operation('Document.Query')
            .params({
              query: "SELECT * FROM Document WHERE (ecm:parentId = 'fd9a5f5e-f852-4640-b2d9-09ca6684043b')"
            })
          .execute(function(error, response) {

                // Handle error
            if (error) {
              throw error;
            }
            // Create a Workspace Document based on returned data
            var nuxeoListDocs = new Documents(response.entries);
            //resolve(response.entries);
                //nuxeoDocsTreeView = new MenuTreeView({model: nuxeoDocs});
                //nuxeoDocsTreeView.render();

            resolve(nuxeoListDocs.toJSON());

          });

        });
}

class BrowseDataGrid extends React.Component {

  constructor() {
    super();
    this.toggle = this.toggle.bind(this);
    //this._getSelectedIndex = this._getSelectedIndex.bind(this);
    this._onLeftNavChange = this._onLeftNavChange.bind(this);
    this._onHeaderClick = this._onHeaderClick.bind(this);
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
      <DataGrid
        idProperty="id"
        dataSource={getData(this.props.client, this.props.language)}
        columns={columns}
        style={DataGridStyles}
        //dataSource='http://5.101.99.47:8090/1000'
        selected={SELECTED_ID}
        sortInfo={SORT_INFO}
        //onFilter={this.handleFilter}
        //onSortChange={this.handleSortChange}
        //onSelectionChange={this.onSelectionChange}
        //onColumnOrderChange={this.handleColumnOrderChange}
        liveFilter={true}
        showCellBorders={true} />
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