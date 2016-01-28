var React = require('react');
var t = require('tcomb-form');
var Form = t.form.Form;

var classNames = require('classnames');

// Models
import Word from 'models/Word';
import Words from 'models/Words';

// Operations
import DocumentOperations from 'operations/DocumentOperations';

class EditForm extends React.Component {

  constructor(props) {
    super(props);

    this._change = this._change.bind(this);
    this._save = this._save.bind(this);

    this.state = {
      schema: null,
        value: props.word.getFormSchemaDefaults(),
      options: {
        fields: props.word.getFormSchemaOptions(),
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
          remove: 'X',
          up: '▲',
          optional: '(optional)'
        }
      }
    };

    DirectoryOperations.getPartsOfSpeech(props.client).then((function(parts_speech_val){
      this.setState({
        schema: props.word.getFormSchema({parts_speech: parts_speech_val})
      });
    }).bind(this));

    DirectoryOperations.getSubjects(props.client).then((function(subjects_val){
      this.setState({
        schema: props.word.getFormSchema({subjects: subjects_val})
      });
    }).bind(this));
  }

  _change(value) {
    this.setState({value});
  }

  _save(evt) {

    var client = this.props.word.get('client');
    var value = this.refs.form.getValue();

    var self = this;

    if (value) {
      client.document(this.props.word.get('id'))
       .fetch(function(error, doc) {
         if (error) {
           throw error;
         }

          doc.set(value);
          doc.save(function(error, doc) {
            self.props.router.navigate("browse/word/" + doc.uid , {trigger: true});
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

    this.wordOperations = new DocumentOperations(Word, Words, context.client, { domain: context.siteProps.domain });

   this.state = {
      word: null
   };

   this.wordOperations.getDocumentByID(props.id).then((function(word){
      this.setState({
        word: word
      });
    }).bind(this));

  }

  render() {

    if (this.state.word != null) {
      var renderForm = <EditForm 
                        client={this.props.client}
                        router={this.props.router}
                        word={this.state.word}/>;
    }

    return <div>
      {renderForm}
    </div>;
  }


}

WordEditView.contextTypes = {
  router: React.PropTypes.func
};

module.exports = WordEditView;