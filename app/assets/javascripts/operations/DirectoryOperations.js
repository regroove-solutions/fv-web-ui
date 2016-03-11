/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
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

export default class DirectoryOperations {

  constructor(directoryType, directoryTypePlural, client, properties = []){
    this.directoryType = directoryType;
    this.directoryTypePlural = directoryTypePlural;
    this.client = client;
    this.properties = properties;

    this.selectDefault = "ecm:currentLifeCycleState <> 'deleted'";
  }

  /**
  * Get all documents of a certain type based on a path
  * These documents are expected to contain other entries
  * E.g. FVFamily, FVLanguage, FVDialect
  */
  getDocumentsByPath(path = "", headers = null, params = null) {
    // Expose fields to promise
    let client = this.client;
    let selectDefault = this.selectDefault;
    let domain = this.properties.domain;

    path = StringHelpers.clean(path);

    // Initialize and empty document list from type
    let documentList = new this.directoryTypePlural(null);

    return new Promise(
        // The resolver function is called with the ability to resolve or
        // reject the promise
        function(resolve, reject) {

          let defaultParams = {
            query: 
              "SELECT * FROM " + documentList.model.prototype.entityTypeName + " WHERE (ecm:path STARTSWITH '/" + domain + path + "' AND " + selectDefault + ") ORDER BY dc:title"
          };

          let defaultHeaders = {};

          params = Object.assign(defaultParams, params);
          headers = Object.assign(defaultHeaders, headers);

          client.operation('Document.Query')
            .params(params)
            .execute(headers).then((response) => {

              if (response.entries && response.entries.length > 0) {
                
                documentList.add(response.entries);
                documentList.totalResultSize = response.totalSize;

                resolve(documentList);
              } else {
                reject('No ' + documentList.model.prototype.entityTypeName +' found');
              }
          }).catch((error) => { throw error });
    });
  }

  // Unused methods below (needs refactoring or removing soon)
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
  }
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
  }
  getWordsByLangauge (client, language) {
    return new Promise(
        // The resolver function is called with the ability to resolve or
        // reject the promise
        function(resolve, reject) {

          language = StringHelpers.clean(StringHelpers);

          client.operation('Document.Query')
            .params({
              query: "SELECT * FROM Document WHERE (dc:title = '" + language + "' AND ecm:primaryType = 'Workspace' AND ecm:currentLifeCycleState <> 'deleted'))"
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