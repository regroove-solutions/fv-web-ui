import _ from 'underscore';
import StringHelpers from 'common/StringHelpers';

// Models
import Word from 'models/Word';
import Words from 'models/Words';

export default {

  getMediaByWord(client, word, query = null) {

    return new Promise(
      // The resolver function is called with the ability to resolve or
      // reject the promise
      function(resolve, reject) {

        var related_media = word.get("fv:related_audio").concat(word.get("fv:related_pictures"), word.get("fv:related_video"));

        related_media = _.map(_.compact(related_media), function(value){ return "'" + value + "'"; }).join();

        var addQuery = "";

        if (query != null) {
          addQuery = " AND " + query;
        }

        client.operation('Document.Query')
          .params({
            query: "SELECT * FROM Document WHERE (ecm:uuid IN (" + related_media + ") AND ecm:currentLifeCycleState <> 'deleted' AND (ecm:primaryType = 'FVAudio' OR ecm:primaryType = 'FVVideo' OR ecm:primaryType = 'FVPicture'))" + addQuery
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
  getWordById(client, word) {
    return new Promise(
      // The resolver function is called with the ability to resolve or
      // reject the promise
      function(resolve, reject) {

        word = StringHelpers.clean(word);

        client.operation('Document.Query')
          .params({
            query: "SELECT * FROM FVWord WHERE (ecm:uuid = '" + word + "')"
          })
        .execute(function(error, response) {

          // Handle error
          if (error) {
            throw error;
          }

          if (response.entries.length > 0) {
            response.entries[0].client = client;
              resolve(new Word(response.entries[0]));
          } else {
            reject('Workspace not found');
          }

        });
    });
  },
  getWordsByDialect(client, dialect, query = null, headers = null, params = null) {
    return new Promise(
        function(resolve, reject) {

          if (headers != null)
            client.headers(headers);

          dialect = StringHelpers.clean(dialect);

          client.operation('Document.Query')
          .params({
            query: "SELECT * FROM FVDialect WHERE (dc:title = '" + dialect + "')"
          })
          .execute(function(error, response) {
            if (error) {
              throw error;
            }

            if (response != null && response.entries.length > 0) {
              var defaultParams = {};
              var workspaceID = response.entries[0].uid;
              var addQuery = "";

              if (query != null) {
                addQuery = " AND " + query;
              }

              workspaceID = StringHelpers.clean(workspaceID);

              // Change header to select only relevant schemas
              //client.header('X-NXproperties', 'fv-word');

              defaultParams.query = "SELECT * FROM FVWord WHERE (fva:dialect = '" + workspaceID + "' AND ecm:currentLifeCycleState <> 'deleted')" + addQuery + " ORDER BY dc:title";
              defaultParams = Object.assign(defaultParams, params);
              client.operation('Document.Query')
                .params(defaultParams)
                .execute(function(error, response) {

                  if (error) {
                    throw error;
                  }

                  var nuxeoListDocs = new Words(response.entries);

                  // Set client header to * (default)
                  client.header('X-NXproperties', '*');

                  resolve(nuxeoListDocs.toJSON());

                });
            } else {
              reject('Workspace not found');
            }
          });
    });
  },
  getWordCountByDialect (client, dialect, query = null, headers = null, params = null) {
    return new Promise(
        function(resolve, reject) {

          if (headers != null)
            client.headers(headers);

          dialect = StringHelpers.clean(dialect);

          client.operation('Document.Query')
          .params({
            query: "SELECT * FROM FVDialect WHERE (dc:title = '" + dialect + "')"
          })
          .execute(function(error, response) {
            if (error) {
              throw error;
            }

            if (response != null && response.entries.length > 0) {
              var defaultParams = {};
              var workspaceID = response.entries[0].uid;
              var addQuery = "";

              if (query != null) {
                addQuery = " AND " + query;
              }

              workspaceID = StringHelpers.clean(workspaceID);

              // Change header to select only relevant schemas
              //client.header('X-NXproperties', 'fv-word');

              defaultParams.query = "SELECT COUNT(ecm:uuid) FROM FVWord WHERE (fva:dialect = '" + workspaceID + "' AND ecm:currentLifeCycleState <> 'deleted')" + addQuery;
              defaultParams = Object.assign(defaultParams, params);

              client.operation('Repository.ResultSetPageProvider')
                .params(defaultParams)
                .execute(function(error, response) {

                  if (error) {
                    throw error;
                  }

                  client.header('X-NXproperties', '*');

                  // TODO: More predictable way to get this value
                  resolve(_.values(response.entries[0])[0]);

                });
            } else {
              reject('Workspace not found');
            }
          });
    });
  },

  /**
  * TODO: Change to more official method if exists?
  * Get Blob, Or https://github.com/dcodeIO/protobuf.js/wiki/How-to-read-binary-data-in-the-browser-or-under-node.js%3F
  * https://github.com/request/request/issues/1796
  */
  getMediaBlobById(client, media, mimeType, xpath = 'file:content') {

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

        request.open("POST", client._baseURL + "/site/automation/Blob.Get", true);
        request.responseType = "arraybuffer";
        request.setRequestHeader("authorization", "Basic " + window.btoa(unescape(encodeURIComponent(client._auth.username + ":" + client._auth.password))));
        request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        request.setRequestHeader("Content-Type", "application/json+nxrequest");
        request.send(JSON.stringify({input: media, params: {xpath: xpath}}));

    });
  }
}