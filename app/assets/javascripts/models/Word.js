var Backbone = require('backbone');
var Forms = require('newforms');
var t = require('tcomb-form');
var _ = require('underscore');

var Word = Backbone.Model.extend({
    idAttribute: 'uid',
    initialized: false,
    setClient: function (client){
      this.client = client;
    },
    initialize: function (data){
   if (data != undefined && data.parentRef != null && data.parentRef.length > 0 ) {

       var setParent = data.parentRef;

       if (data.type== "Workspace") {
               setParent = "#";
       }

      this.parts_speech = {};
      this.subjects = {};

       this.set('parent', setParent);
       this.set('id', data.uid);
       this.set('dc:title', data.title);
       this.set('dc:description', data.properties['dc:description']);
       this.set('fv:definitions', data.properties['fv:definitions']);
       this.set('fv:pronunciation', data.properties['fv:pronunciation']);
       this.set('fv:part_of_speech', data.properties['fv:part_of_speech']);
       this.set('dc:subjects', data.properties['dc:subjects']);


       this.initialized = true;
   }
        },

    getFormSchema: function(values) {
      if (values.parts_speech != null) {
        this.parts_speech = values.parts_speech;
      }

      if (values.subjects != null) {
        this.subjects = values.subjects;
      }

      return t.struct({
        'dc:title': t.Str,
        'dc:description': t.Str,
        'fv:pronunciation': t.Str,
        'fv:part_of_speech': t.enums(this.parts_speech),
        'fv:definitions': t.list(t.Str),
        'dc:subjects': t.list(t.enums(this.subjects))
      });
    }
});

module.exports = Word;