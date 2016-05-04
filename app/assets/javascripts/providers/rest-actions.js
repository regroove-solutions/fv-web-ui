import DocumentOperations from 'operations/DocumentOperations';

export default {
	fetch: function(key, type, properties) {
		return function fetch(pathOrId) {
			return function (dispatch) {

			    dispatch( { type: key + '_FETCH_START', pathOrId: pathOrId } );

			    return DocumentOperations.getDocument(pathOrId, type, { headers: properties.headers })
			    .then((response) => {
			      dispatch( { type: key + '_FETCH_SUCCESS', response: response, pathOrId: pathOrId } )
			    }).catch((error) => {
			        dispatch( { type: key + '_FETCH_ERROR', error: error, pathOrId: pathOrId } )
			    });
			}
		}
	},
	update: function(key, type, properties) {
		return function update(newDoc) {
			return function (dispatch) {

			    dispatch( { type: key + '_UPDATE_START', pathOrId: newDoc.path } );

			    return DocumentOperations.updateDocument(newDoc)
			      .then((response) => {
			        dispatch( { type: key + '_UPDATE_SUCCESS', response: response, pathOrId: newDoc.path } )
			      }).catch((error) => {
			          dispatch( { type: key + '_UPDATE_ERROR', error: error, pathOrId: newDoc.path } )
			    });
			}
		}
	}
}