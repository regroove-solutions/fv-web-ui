var React = require('react');
var Forms = require('newforms');
var BootstrapForm = require('newforms-bootstrap');
var Underscore = require('underscore');
var classNames = require('classnames');
var Mui = require('material-ui');
var {
      Card, CardHeader, CardMedia, CardTitle, CardActions, CardText, Avatar, FlatButton,
      Toolbar, ToolbarGroup, ToolbarTitle, ToolbarSeparator, DropDownMenu, DropDownIcon, FontIcon, RaisedButton,
      Tabs, Tab,
      Dialog
    } = Mui;

var {Colors, Spacing, Typography} = Mui.Styles;

var Word = require('models/Word');

//var DataGrid = require('react-datagrid');

//require('!style!css!react-datagrid/dist/index.min.css');



class Signup extends React.Component {

  constructor(props) {
    super(props);
   this.state = {
      dataTest: props.schema.username.initial
   };
  }

  _onSubmit() {
    var form = this.refs.signupForm.getForm()
    if (form.validate()) {
      // ...
    }
  }


  render() {

    var FormSchema = Forms.Form.extend(this.props.schema);

    return <form onSubmit={this._onSubmit}>
      <Forms.RenderForm form={FormSchema} ref="signupForm" data={{username: this.state.dataTest}}>
        <BootstrapForm/>
      </Forms.RenderForm>
      <button>Sign Up</button>
    </form>
  }

}

var _ = Underscore;

var currentWord;
var {Colors, Spacing, Typography} = Mui.Styles;

     // Query documents from Nuxeo
  var workspace;


function getData(client, word){

  //var _this = this;

  return new Promise(
        // The resolver function is called with the ability to resolve or
        // reject the promise
        function(resolve, reject) {

          client.operation('Document.Query')
            .params({
              query: "SELECT * FROM Document WHERE (ecm:uuid = '" + word + "' AND ecm:primaryType = 'Word')"
            })
          .execute(function(error, response) {

                // Handle error
            if (error) {
              throw error;
            }

            if (response.entries.length > 0) {
                currentWord = new Word(response.entries[0]);
                resolve(currentWord);
            } else {
              reject('Workspace not found');
            }

          });

        });
}

function getChildren(client, word){

  //var _this = this;

  return new Promise(
        // The resolver function is called with the ability to resolve or
        // reject the promise
        function(resolve, reject) {

          client.operation('Document.GetChildren')
          .input(word)
          /*.params({
              query: "SELECT * FROM Document WHERE (ecm:uuid = '" + word + "' AND ecm:primaryType = 'Word')"
          })*/
          .execute(function(error, response) {

                // Handle error
            if (error) {
              throw error;
            }

            if (response.entries.length > 0) {
                resolve(response.entries);
            } else {
              reject('Workspace not found');
            }

          });

        });
}

class WordEditView extends React.Component {

  constructor(props) {
    super(props);

   this.state = {
      word: null
   };

   /*getData(props.client, props.id).then((function(word){
      this.setState({
        word: word
      });
    }).bind(this));

   getChildren(props.client, props.id).then((function(children){
      this.setState({
        children: children
      });
    }).bind(this));*/
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

  componentDidMount() {
   // this.setState({ word: this.props.word });
  }


  render() {

      // Styles
      var DataGridStyles = {
        zIndex: 0
      };
          /*<CardMedia overlay={<CardTitle title="Title" subtitle="Subtitle"/>}>
            <img src="http://lorempixel.com/600/337/nature/"/>
          </CardMedia>*/
    return <div>
      <Signup schema={this.props.word.getSchema()} />
    </div>;
  }


}

WordEditView.contextTypes = {
  router: React.PropTypes.func
};

module.exports = WordEditView;