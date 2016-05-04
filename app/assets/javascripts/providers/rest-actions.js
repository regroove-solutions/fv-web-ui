import DocumentOperations from 'operations/DocumentOperations';

export default {
	create: function(key, type, properties) {
		return function create(parentDoc, docParams, file = null, timestamp) {
			return function (dispatch) {

				// timestamp specified as we can't rely on pathOrId to be unique at this point
				let pathOrId = parentDoc + '/' + docParams.name + '.' + timestamp;

			    dispatch( { type: key + '_CREATE_START', pathOrId: pathOrId } );

			    let createMethod = DocumentOperations.createDocument(parentDoc, docParams)

			    if (file) {
			    	createMethod = DocumentOperations.createDocumentWithBlob(parentDoc, docParams, file);
			    }

			    return createMethod.then((response) => {
			      dispatch( { type: key + '_CREATE_SUCCESS', message: 'Document created successfully!', response: response, pathOrId: pathOrId } )
			    }).catch((error) => {
			        dispatch( { type: key + '_CREATE_ERROR', message: error, pathOrId: pathOrId } )
			    });
			}
		}
	},
	fetch: function(key, type, properties) {
		return function fetch(pathOrId) {
			return function (dispatch) {

			    dispatch( { type: key + '_FETCH_START', pathOrId: pathOrId } );

			    return DocumentOperations.getDocument(pathOrId, type, { headers: properties.headers })
			    .then((response) => {
			      dispatch( { type: key + '_FETCH_SUCCESS', message: 'Document retrieved successfully!', response: response, pathOrId: pathOrId } )
			    }).catch((error) => {
			        dispatch( { type: key + '_FETCH_ERROR', message: error, pathOrId: pathOrId } )
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
			        dispatch( { type: key + '_UPDATE_SUCCESS', message: 'Document updated successfully!', response: response, pathOrId: newDoc.path } )
			      }).catch((error) => {
			          dispatch( { type: key + '_UPDATE_ERROR', message: error, pathOrId: newDoc.path } )
			    });
			}
		}
	}
}
