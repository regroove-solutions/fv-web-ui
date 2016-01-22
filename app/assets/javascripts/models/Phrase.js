import { Model } from 'backbone';
import t from 'tcomb-form';
import _ from 'underscore';

export default class Phrase extends Model{

  constructor(options) {
    super(options);

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
    }

    this.idAttribute = 'uid';
    this.initialized = false;
  }

  get entityTypeName() {
    return 'FVPhrase';
  }

  setClient(client) {
    this.client = client;
  }

  getFieldPrefix(id){
    return (this.schema[id].prefix != undefined) ? this.schema[id].prefix + ':' + id : id;
  }

  getFieldData(id, props, data){
    return (data[this.getFieldPrefix(id)] != undefined || data[props.alias] != undefined) ? (data[this.getFieldPrefix(id)] || data[props.alias]) : data.properties[this.getFieldPrefix(id)];
  }

  initialize(data) {
    if (data != undefined ) {

      this.parts_speech = {};
      this.subjects = {};

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

  getFormSchemaDefaults() {

    var formFieldDefaults = {};

    _.each(this.schema, (function(fieldProps, fieldId){
      var id = this.getFieldPrefix(fieldId);
      if (fieldProps.editable == true){
       formFieldDefaults[id] = this.get(id);
      }
    }).bind(this));

    return formFieldDefaults;
  }
  
  getFormSchemaOptions() {

    var formSchemaOptions = {};

    _.each(this.schema, (function(fieldProps, fieldId){
      var id = this.getFieldPrefix(fieldId);

      if (fieldProps.editable == true){

        var fieldObj = {};

        if (this.schema[fieldId].label != undefined) {
          fieldObj['label'] = this.schema[fieldId].label;
        }

        if (this.schema[fieldId].displayType != undefined) {
          fieldObj['type'] = this.schema[fieldId].displayType;
        }

        formSchemaOptions[id] = fieldObj;
      }
    }).bind(this));

    return formSchemaOptions;
  }
}