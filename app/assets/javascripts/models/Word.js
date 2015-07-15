var Backbone = require('backbone');
var t = require('tcomb-form');
var _ = require('underscore');

var Word = Backbone.Model.extend({
    schema: {
      'id': {
        'alias': 'uid',
        'type': t.Str
      },
      'title': {
        'prefix' : 'dc',
        'type': t.Str,
        'editable': true,
        'label': 'Title'
      },
      'description': {
        'prefix' : 'dc',
        'type': t.Str,
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
      'pronunciation': {
        'prefix' : 'fv',
        'type': t.Str,
        'editable': true,
        'label': 'Pronunciation'
      },
      'part_of_speech': {
        'prefix' : 'fv',
        'type': t.Str,
        'editable': true,
        'label': 'Part of Speech'
      },
      'subjects': {
        'prefix' : 'dc',
        'type': t.Str,
        'editable': true,
        'label': 'Subjects'
      }
    },
    idAttribute: 'uid',
    initialized: false,
    setClient: function (client){
      this.client = client;
    },
    getFieldPrefix: function(id){
      return (this.schema[id].prefix != undefined) ? this.schema[id].prefix + ':' + id : id;
    },
    getFieldData: function(id, props, data){
      return (data[this.getFieldPrefix(id)] != undefined || data[props.alias] != undefined) ? (data[this.getFieldPrefix(id)] || data[props.alias]) : data.properties[this.getFieldPrefix(id)];
    },
    initialize: function (data){
      if (data != undefined ) {
        this.parts_speech = {};
        this.subjects = {};

        _.each(this.schema, (function(fieldProps, fieldId){
          this.set(this.getFieldPrefix(fieldId), this.getFieldData(fieldId, fieldProps, data));
        }).bind(this));

        this.initialized = true;
      }
    },
    getFormSchema: function(values) {

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
    },
    getFormSchemaDefaults: function() {

      var formFieldDefaults = {};

      _.each(this.schema, (function(fieldProps, fieldId){
        var id = this.getFieldPrefix(fieldId);
        if (fieldProps.editable == true){
         formFieldDefaults[id] = this.get(id);
        }
      }).bind(this));

      return formFieldDefaults;
    },
    getFormSchemaOptions: function() {

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
});

module.exports = Word;