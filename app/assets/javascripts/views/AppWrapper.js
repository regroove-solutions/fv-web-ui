var React = require('react');
var Mui = require('material-ui');
var classNames = require('classnames');

var AppBar = Mui.AppBar;
var MenuItem = Mui.MenuItem;
var List = Mui.List;
var ListItem = Mui.ListItem;
var AppLeftNav = require('./components/AppLeftNav');
var BrowseDataGrid = require('./components/BrowseDataGrid');
var WordDetailsView = require('./components/WordDetailsView');
var WordCreateView = require('./components/WordCreateView');

//var ListView = require('./components/ListView');

var ThemeManager = new Mui.Styles.ThemeManager();

let AppWrapper = React.createClass({

  getInitialState() {
    return {
      route : this.props.state,
      routeParams : {}
    }
  },

  // Important!
  getChildContext() { 
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  changePage(destination, params = {}) {
    this.setState({route : destination, routeParams: params.routeParams});
  },

  redraw() {
    this.render();
  },

  render() {

      var content;

      switch (this.state.route){
        case 'browse':

          content = <div className="languages-cont">

            <div className="row">

              <div className="col-xs-3">
                <div className="well">
                  <h3>Lilwat</h3>
                  <p>Short description about language. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem.</p>
                  <a href="/#browse/Lilwat" className={classNames('btn', 'btn-primary')}>Explore Language</a>
                </div>
              </div>

              <div className="col-xs-3">
                <div className="well">
                  <h3>Sample Language</h3>
                  <p>Short description about language. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem.</p>
                  <a href="" className={classNames('btn', 'btn-primary')}>Explore Language</a>
                </div>
              </div>

              <div className="col-xs-3">
                <div className="well">
                  <h3>Sample Language</h3>
                  <p>Short description about language. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem.</p>
                  <a href="" className={classNames('btn', 'btn-primary')}>Explore Language</a>
                </div>
              </div>

              <div className="col-xs-3">
                <div className="well">
                  <h3>Sample Language</h3>
                  <p>Short description about language. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem.</p>
                  <a href="" className={classNames('btn', 'btn-primary')}>Explore Language</a>
                </div>
              </div>

              <div className="col-xs-3">
                <div className="well">
                  <h3>Sample Language</h3>
                  <p>Short description about language. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem.</p>
                  <a href="" className={classNames('btn', 'btn-primary')}>Explore Language</a>
                </div>
              </div>

              <div className="col-xs-3">
                <div className="well">
                  <h3>Sample Language</h3>
                  <p>Short description about language. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem.</p>
                  <a href="" className={classNames('btn', 'btn-primary')}>Explore Language</a>
                </div>
              </div>

              <div className="col-xs-3">
                <div className="well">
                  <h3>Sample Language</h3>
                  <p>Short description about language. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem.</p>
                  <a href="" className={classNames('btn', 'btn-primary')}>Explore Language</a>
                </div>
              </div>

            </div>

          </div>

        break;

        case 'browse/language':

          content = <div className="row">

            <div className="col-xs-12">
              <BrowseDataGrid
                router={this.props.router}
                client={this.props.client}
                className="browseDataGrid"
                language={this.state.routeParams.language} />
            </div>

          </div>
        break;

        case 'browse/word':

          content = <div className="row">

            <div className="col-xs-12">
              <WordDetailsView
                router={this.props.router}
                client={this.props.client}
                className="wordDetailsView"
                id={this.state.routeParams.word} />
            </div>

          </div>
        break;

        case 'introduction':
          content = <div className="row">
            <div className="col-xs-12">
              <h2>Getting Started</h2>
              <p>Some getting started information could go here.</p>
              <p>Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum. Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.</p>
              <p>Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum. Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.</p>
              <p>Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum. Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.</p>
            </div>
          </div>
        break;

        case 'contribute':

          content = <div className="contribute-cont">

            <div className="row">

              <div className="col-xs-3">
                <div className="well">
                  <h3>Suggest Words</h3>
                  <p>Short description about language. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem.</p>
                  <p><select><option>Select Language</option><option>Lilwat</option><option>Language 1</option><option>Language 2</option></select></p>
                  <a href="/#contribute/Lilwat/word" className={classNames('btn', 'btn-primary')}>Suggest Word</a>
                </div>
              </div>

              <div className="col-xs-3">
                <div className="well">
                  <h3>Lorem Ipsum</h3>
                  <p>Short description about language. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem.</p>
                  <p><select><option>Select Language</option><option>Lilwat</option><option>Language 1</option><option>Language 2</option></select></p>
                  <a href="" className={classNames('btn', 'btn-primary')}>Take Action</a>
                </div>
              </div>

              <div className="col-xs-3">
                <div className="well">
                  <h3>Lorem Ipsum</h3>
                  <p>Short description about language. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem.</p>
                  <p><select><option>Select Language</option><option>Lilwat</option><option>Language 1</option><option>Language 2</option></select></p>
                  <a href="" className={classNames('btn', 'btn-primary')}>Take Action</a>
                </div>
              </div>

              <div className="col-xs-3">
                <div className="well">
                  <h3>Lorem Ipsum</h3>
                  <p>Short description about language. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem.</p>
                  <p><select><option>Select Language</option><option>Lilwat</option><option>Language 1</option><option>Language 2</option></select></p>
                  <a href="" className={classNames('btn', 'btn-primary')}>Take Action</a>
                </div>
              </div>

              <div className="col-xs-3">
                <div className="well">
                  <h3>Lorem Ipsum</h3>
                  <p>Short description about language. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem.</p>
                  <p><select><option>Select Language</option><option>Lilwat</option><option>Language 1</option><option>Language 2</option></select></p>
                  <a href="" className={classNames('btn', 'btn-primary')}>Take Action</a>
                </div>
              </div>

              <div className="col-xs-3">
                <div className="well">
                  <h3>Lorem Ipsum</h3>
                  <p>Short description about language. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem.</p>
                  <p><select><option>Select Language</option><option>Lilwat</option><option>Language 1</option><option>Language 2</option></select></p>
                  <a href="" className={classNames('btn', 'btn-primary')}>Take Action</a>
                </div>
              </div>

              <div className="col-xs-3">
                <div className="well">
                  <h3>Lorem Ipsum</h3>
                  <p>Short description about language. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem.</p>
                  <p><select><option>Select Language</option><option>Lilwat</option><option>Language 1</option><option>Language 2</option></select></p>
                  <a href="" className={classNames('btn', 'btn-primary')}>Take Action</a>
                </div>
              </div>

            </div>

          </div>

        break;

        case 'contribute/word':
          content = <div className="row">
            <div className="col-xs-12">
              <h2>{this.state.routeParams.language}: Contribute Word</h2>
              <WordCreateView
                client={this.props.client}
                router={this.props.router} 
                language={this.state.routeParams.language} />
            </div>
          </div>
        break;

        default:
          content = <div className="row">
            <div className="col-xs-12">
              <h1>Welcome Friends!</h1>
              <p>This simple yet powerful web application is an example of consuming data from a robust Digital Asset Management system using a REST API.</p>
            </div>
            <div className="col-xs-4">
              <h2>Get Started</h2>
              <p>Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum</p>
              <a href="/#get-started" className={classNames('btn', 'btn-primary')}>Get Started</a>
            </div>
            <div className="col-xs-4">
              <h2>Browse</h2>
              <p>Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum</p>
              <a href="/#browse" className={classNames('btn', 'btn-primary')}>Browse Languages</a>
            </div>
            <div className="col-xs-4">
              <h2>Contribute</h2>
              <p>Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum</p>
              <a href="/#contribute" className={classNames('btn', 'btn-primary')}>Start Contributing</a>
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
