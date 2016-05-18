import DocumentOperations from 'operations/DocumentOperations';
import DirectoryOperations from 'operations/DirectoryOperations';

export default {
	create: function(key, type, properties = {}) {
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
	fetch: function(key, type, properties = {}) {
		return function fetch(pathOrId, messageStart = null, messageSuccess = null, messageError = null) {
			return function (dispatch) {

			    dispatch( { type: key + '_FETCH_START', pathOrId: pathOrId, message: (messageStart || 'Fetch started...') } );

				    return DocumentOperations.getDocument(pathOrId, type, { headers: properties.headers })
				    .then((response) => {
				      dispatch( { type: key + '_FETCH_SUCCESS', message: messageSuccess, response: response, pathOrId: pathOrId } )
				    }).catch((error) => {
				        dispatch( { type: key + '_FETCH_ERROR', message: (messageError || error), pathOrId: pathOrId } )
				    });
			}
		}
	},
	query: function(key, type, properties = {}) {
		return function query(pathOrId, queryAppend, messageStart = null, messageSuccess = null, messageError = null) {
			return function (dispatch) {

			    dispatch( { type: key + '_QUERY_START', pathOrId: pathOrId, message: (messageStart || 'Fetch started...') } );

			    	return DirectoryOperations.getDocumentByPath2(pathOrId, type, properties.queryAppend || queryAppend, { headers: properties.headers })
				    .then((response) => {
				      dispatch( { type: key + '_QUERY_SUCCESS', message: messageSuccess, response: response, pathOrId: pathOrId } )
				    }).catch((error) => {
				        dispatch( { type: key + '_QUERY_ERROR', message: (messageError || error), pathOrId: pathOrId } )
				    });
			}
		}
	},
	execute: function(key, operationName, properties = {}) {
		return function execute(pathOrId, operationParams, messageStart = null, messageSuccess = null, messageError = null) {
			return function (dispatch) {

			    dispatch( { type: key + '_EXECUTE_START', pathOrId: pathOrId, message: (messageStart || 'Fetch started...') } );

			    	return DocumentOperations.executeOperation(pathOrId, operationName, operationParams, { headers: properties.headers })
				    .then((response) => {
				      dispatch( { type: key + '_EXECUTE_SUCCESS', message: messageSuccess, response: response, pathOrId: pathOrId } )
				    }).catch((error) => {
				        dispatch( { type: key + '_EXECUTE_ERROR', message: (messageError || error), pathOrId: pathOrId } )
				    });
			}
		}
	},
	update: function(key, type, properties = {}) {
		return function update(newDoc, messageStart = null, messageSuccess = null, messageError = null) {
			return function (dispatch) {

			    dispatch( { type: key + '_UPDATE_START', pathOrId: newDoc.path, message: (messageStart || 'Update started...') } );

			    return DocumentOperations.updateDocument(newDoc, { headers: properties.headers })
			      .then((response) => {
			        dispatch( { type: key + '_UPDATE_SUCCESS', message: (messageSuccess || 'Document updated successfully!'), response: response, pathOrId: newDoc.path } )
			      }).catch((error) => {
			          dispatch( { type: key + '_UPDATE_ERROR', message: (messageError || error), pathOrId: newDoc.path } )
			    });
			}
		}
	},
	delete: function(key, type, properties = {}) {
		return function update(pathOrId, messageStart = null, messageSuccess = null, messageError = null) {
			return function (dispatch) {

			    dispatch( { type: key + '_DELETE_START', pathOrId: pathOrId, message: (messageStart || 'Delete started...') } );

			    return DocumentOperations.deleteDocument(pathOrId, { headers: properties.headers })
			      .then((response) => {
			        dispatch( { type: key + '_DELETE_SUCCESS', message: (messageSuccess || 'Document deleted successfully!'), response: response, pathOrId: pathOrId } )
			      }).catch((error) => {
			          dispatch( { type: key + '_DELETE_ERROR', message: (messageError || error), pathOrId: pathOrId } )
			    });
			}
		}
	}
}
