var Backbone = require('backbone');
var t = require('tcomb-form');
var _ = require('underscore');

var Dialect = Backbone.Model.extend({
    schema: {
      'id': {
        'alias': 'uid',
        'type': t.Str
      },
      'title': {
        'prefix' : 'dc',
        'type': t.Str,
        'editable': true,
        'label': 'Dialect'
      },
      'description': {
          'prefix' : 'dc',
          'type': t.Str,
          'editable': true,
          'label': 'Description'
      },
      'country': {
          'prefix' : 'fvdialect',
          'type': t.Str,
          'editable': true,
          'label': 'Country'
      },
      'region': {
          'prefix' : 'fvdialect',
          'type': t.Str,
          'editable': true,
          'label': 'Region'
      },
      'dominant_language': {
          'prefix' : 'fvdialect',
          'type': t.Str,
          'editable': true,
          'label': 'Dominant Language'
      },
      'language': {
          'prefix' : 'fva',
          'type': t.Str,
          'editable': false,
          'label': 'Parent Language'
      },
      'family': {
          'prefix' : 'fva',
          'type': t.Str,
          'editable': false,
          'label': 'Parent Family'
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

        _.each(this.schema, (function(fieldProps, fieldId){
          this.set(this.getFieldPrefix(fieldId), this.getFieldData(fieldId, fieldProps, data));
        }).bind(this));

        this.initialized = true;
      }
    },
    getFormSchema: function(values) {

      var formFields = {};

      _.each(this.schema, (function(fieldProps, fieldId){
        if (fieldProps.editable == true){
         formFields[this.getFieldPrefix(fieldId)] = fieldProps.type; 
        }
      }).bind(this));

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

module.exports = Dialect;