// Middleware
import createLoggerMiddleware from 'redux-logger';
const loggerMiddleware = createLoggerMiddleware();
import thunk from 'redux-thunk';

// Operations
import DirectoryOperations from 'operations/DirectoryOperations';

// UI
const DISMISS_ERROR = 'DISMISS_ERROR';

// Action Constants
const ENABLE_EDIT_MODE = 'ENABLE_EDIT_MODE';
const DISABLE_EDIT_MODE = 'DISABLE_EDIT_MODE';

const CLIENT_CREATED = 'CLIENT_CREATED';

const FETCH_DIALECT = 'FETCH_DIALECT';

const FETCH_DIALECT_AND_PORTAL = 'FETCH_DIALECT_AND_PORTAL';

// FETCH
const FETCH_DOCUMENTS_START = 'FETCH_PORTAL_START';
const FETCH_DOCUMENTS_SUCCESS = 'FETCH_PORTAL_SUCCESS';
const FETCH_DOCUMENTS_ERROR = 'FETCH_PORTAL_ERROR';

// EDITING
const REQUEST_SAVE_FIELD = 'REQUEST_SAVE_FIELD';

/**
* Action
*/
const fetchDocuments = function fetchDocuments(path, type) {
  return function (dispatch) {

  	dispatch( { type: FETCH_DOCUMENTS_START } );

	  return DirectoryOperations.getDocumentByPath2(path, type, { headers: { 'X-NXenrichers.document': 'ancestry' } })
		.then((response) => {
			dispatch( { type: FETCH_DOCUMENTS_SUCCESS, document: response } )
		}).catch((error) => {
  			dispatch( { type: FETCH_DOCUMENTS_ERROR, error: error } )
		});
  }
};

/**
* Actions: Represent that something happened
*/
const actions = {

  fetchDocuments

}


/**
* Reducers: Handle state changes based on an action
*/
const reducers = {
  computeDocuments(state = { isFetching: false, response: {get: function() { return ''; }}, success: false }, action) {

    switch (action.type) {
      case FETCH_DOCUMENTS_START:
        return Object.assign({}, state, { isFetching: true, success: false });
      break;

      // Send modified document to UI without access REST end-point
      case FETCH_DOCUMENTS_SUCCESS:
        return Object.assign({}, state, { response: action.document, isFetching: false, success: true });
      break;

      // Send modified document to UI without access REST end-point
      case FETCH_DOCUMENTS_ERROR:
      case DISMISS_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error, errorDismissed: (action.type === DISMISS_ERROR) ? true: false });
      break;

      default: 
        return Object.assign({}, state, { isFetching: false });
      break;
    }
  }
};

function merge (stateProps, dispatchProps, parentProps) {
  return Object.assign(stateProps, dispatchProps, parentProps);
}

const middleware = [/*loggerMiddleware,*/ thunk];

export default { actions, reducers, middleware, merge };