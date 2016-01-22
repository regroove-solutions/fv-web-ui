import _ from 'underscore';
import StringHelpers from 'common/StringHelpers';

// Models
import Words from 'models/Words';
import LanguageFamily from 'models/LanguageFamily';
import LanguageFamilies from 'models/LanguageFamilies';
import Languages from 'models/Languages';
import Language from 'models/Language';
import Dialect from 'models/Dialect';
import Dialects from 'models/Dialects';

export default {
  getSubjects(client) {
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
  getPartsOfSpeech(client) {
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
  getWordsByLangauge (client, language) {
    return new Promise(
        // The resolver function is called with the ability to resolve or
        // reject the promise
        function(resolve, reject) {

          language = StringHelpers.clean(StringHelpers);

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
  },
  getLanguageFamilies (client) {
	    return new Promise(
	        // The resolver function is called with the ability to resolve or
	        // reject the promise
	        function(resolve, reject) {

	          client.operation('Document.Query')
	            .params({
	              query: "SELECT * FROM Document WHERE (ecm:primaryType = 'FVLanguageFamily' AND ecm:currentLifeCycleState <> 'deleted') ORDER BY dc:title"
	           })
	          .execute(function(error, response) {
	            if (error) {
	              throw error;
	            }	            
	            if (response.entries.length > 0) {
	                var nuxeoListDocs = new LanguageFamilies(response.entries);
	                resolve(nuxeoListDocs);
	            } else {
	              reject('No Language Families found');
	            }
	          });
	    });
	  },
  
  getLanguages (client, family) {
	  return new Promise(
		  // The resolver function is called with the ability to resolve or
		  // reject the promise
		  function(resolve, reject) {
			  
			  // Escape single quotes
			  family = StringHelpers.clean(family);
			  
			  client.operation('Document.Query')
			  .params({
				  query: "SELECT * FROM FVLanguageFamily WHERE (dc:title = '" + family + "' AND ecm:currentLifeCycleState <> 'deleted')"
			  })
			  .execute(function(error, response) {
				  if (error) {
					  throw error;
				  }
				  if (response != null && response.entries.length > 0) {
				      var familyID = response.entries[0].uid;
				      //console.log(familyID);
				      
		              client.operation('Document.Query')
		                .params({
		                  query: "SELECT * FROM FVLanguage WHERE (fva:family = '" + familyID + "' AND ecm:currentLifeCycleState <> 'deleted') ORDER BY dc:title"
		                })
		              .execute(function(error, response) {
		                if (error) {
		                  throw error;
		                }
			            var nuxeoListDocs = new Languages(response.entries);
			            resolve(nuxeoListDocs);
		              });      
				  }				  
			  });
	  });  
  },
  
  getDialects(client) {
	  return new Promise(
		  // The resolver function is called with the ability to resolve or
		  // reject the promise
		  function(resolve, reject) {
        client
          .operation('Document.Query')
          .params({
              query: "SELECT * FROM FVDialect WHERE ecm:currentLifeCycleState <> 'deleted' ORDER BY dc:title"
          })
          .execute({headers: { 'X-NXenrichers.document': 'parentDoc' }}, function(error, response) {
            if (error) {
              throw error;
            }
            
            resolve(new Dialects(response.entries));
          });

      });  
  },

  getDialectsByLanguage(client, family, language) {
	  return new Promise(
		  // The resolver function is called with the ability to resolve or
		  // reject the promise
		  function(resolve, reject) {

			  // Escape single quotes
			  language = StringHelpers.clean(language);
        family = StringHelpers.clean(family);
        
        client.operation('Document.Query').params({
            query: "SELECT * FROM FVDialect WHERE (ecm:path STARTSWITH '/default-domain/workspaces/FVData/" + family + "/" + language + "' AND ecm:currentLifeCycleState <> 'deleted') ORDER BY dc:title"
        })
        .execute(function(error, response) {
          if (error) {
            throw error;
          }

          resolve(new Dialects(response.entries));
        });
	  });  
  },

  getDialectByPath(client, family, language, dialect) {
    return new Promise(
      // The resolver function is called with the ability to resolve or
      // reject the promise
      function(resolve, reject) {

        // Escape single quotes
        language = StringHelpers.clean(language);
        family = StringHelpers.clean(family);
        dialect = StringHelpers.clean(dialect);
        
        client.operation('Document.Query')
          .params({
            query: "SELECT * FROM FVDialect WHERE (ecm:path STARTSWITH '/default-domain/workspaces/FVData/" + family + "/" + language + "' AND dc:title LIKE '" + dialect + "' AND ecm:currentLifeCycleState <> 'deleted') ORDER BY dc:title"
          })
        .execute(function(error, response) {
          if (error) {
            throw error;
          }
          resolve(new Dialect(response.entries[0]));
        });
    });  
  }
}