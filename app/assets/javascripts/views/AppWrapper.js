var React = require('react');
var _ = require('underscore');
var Mui = require('material-ui');
var classNames = require('classnames');

var AppBar = Mui.AppBar;
var AppLeftNav = require('./components/AppLeftNav');
var BrowseDataGrid = require('./components/BrowseDataGrid');
var LanguageFamilyListView = require('./components/LanguageFamilyListView');
var WordDetailsView = require('./components/WordDetailsView');
var WordEditView = require('./components/WordEditView');
var WordCreateView = require('./components/WordCreateView');

var GameWrapperView = require('./components/GameWrapperView');

var DirectoryOperations = require('operations/DirectoryOperations');

var ThemeManager = new Mui.Styles.ThemeManager();

let AppWrapper = React.createClass({

  getInitialState() {

    return {
      route : this.props.state,
      subjects: [],
      routeParams : {}
    }
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  changePage(destination, params = {}) {
    this.setState({
      route : destination,
      routeParams: params.routeParams
    });

    DirectoryOperations.getSubjects(this.props.client).then((function(response){
      this.setState({
        subjects : response
      });
    }).bind(this));

  },

  _changeQuizCategory(e){
    var quizLink = document.getElementById('quiz');

    if (this.state.routeParams && e.target.value.length > 0) {
      quizLink.href = "#play/" + this.state.routeParams.language + "/quiz/" + e.target.value;
    }

    e.preventDefault();
  },

  _changeMultiQuizCategory(e){
    var quizLink = document.getElementById('multi-quiz');

    if (this.state.routeParams) {
      quizLink.href = "#play/" + this.state.routeParams.language + "/multi-quiz/" + e.target.value;
    }
  },

  render() {
      var content;

      switch (this.state.route){

        case 'browse':

          content = <div className="languages-cont">

            <div className="row">
              <div className="col-xs-12">
                <h2>Browse Languages</h2>
              </div>
            </div>

            <div className="row">

              <div className="col-xs-12 col-md-3">
                <div className="well">
                  <h3>Lilwat</h3>
                  <p>Short description about language. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem.</p>
                  <a href="#browse/Lilwat" className={classNames('btn', 'btn-primary')}>Explore Language</a>
                </div>
              </div>

              <div className="col-xs-12 col-md-3">
                <div className="well">
                  <h3>Sample Language</h3>
                  <p>Short description about language. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem.</p>
                  <a href="" className={classNames('btn', 'btn-primary')}>Explore Language</a>
                </div>
              </div>

              <div className="col-xs-12 col-md-3">
                <div className="well">
                  <h3>Sample Language</h3>
                  <p>Short description about language. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem.</p>
                  <a href="" className={classNames('btn', 'btn-primary')}>Explore Language</a>
                </div>
              </div>

              <div className="col-xs-12 col-md-3">
                <div className="well">
                  <h3>Sample Language</h3>
                  <p>Short description about language. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem.</p>
                  <a href="" className={classNames('btn', 'btn-primary')}>Explore Language</a>
                </div>
              </div>

              <div className="col-xs-12 col-md-3">
                <div className="well">
                  <h3>Sample Language</h3>
                  <p>Short description about language. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem.</p>
                  <a href="" className={classNames('btn', 'btn-primary')}>Explore Language</a>
                </div>
              </div>

              <div className="col-xs-12 col-md-3">
                <div className="well">
                  <h3>Sample Language</h3>
                  <p>Short description about language. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem.</p>
                  <a href="" className={classNames('btn', 'btn-primary')}>Explore Language</a>
                </div>
              </div>

              <div className="col-xs-12 col-md-3">
                <div className="well">
                  <h3>Sample Language</h3>
                  <p>Short description about language. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem.</p>
                  <a href="" className={classNames('btn', 'btn-primary')}>Explore Language</a>
                </div>
              </div>

            </div>

          </div>

        break;

        case 'play':

          var subjectReactOptions = [];
          var subjectsArray = [];

          subjectsArray = _.sortBy(_.toArray(this.state.subjects), function (name) {return name});

          if (subjectsArray.length > 0) {

            _.each(subjectsArray, function(element, index) {
              if (element != undefined) {
                subjectReactOptions[index] = <option value={element} key={element}>{element}</option>;
              }
            });
          }

          content = <div className="play-cont">

            <div className="row">
              <div className="col-xs-12">
                <h2>Play Games</h2>
              </div>
            </div>

            <div className="row">

              <div className="col-xs-12 col-md-3">
                <div className="well">
                  <h3>Single Photo Quiz</h3>
                  <p>Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem.</p>
                  <p>
                    <select onChange={this._changeQuizCategory}>
                      <option>Select a category:</option>
                      {subjectReactOptions}
                    </select>
                  </p>
                  <a id="quiz" href="#play/Lilwat/quiz/biology" className={classNames('btn', 'btn-primary')}>Play Game</a>
                </div>
              </div>

              <div className="col-xs-12 col-md-3">
                <div className="well">
                  <h3>Multiple Photo Quiz</h3>
                  <p>Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem.</p>
                  <p>
                    <select onChange={this._changeMultiQuizCategory}>
                      <option>Select a category:</option>
                      {subjectReactOptions}
                    </select>
                  </p>
                  <a id="multi-quiz" href="#play/Lilwat/multi-quiz" className={classNames('btn', 'btn-primary')}>Play Game</a>
                </div>
              </div>

            </div>

          </div>

        break;

        case 'play/game':

          content = <div className="row">

            <div className="col-xs-12">
              <GameWrapperView
                router={this.props.router}
                client={this.props.client}
                language={this.state.routeParams.language}
                category={this.state.routeParams.category}
                game={this.state.routeParams.game} />
            </div>

          </div>
        break;

        case 'browse/family':

            content = <div className="row">
	            <LanguageFamilyListView
	            router={this.props.router}
	            client={this.props.client}
	            className="languageFamilyListView" />
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
              <div className="col-xs-12">
                <h2>Contribute to a Language</h2>
              </div>
            </div>

            <div className="row">

              <div className="col-xs-12 col-md-3">
                <div className="well">
                  <h3>Suggest Words</h3>
                  <p>Short description about language. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem.</p>
                  <p><select><option>Select Language</option><option>Lilwat</option><option>Language 1</option><option>Language 2</option></select></p>
                  <a href="#contribute/Lilwat/word" className={classNames('btn', 'btn-primary')}>Suggest Word</a>
                </div>
              </div>

              <div className="col-xs-12 col-md-3">
                <div className="well">
                  <h3>Lorem Ipsum</h3>
                  <p>Short description about language. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem.</p>
                  <p><select><option>Select Language</option><option>Lilwat</option><option>Language 1</option><option>Language 2</option></select></p>
                  <a href="" className={classNames('btn', 'btn-primary')}>Take Action</a>
                </div>
              </div>

              <div className="col-xs-12 col-md-3">
                <div className="well">
                  <h3>Lorem Ipsum</h3>
                  <p>Short description about language. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem.</p>
                  <p><select><option>Select Language</option><option>Lilwat</option><option>Language 1</option><option>Language 2</option></select></p>
                  <a href="" className={classNames('btn', 'btn-primary')}>Take Action</a>
                </div>
              </div>

              <div className="col-xs-12 col-md-3">
                <div className="well">
                  <h3>Lorem Ipsum</h3>
                  <p>Short description about language. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem.</p>
                  <p><select><option>Select Language</option><option>Lilwat</option><option>Language 1</option><option>Language 2</option></select></p>
                  <a href="" className={classNames('btn', 'btn-primary')}>Take Action</a>
                </div>
              </div>

              <div className="col-xs-12 col-md-3">
                <div className="well">
                  <h3>Lorem Ipsum</h3>
                  <p>Short description about language. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem.</p>
                  <p><select><option>Select Language</option><option>Lilwat</option><option>Language 1</option><option>Language 2</option></select></p>
                  <a href="" className={classNames('btn', 'btn-primary')}>Take Action</a>
                </div>
              </div>

              <div className="col-xs-12 col-md-3">
                <div className="well">
                  <h3>Lorem Ipsum</h3>
                  <p>Short description about language. Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem.</p>
                  <p><select><option>Select Language</option><option>Lilwat</option><option>Language 1</option><option>Language 2</option></select></p>
                  <a href="" className={classNames('btn', 'btn-primary')}>Take Action</a>
                </div>
              </div>

              <div className="col-xs-12 col-md-3">
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

        case 'contribute/edit/word':

          content = <div className="row">

            <div className="col-xs-12">
              <WordEditView
                id={this.state.routeParams.word}
                router={this.props.router}
                client={this.props.client} />
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
            <div className="col-xs-12 col-md-4">
              <h2>Get Started</h2>
              <p>Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum</p>
              <a href="#get-started" className={classNames('btn', 'btn-primary')}>Get Started</a>
            </div>
            <div className="col-xs-12 col-md-4">
              <h2>Browse</h2>
              <p>Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum</p>
              <a href="#browse" className={classNames('btn', 'btn-primary')}>Browse Languages</a>
            </div>
            <div className="col-xs-12 col-md-4">
              <h2>Contribute</h2>
              <p>Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum</p>
              <a href="#contribute" className={classNames('btn', 'btn-primary')}>Start Contributing</a>
            </div>
          </div>
        break;
      }

    return <div>
      <AppBar
        title={this.props.title}
        onLeftIconButtonTouchTap={this.onMenuToggleTouchTap}
        iconClassNameRight="muidocs-icon-navigation-expand-more" />
      <AppLeftNav
        ref="leftNav"
        title={this.props.title}
        docked={false}
        router={this.props.router} />
      <div className="main">
        {content}
      </div>
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