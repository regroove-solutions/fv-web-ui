var Backbone = require('backbone');
var t = require('tcomb-form');
var _ = require('underscore');

var Word = require('models/Word');
var Words = require('models/Words');

var DirectoryOperations = {
  getSubjects: function (client) {
    return new Promise(
    function(resolve, reject) {

        client.request('directory/subtopic')
       .get(function(error, data) {
         if (error) {
           // something went wrong
           throw error;
         }

        if (data.entries.length > 0) {
            //entry.properties.label
            var subtopics = _.object(_.map(data.entries, function(entry){ return [entry.properties.id, entry.properties.id]; }));
            resolve(subtopics);
        } else {
          reject('Workspace not found');
        }

      });
    });
  },
  getPartsOfSpeech: function (client) {
    return new Promise(
      function(resolve, reject) {

          client.request('directory/parts_speech')
         .get(function(error, data) {
           if (error) {
             // something went wrong
             throw error;
           }

          if (data.entries.length > 0) {
            //entry.properties.label
              var parts_speech = _.object(_.map(data.entries, function(entry){ return [entry.properties.id, entry.properties.id]; }));
              resolve(parts_speech);
          } else {
            reject('Workspace not found');
          }

        });

      });
  },
  getWordsByLangauge : function (client, language) {
    return new Promise(
        // The resolver function is called with the ability to resolve or
        // reject the promise
        function(resolve, reject) {

          client.operation('Document.Query')
            .params({
              query: "SELECT * FROM Document WHERE (dc:title = '" + language + "' AND ecm:primaryType = 'Workspace')"
            })
          .execute(function(error, response) {
            if (error) {
              throw error;
            }
            // Create a Workspace Document based on returned data
            
            if (response.entries.length > 0) {
              var workspaceID = response.entries[0].uid;

              client.operation('Document.Query')
                .params({
                  query: "SELECT * FROM Document WHERE (ecm:parentId = '" + workspaceID + "' AND ecm:primaryType = 'Word' AND ecm:currentLifeCycleState <> 'deleted')"
                })
              .execute(function(error, response) {

                    // Handle error
                if (error) {
                  throw error;
                }

                var nuxeoListDocs = new Words(response.entries);
                resolve(nuxeoListDocs.toJSON());

              });
            } else {
              reject('Workspace not found');
            }

          });
    });
  }
}

module.exports = DirectoryOperations;