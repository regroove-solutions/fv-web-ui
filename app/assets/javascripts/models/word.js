var Backbone = require('backbone');
var Forms = require('newforms');

var Word = Backbone.Model.extend({
    idAttribute: 'uid',
    initialize: function (data){
   if (data != undefined && data.parentRef != null && data.parentRef.length > 0 ) {

       var setParent = data.parentRef;

       if (data.type== "Workspace") {
               setParent = "#";
       }

       this.set('parent', setParent);
       this.set('id', data.uid);
       this.set('text', data.title);
       this.set('description', data.properties['dc:description']);
       this.set('definitions', data.properties['fv:definitions']);
       this.set('pronunciation', data.properties['fv:pronunciation']);
       this.set('part_of_speech', data.properties['fv:part_of_speech']);
       this.set('subjects', data.properties['dc:subjects']);
   }
        },
    getSchema: function() {
      //console.log(this);
        return {
          username: Forms.CharField({maxLength: 20}),
          email: Forms.CharField({maxLength: 20})
          // ...
        }
    }
});

module.exports = Word;