var React = require('react');
var t = require('tcomb-form');
var Form = t.form.Form;

var Underscore = require('underscore');
var _ = Underscore;

var classNames = require('classnames');
var Mui = require('material-ui');
var {
      Card, CardHeader, CardMedia, CardTitle, CardActions, CardText, Avatar, FlatButton,
      Toolbar, ToolbarGroup, ToolbarTitle, ToolbarSeparator, DropDownMenu, DropDownIcon, FontIcon, RaisedButton,
      Tabs, Tab,
      Dialog
    } = Mui;

var Word = require('models/Word');

//var DataGrid = require('react-datagrid');

//require('!style!css!react-datagrid/dist/index.min.css');

// Typeahead - https://github.com/gcanti/tcomb-form/issues/138

 function getSubjects(client) {

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

    }


  function getPartsOfSpeech(client) {

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

    }

class FormSample2 extends React.Component {

  constructor(props) {
    super(props);

    //this._getPartsOfSpeech = this._getPartsOfSpeech.bind(this);
    //this._getSubjects = this._getSubjects.bind(this);
    this._change = this._change.bind(this);
    this._save = this._save.bind(this);

   this.state = {
      schema: null,
      value: {
        'dc:title': this.props.word.get('dc:title'),
        'dc:description': props.word.get('dc:description'),
        'fv:definitions': props.word.get('fv:definitions'),
        'fv:pronunciation': props.word.get('fv:pronunciation'),
        'fv:part_of_speech': props.word.get('fv:part_of_speech'),
        'dc:subjects': props.word.get('dc:subjects')
      },
      options: {
        fields: {
          'dc:title': {
            label: 'Word'
          },
          'dc:description': {
            label: 'Cultural Note',
            type: 'textarea'
          },
          'fv:definitions': {
            label: 'Definitions'
          },
          'fv:pronunciation': {
            label: 'Pronunciation'
          },
          'fv:part_of_speech': {
            label: 'Part of Speech'
          },
          'dc:subjects': {
            label: 'Subjects'
          }
        },
        config: {
          // for each of lg md sm xs you can specify the columns width
          horizontal: {
            md: [3, 9],
            sm: [6, 6]
          }
        },
        i18n: {
          add: 'New Item',
          down: '▼',
          remove: 'Delete',
          up: '▲',
          optional: '(optional)'
        }
      },
      word: props.word,
   };

   getPartsOfSpeech(props.client).then((function(parts_speech_val){

      this.setState({
        schema: props.word.getFormSchema({parts_speech: parts_speech_val})
      });
    }).bind(this));

   getSubjects(props.client).then((function(subjects_val){
      this.setState({
        schema: props.word.getFormSchema({subjects: subjects_val})
      });
    }).bind(this));

  }

  _change(value) {
    this.setState({value});
  }

  _save(evt) {

    var client = this.state.word.get('client');
    var value = this.refs.form.getValue();

    var self = this;
    // if validation fails, value will be null
    if (value) {
      client.document(this.state.word.get('id'))
       .fetch(function(error, doc) {
         if (error) {
           throw error;
         }

          doc.set(value);
          doc.save(function(error, doc) {
            location.reload();
          });
       });
   }

   evt.preventDefault();    
  }

  render() {

var form = "";

if (this.state.schema != undefined){
 form = <form onSubmit={this._save}>
        <Form
          ref="form"
          options={this.state.options}
          type={this.state.schema} 
          value={this.state.value}
          onChange={this._change} />
          <button type="submit" className={classNames('btn', 'btn-primary')}>Save Changes</button>
      </form>;
}

    return (
      <div className="form-horizontal">
        {form}
      </div>
    );
  }


}

class WordEditView extends React.Component {

  constructor(props) {
    super(props);

   this.state = {
      word: props.word
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
      <FormSample2 client={this.props.client} word={this.props.word}/>
    </div>;
  }


}

WordEditView.contextTypes = {
  router: React.PropTypes.func
};

module.exports = WordEditView;