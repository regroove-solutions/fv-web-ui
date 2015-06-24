var React = require('react');
var Mui = require('material-ui');

var AppBar = Mui.AppBar;
var MenuItem = Mui.MenuItem;
var List = Mui.List;
var ListItem = Mui.ListItem;
var BrowseDataGrid = require('./components/BrowseDataGrid');
var AppLeftNav = require('./components/AppLeftNav');

//var ListView = require('./components/ListView');

var ThemeManager = new Mui.Styles.ThemeManager();

let AppWrapper = React.createClass({

  getInitialState() {
    return {
      route : this.props.state
    }
  },

  // Important!
  getChildContext() { 
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  changePage(destination) {
    this.setState({route : destination});
  },

  handleColumnOrderChange(index, dropIndex){
    var col = columns[index]
    columns.splice(index, 1) //delete from index, 1 item
    columns.splice(dropIndex, 0, col)
    this.setState({})
  },

  handleSortChange(sortInfo){
    SORT_INFO = sortInfo

    data = [].concat(dataOriginal)
    data = sort(data)

    this.setState({})
  },

  handleFilter(column, value, allFilterValues){
    //reset data to original data-array
      data = dataOriginal

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

      this.setState({})
  },

  onSelectionChange(newSelectedId, data){
    SELECTED_ID = newSelectedId

    name = SELECTED_ID != null? data.firstName: 'none'
    this.setState({})
  },

  render() {

      var content;

      switch (this.state.route){
        case 'browse':

          content = <div className="row">
            <div className="col-xs-12">
              <BrowseDataGrid client={this.props.client} language="Lilwat" />
            </div>
          </div>
        break;

        case 'introduction':
          content = <div className="row">
            <div className="col-xs-12">
              This is an introduction
            </div>
          </div>
        break;

        case 'contribute':
          content = <div className="row">
            <div className="col-xs-12">
              this is where you can contribute
            </div>
          </div>
        break;

        default:
          content = <div className="row">
            <div className="col-xs-12">
              <h1>Welcome Friends!</h1>
              <p>Lorem ipsum</p>
            </div>
            <div className="col-xs-4">
              <h2>Get Started</h2>
              <p>Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum</p>
            </div>
            <div className="col-xs-4">
              <h2>Browse</h2>
              <p>Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum</p>
            </div>
            <div className="col-xs-4">
              <h2>Contribute</h2>
              <p>Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum</p>
            </div>
            <div className="col-xs-12">
              <header><h3>Latest Additions</h3></header>
              <List>
                <ListItem
                  secondaryText={
                    <p>
                      <span>Brunch this weekend?</span><br/>
                      I&apos;ll be in your neighborhood doing errands this weekend.
                      Do you want to grab brunch?
                    </p>
                  }
                  secondaryTextLines={2}>
                  Brendan Lim
                </ListItem>
                <ListItem
                  secondaryText={
                    <p>
                      <span>Brunch this weekend?</span><br/>
                      I&apos;ll be in your neighborhood doing errands this weekend.
                      Do you want to grab brunch?
                    </p>
                  }
                  secondaryTextLines={2}>
                  Brendan Lim
                </ListItem>
              </List>
            </div>
          </div>
        break;
      }

        let menuItems = [
      { route: 'get-started', text: 'Get Started' },
      { route: 'browse', text: 'Browse' },
      { route: 'components', text: 'Components' },
      { type: MenuItem.Types.SUBHEADER, text: 'Resources' },
      { 
         type: MenuItem.Types.LINK, 
         payload: 'https://github.com/callemall/material-ui', 
         text: 'GitHub' 
      },
      { 
         text: 'Disabled', 
         disabled: true 
      },
      { 
         type: MenuItem.Types.LINK, 
         payload: 'https://www.google.com', 
         text: 'Disabled Link', 
         disabled: true 
      },
    ];

    return <div>
      <AppBar title={this.props.title} onLeftIconButtonTouchTap={this.onMenuToggleTouchTap} iconClassNameRight="muidocs-icon-navigation-expand-more"/>
      <AppLeftNav ref="leftNav" title={this.props.title} docked={false} router={this.props.router} menuItems={menuItems} />
      <div className="main">{content}</div>
    </div>;
  },

  onMenuToggleTouchTap () {
    this.refs.leftNav.toggle();
  }
});

AppWrapper.childContextTypes = {
  muiTheme: React.PropTypes.object
};

module.exports = AppWrapper;


// http://clayallsopp.com/posts/from-backbone-to-react/
// http://www.code-experience.com/react-js-vs-traditional-mvc-backbone-ember-angular/
// https://speakerdeck.com/ppiekarczyk/the-hybrid-backbone-and-react-app
// https://github.com/STRML/JSXHint/
// http://blog.venmo.com/hf2t3h4x98p5e13z82pl8j66ngcmry/2015/6/4/using-react-components-as-backbone-views
// http://joelburget.com/backbone-to-react/
// https://medium.com/react-tutorials/react-backbone-router-c00be0cf1592
// Get rid of Backbone Views?!
// http://spoike.ghost.io/deconstructing-reactjss-flux/
// http://material-ui.com/#/get-started
// http://ironsummitmedia.github.io/startbootstrap-sb-admin-2/pages/forms.html
// http://christianalfoni.github.io/react-webpack-cookbook/Loading-LESS-or-SASS.html
// http://www.thomasboyt.com/2013/12/17/using-reactjs-as-a-backbone-view.html
// react portal
// require-css
// https://github.com/reworkcss/rework-npm
