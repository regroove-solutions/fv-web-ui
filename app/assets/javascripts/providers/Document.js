// Middleware
import thunk from 'redux-thunk';

// Operations
import DirectoryOperations from 'operations/DirectoryOperations';
import DocumentOperations from 'operations/DocumentOperations';

const DISMISS_ERROR = 'DISMISS_ERROR';

/**
* Single Document Actions
*/
const DOCUMENT_FETCH_START = "DOCUMENT_FETCH_START";
const DOCUMENT_FETCH_SUCCESS = "DOCUMENT_FETCH_SUCCESS";
const DOCUMENT_FETCH_ERROR = "DOCUMENT_FETCH_ERROR";

const fetchDocument = function fetchDocument(pathOrId) {
  return function (dispatch) {

    dispatch( { type: DOCUMENT_FETCH_START } );

    return DocumentOperations.getDocument(pathOrId, 'Document', { headers: { 'X-NXenrichers.document': 'ancestry' } })
    .then((response) => {
      dispatch( { type: DOCUMENT_FETCH_SUCCESS, document: response } )
    }).catch((error) => {
        dispatch( { type: DOCUMENT_FETCH_ERROR, error: error } )
    });
  }
};

const actions = { fetchDocument };

const reducers = {
  computeDocument(state = { isFetching: false, response: {get: function() { return ''; }}, success: false }, action) {
    switch (action.type) {
      case DOCUMENT_FETCH_START:
        return Object.assign({}, state, { isFetching: true, success: false });
      break;

      case DOCUMENT_FETCH_SUCCESS:
        return Object.assign({}, state, { response: action.document, isFetching: false, success: true });
      break;

      case DOCUMENT_FETCH_ERROR:
      case DISMISS_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error, errorDismissed: (action.type === DISMISS_ERROR) ? true: false });
      break;

      default: 
        return Object.assign({}, state, { isFetching: false });
      break;
    }
  }
};

const middleware = [thunk];

export default { actions, reducers, middleware };