var React = require('react');
var _ = require('underscore');
var Mui = require('material-ui');
var classNames = require('classnames');

var AppBar = Mui.AppBar;
var AppLeftNav = require('./components/AppLeftNav');
var BrowseDataGrid = require('./components/BrowseDataGrid');
var LanguageFamilyListView = require('./components/LanguageFamilyListView');
var LanguageListView = require('./components/LanguageListView');
var DialectListView = require('./components/DialectListView');
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

      var navigationLinks = <ul>
        <li>Testing 123</li>
        <li>Test 1233</li>
        <select><option>Choose a Language:</option><option>Test</option></select>
      </ul>;

      var navigation = <div>
        <AppBar
          title={this.props.title}
          onLeftIconButtonTouchTap={this.onMenuToggleTouchTap}
          children={navigationLinks}
          iconClassNameRight="muidocs-icon-navigation-expand-more"/>
        <AppLeftNav
          ref="leftNav"
          title={this.props.title}
          docked={false}
          router={this.props.router} />
      </div>;

      var footer = <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12">
              <p className={classNames('text-center', 'text-muted')}>Disclaimer | Feedback | Conditions of Use</p>
            </div>
            <div className="col-xs-12">
              <div className="row">
                <div className="col-xs-6">
                  <img src="http://www.firstvoices.com/img/fpcf-logo-28x28.gif" alt="FirstVoices Logo" className={classNames('fv-small-logo', 'pull-left')} />&copy; 2000-13 FirstVoices<br/>Phone: 250-652-5952 · Email: info@fpcc.ca
                </div>
                <div className={classNames('text-right', 'col-xs-6')}>
                  <img src="http://www.firstvoices.com/img/fv-logo-100x25.gif" alt="FirstVoices" />
                </div>
              </div>
            </div>
          </div>
        </div>;


      // Change body class
      if (this.state.route != undefined) {
        document.getElementById("body").className = this.state.route.replace("/", "_");
      }

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

        case 'explore/families':

            content = <div className="row">
            	<div className="col-xs-12">
		            <h2>All Language Families</h2>	    
		            <LanguageFamilyListView
			            router={this.props.router}
			            client={this.props.client}
			            className="languageFamilyListView" />
	            </div>
	        </div>    
        break;         
        
        case 'explore/family':

            content = <div className="row">
		        <div className="col-xs-12">
		          	<h4><a href="#explore">All Language Families</a> > {this.state.routeParams.family}</h4>
	            	<h2>{this.state.routeParams.family} Family</h2>
	            	<h3>Languages</h3>
		          	<LanguageListView
			            router={this.props.router}
			            client={this.props.client}
			            className="languageListView" 
			            family={this.state.routeParams.family} />
		        </div>
	        </div>    
        break;          

        case 'explore/language':

            content = <div className="row">
	            <div className="col-xs-12">
	            	<h4><a href="#explore">All Language Families</a> > <a href={"#explore/" + this.state.routeParams.family}>{this.state.routeParams.family}</a> > {this.state.routeParams.language}</h4>
	            	<h2>{this.state.routeParams.language} Language</h2>
	            	<h3>Dialects</h3>
	            	<DialectListView
			            router={this.props.router}
			            client={this.props.client}
			            className="dialectListView" 
			            family={this.state.routeParams.family} 
			            language={this.state.routeParams.language}  />
	            </div>
	        </div>    
        break;           

        case 'explore/dialect':

            content = <div className="row">
              <h4><a href="#explore">All Language Families</a> > <a href={"#explore/" + this.state.routeParams.family}>{this.state.routeParams.family}</a> > <a href={"#explore/" + this.state.routeParams.family + "/" + this.state.routeParams.language}>{this.state.routeParams.language}</a> > {this.state.routeParams.dialect}</h4>
              <div className="col-xs-12">
                <BrowseDataGrid
                  router={this.props.router}
                  client={this.props.client}
                  className="browseDataGrid"
  		          family={this.state.routeParams.family} 
		          language={this.state.routeParams.language}                	  
                  dialect={this.state.routeParams.dialect} />
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

        case 'get-started':
          content = <div className="row">
            <div className="col-md-8 col-xs-12">
              <h2>About Us</h2>
              <p>Some text here</p>
              <h3>Recommended fonts</h3>
              <p>Due to FirstVoices' use of Unicode font technology, one or more of the following fonts are recommended to ensure correct character representation: Aboriginal Sans Serif, Aboriginal Serif, Lucida Grande (bundled with Mac OSX) , Lucida Sans Unicode (comes with Windows), Gentium, Code2001. FirstVoices also uses the Quicktime video player. Download the free plug-in here: QuickTime</p>
              <p>FirstVoices Audio Recording Buyer's Guide - view our online audio equipment guide</p>
              <h2>Getting Started</h2>
              <p>Some getting started information could go here.</p>
              <p>Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum. Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.</p>
              <p>Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum. Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.</p>
              <p>Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum. Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.</p>
            </div>
            <div className="col-md-4 col-xs-12">
              <h2>News</h2>
              <p>Some getting started information could go here.</p>
              <p>Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum. Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.</p>
              <p>Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum. Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.</p>
              <p>Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum. Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.</p>
              <h2>Map Navigation</h2>
              <p>Map here</p>
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
          document.getElementById("body").className = "introduction";

          var inlineStyles = {
              marginRight: '25px'
          };

          var tableStyles = {
              marginRight: 'auto',
              marginLeft: 'auto'
          };

          navigation = "";
          footer = "";

          content = <div className="container">
            <div className="row">
              <div className={classNames('col-xs-12', 'col-md-7')}>
                <img src="http://www.firstvoices.com/img/english.gif"/>
                <img src="http://www.firstvoices.com/img/logo.gif"/>
                <img src="http://www.firstvoices.com/img/french.gif"/>
              </div>
              <div className={classNames('col-xs-12', 'col-md-5')}>
                <img src="http://www.firstvoices.com/img/fv-girl.jpg"/>
              </div>
              <div className="col-xs-12">
                <a className={classNames('btn', 'btn-default')} style={inlineStyles} href="#get-started">English</a> 
                <a className={classNames('btn', 'btn-default')} style={inlineStyles} href="#get-started">French</a>
              </div>   
            </div>  
            <div className={classNames('row', 'supporters')}>
              <div className={classNames('col-xs-12', 'text-center')}>
                <p>
                  <a href="http://www.fpcc.ca/" target="_blank"><img src="http://www.firstvoices.com/img/fphlcc-logo_sm.gif" alt="First Peoples' Heritage Language and Culture Council " width="145" height="36" hspace="5" border="0" align="absmiddle"/></a> &nbsp;&nbsp; 
                  <a href="http://www.fpcf.ca/" target="_blank"><img src="http://www.firstvoices.com/img/fpcf-logo_sm.gif" alt="First Peoples' Cultural Foundation   " width="199" height="36" hspace="5" border="0" align="absmiddle"/></a>
                </p>
                  
                <p>
                  We gratefully acknowledge the following supporters:
                </p>

                <p>
<table style={tableStyles} align="center"><tbody>
<tr align="center" valign="middle">
<td bgcolor="#FFFFFF" align="center">
<a href="http://www.gov.bc.ca/arr/" target="_blank">
<img  src="http://www.firstvoices.com/img/BC_ARR_H.jpg" alt="Ministry of Aboriginal Relations and Reconcilation" width="127" height="36" border="0" align="absmiddle" />
</a><br/>
  &nbsp;<br/>
<a href="http://www.pch.gc.ca/" target="_blank">
<img  src="http://www.firstvoices.com/img/logo_pch.gif" alt="Canadian Heritage" width="180" height="36" border="0" align="absmiddle" />
</a></td><td bgcolor="#FFFFFF" align="center"><a href="http://www.fntc.info/" target="_blank"><img  src="http://www.firstvoices.com/img/FNTC.gif" alt="First Nation Technology Council" width="88" height="87" border="0"/></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td bgcolor="#FFFFFF"><a href="http://www.newrelationshiptrust.ca/" target="_blank"><img  src="http://www.firstvoices.com/img/New-NRT-Logo-sm.jpg" alt="New Relationship Trust" width="126" height="88" border="0" align="absmiddle" /></a>&nbsp;&nbsp;</td>
            
                <td bgcolor="#FFFFFF" align="center"><a href="http://www.languagegeek.com" target="_blank"><img  src="http://www.firstvoices.com/img/lg.gif" alt="Languagegeek.com" width="191" height="36" border="0"/></a><br/>&nbsp;<br/>
          <a href="http://www.tavultesoft.com/" target="_blank"><img  src="http://www.firstvoices.com/img/tav.gif" alt="Tavultesoft" width="191" height="29" border="0"/></a></td>
              </tr>
</tbody></table>
                </p>

              </div>
            </div>
          </div>
        break;
      }

    return <div>
      {navigation}
      <div className="main">
        {content}
      </div>
      <footer className="footer">
        {footer}
      </footer>
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