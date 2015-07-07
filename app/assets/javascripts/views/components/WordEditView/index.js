var React = require('react');
var Forms = require('newforms');
var ReactBackbone = require('backbone-react-component');

var t = require('tcomb-form');
var Form = t.form.Form;


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

// Typeahead - https://github.com/gcanti/tcomb-form/issues/138

// define your domain model with tcomb
// https://github.com/gcanti/tcomb
var Person = t.struct({
  name: t.Str,
  surname: t.Str
});

var FormSample = React.createClass({

  componentDidMount() {
      this._getPartsOfSpeech(this.props.model.get('client')).then((function(parts_speech_val){
      this.setState({
        schema: this.props.model.getFormSchema({parts_speech: parts_speech_val})
      });
    }).bind(this));

      this._getSubjects(this.props.model.get('client')).then((function(subjects_val){
      this.setState({
        schema: this.props.model.getFormSchema({subjects: subjects_val})
      });
    }).bind(this));
  },

  getInitialState() {
    //console.log(this.props.model.get('parts_speech'));
    return {
      value: {
        word: this.props.model.get('text'),
        description: this.props.model.get('description'),
        definitions: this.props.model.get('definitions'),
        pronunciation: this.props.model.get('pronunciation'),
        part_of_speech: this.props.model.get('part_of_speech'),
        subjects: this.props.model.get('subjects')
      },
      schema: this.props.model.getFormSchema({})
    };
  },

    _getSubjects: function(client) {

  //var _this = this;

  return new Promise(
        // The resolver function is called with the ability to resolve or
        // reject the promise
        function(resolve, reject) {

            client.request('directory/subtopic')
           .get(function(error, data) {
             if (error) {
               // something went wrong
               throw error;
             }

            if (data.entries.length > 0) {
                var subtopics = _.object(_.map(data.entries, function(entry){ return [entry.properties.id, entry.properties.label]; }));
                resolve(subtopics);
            } else {
              reject('Workspace not found');
            }

          });

        });

    },


    _getPartsOfSpeech: function(client) {

  //var _this = this;

  return new Promise(
        // The resolver function is called with the ability to resolve or
        // reject the promise
        function(resolve, reject) {

            client.request('directory/parts_speech')
           .get(function(error, data) {
             if (error) {
               // something went wrong
               throw error;
             }

            if (data.entries.length > 0) {
                var parts_speech = _.object(_.map(data.entries, function(entry){ return [entry.properties.id, entry.properties.label]; }));
                resolve(parts_speech);
            } else {
              reject('Workspace not found');
            }

          });

        });

    },

  onChange(value) {
    this.setState({value});
  },

  save(e) {
    // call getValue() to get the values of the form
    var value = this.refs.form.getValue();
    // if validation fails, value will be null
    if (value) {
      // value here is an instance of Person
      console.log(value);
    }

    e.preventDefault();
  },

  render() {

    return (
      <div>
        <Form
          ref="form"
          value={this.state.value}
          type={this.state.schema}
        />
        <button onClick={this.save}>Save</button>
      </div>
    );
  }

});


class Signup extends React.Component {

  constructor(props) {
    super(props);
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
      <Forms.RenderForm form={FormSchema} ref="signupForm">
        <BootstrapForm/>
      </Forms.RenderForm>
      <button>Sign Up {this.state.model}</button>
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
      word: props.word
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
  }


  render() {

      // Styles
      var DataGridStyles = {
        zIndex: 0
      };

    return <div>
      <FormSample model={this.props.word}/>
    </div>;
  }


}

WordEditView.contextTypes = {
  router: React.PropTypes.func
};

module.exports = WordEditView;