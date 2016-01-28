import Document from 'models/Document';
import t from 'tcomb-form';
import _ from 'underscore';

export default class Word extends Document {

  constructor(data) {
    super(data);

    this.idAttribute = 'uid';
    this.initialized = false;

    this.schema = {
      'id': {
        'alias': 'uid',
        'type': t.Str
      },
      'title': {
        'prefix' : 'dc',
        'type': t.Str,
        'editable': true,
        'label': 'Word'
      },
      'cultural_note': {
        'prefix' : 'fv',
        'type': t.list(t.Str),
        'editable': true,
        'displayType': 'textarea',
        'label': 'Cultural Note'
      },
      'definitions': {
        'prefix' : 'fv',
        'type': t.list(t.Str),
        'editable': true,
        'label': 'Definitions'
      },
      'categories': {
        'prefix' : 'fv-word',
        'type': t.list(t.Object),
        'editable': true,
        'label': 'Categories'
      },
      'literal_translation': {
        'prefix' : 'fv',
        'type': t.Str,
        'editable': true,
        'label': 'Literal Translation'
      },
      'pronunciation': {
        'prefix' : 'fv-word',
        'type': t.Str,
        'editable': true,
        'label': 'Pronunciation'
      },
      'related_pictures': {
        'prefix' : 'fv',
        'type': t.list(t.Str),
        'editable': true,
        'label': 'Related Pictures'
      },
      'related_audio': {
        'prefix' : 'fv',
        'type': t.list(t.Str),
        'editable': true,
        'label': 'Related Audio'
      },
      'related_videos': {
        'prefix' : 'fv',
        'type': t.list(t.Str),
        'editable': true,
        'label': 'Related Videos'
      },
      'related_phrases': {
        'prefix' : 'fv-word',
        'type': t.list(t.Str),
        'editable': true,
        'label': 'Related Phrases'
      },
      'source': {
        'prefix' : 'fv',
        'type': t.list(t.Str),
        'editable': true,
        'label': 'Source'
      },
      'part_of_speech': {
        'prefix' : 'fv-word',
        'type': t.Str,
        'editable': true,
        'label': 'Part of Speech'
      },
      'private': {
        'prefix' : 'fv',
        'type': t.Bool,
        'editable': true,
        'label': 'Private'
      },
      'subjects': {
        'prefix' : 'dc',
        'type': t.Str,
        'editable': true,
        'label': 'Subjects'
      }
    };


    if (data != undefined ) {

      this.parts_speech = {};
      this.subjects = {};

      // TODO: Experiment with changing this to "map" to avoid including underscore, see https://babeljs.io/docs/learn-es2015/#map-set-weak-map-weak-set
      _.each(this.schema, (function(fieldProps, fieldId){
        this.set(this.getFieldPrefix(fieldId), this.getFieldData(fieldId, fieldProps, data));
      }).bind(this));

      this.initialized = true;
    }
  }

  getFormSchema(values) {

    var formFields = {};

    if (values.parts_speech != null) {
      this.parts_speech = values.parts_speech;
    }

    if (values.subjects != null) {
      this.subjects = values.subjects;
    }

    _.each(this.schema, (function(fieldProps, fieldId){
      if (fieldProps.editable == true){
       formFields[this.getFieldPrefix(fieldId)] = fieldProps.type; 
      }
    }).bind(this));

    formFields[this.getFieldPrefix('part_of_speech')] = t.enums(this.parts_speech);
    formFields[this.getFieldPrefix('subjects')] = t.list(t.enums(this.subjects));

    return t.struct(formFields);
  }

  get entityTypeName() {
    return 'FVWord';
  }
}