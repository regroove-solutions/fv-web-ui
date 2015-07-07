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
       this.set('text', data.title);
       this.set('description', data.properties['dc:description']);
       this.set('definitions', data.properties['fv:definitions']);
       this.set('pronunciation', data.properties['fv:pronunciation']);
       this.set('part_of_speech', data.properties['fv:part_of_speech']);
       this.set('subjects', data.properties['dc:subjects']);


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
        word: t.Str,
        description: t.Str,
        definitions: t.list(t.Str),
        pronunciation: t.Str,
        part_of_speech: t.enums(this.parts_speech),
        subjects: t.list(t.enums(this.subjects))
      });
    }
});

module.exports = Word;