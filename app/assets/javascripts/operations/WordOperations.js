var Backbone = require('backbone');
var t = require('tcomb-form');
var _ = require('underscore');

var Word = require('models/Word');
var Words = require('models/Words');

var ConfGlobal = require('../configuration/Global.json');

var WordOperations = {
  getMediaByWord: function (client, word, query = null) {

    return new Promise(
      // The resolver function is called with the ability to resolve or
      // reject the promise
      function(resolve, reject) {

        var addQuery = "";

        if (query != null) {
          addQuery = " AND " + query;
        }

        client.operation('Document.Query')
          .params({
            query: "SELECT * FROM Document WHERE (ecm:parentId = '" + word + "' AND ecm:currentLifeCycleState <> 'deleted' AND (ecm:primaryType = 'Audio' OR ecm:primaryType = 'Video' OR ecm:primaryType = 'Picture'))" + addQuery
          })
        .execute(function(error, response) {

              // Handle error
          if (error) {
            throw error;
          }

          if (response.entries.length > 0) {
            resolve(response.entries);
          } else {
            reject('Workspace not found');
          }

        });
    });
  },
  getWordById: function (client, word) {
    return new Promise(
      // The resolver function is called with the ability to resolve or
      // reject the promise
      function(resolve, reject) {

        client.operation('Document.Query')
          .params({
            query: "SELECT * FROM Document WHERE (ecm:uuid = '" + word + "' AND ecm:primaryType = 'Word')"
          })
        .execute(function(error, response) {

              // Handle error
          if (error) {
            throw error;
          }

          if (response.entries.length > 0) {
            response.entries[0].client = client;
              var currentWord = new Word(response.entries[0]);
              resolve(new Word(response.entries[0]));
          } else {
            reject('Workspace not found');
          }

        });
    });
  },
  getWordsByLangauge : function (client, language, query = null) {
    return new Promise(
        function(resolve, reject) {

          client.operation('Document.Query')
            .params({
              query: "SELECT * FROM Document WHERE (dc:title = '" + language + "' AND ecm:primaryType = 'Workspace')"
            })
          .execute(function(error, response) {
            if (error) {
              throw error;
            }

            if (response != null && response.entries.length > 0) {
              var workspaceID = response.entries[0].uid;

              var addQuery = "";

              if (query != null) {
                addQuery = " AND " + query;
              }

              client.operation('Document.Query')
                .params({
                  query: "SELECT * FROM Document WHERE (ecm:parentId = '" + workspaceID + "' AND ecm:primaryType = 'Word' AND ecm:currentLifeCycleState <> 'deleted')" + addQuery
                })
              .execute(function(error, response) {

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
  getMediaBlobById: function (client, media, mimeType) {

    return new Promise(
        function(resolve, reject) {

			var request = new XMLHttpRequest();

			request.onload = function(e) {
				if (request.readyState == 4) {
				    var uInt8Array = new Uint8Array(this.response);
				    var i = uInt8Array.length;
				    var biStr = new Array(i);
				    while (i--) { 
				    	biStr[i] = String.fromCharCode(uInt8Array[i]);
				    }
				    var data = biStr.join('');
				    var base64 = window.btoa(data);

					var dataUri = 'data:' + mimeType + ';base64,' + base64;
					resolve({dataUri: dataUri, mediaId: media});
				} else {
					reject("Media not found");
				}
			}

			request.open("POST", ConfGlobal.baseURL + "/site/automation/Blob.Get", true);
			request.responseType = "arraybuffer";
			request.setRequestHeader("authorization", "Basic d2ViYXBwOjB2dldYMDlwNngwYTgzUw==");
			request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			request.setRequestHeader("Content-Type", "application/json");
			request.send(JSON.stringify({input: media, xpath: 'file:content'}));

    });
  }
}

module.exports = WordOperations;