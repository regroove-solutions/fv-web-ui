// Middleware
import thunk from 'redux-thunk';

// Operations
import DirectoryOperations from 'operations/DirectoryOperations';
import DocumentOperations from 'operations/DocumentOperations';

const DISMISS_ERROR = 'DISMISS_ERROR';

/**
* Portal Actions
*/
const FV_PORTAL_FETCH_START = "FV_PORTAL_FETCH_START";
const FV_PORTAL_FETCH_SUCCESS = "FV_PORTAL_FETCH_SUCCESS";
const FV_PORTAL_FETCH_ERROR = "FV_PORTAL_FETCH_ERROR";

const FV_PORTAL_UPDATE_START = "FV_PORTAL_UPDATE_START";
const FV_PORTAL_UPDATE_SUCCESS = "FV_PORTAL_UPDATE_SUCCESS";
const FV_PORTAL_UPDATE_ERROR = "FV_PORTAL_UPDATE_ERROR";

const FV_PORTAL_CREATE_START = "FV_PORTAL_CREATE_START";
const FV_PORTAL_CREATE_SUCCESS = "FV_PORTAL_CREATE_SUCCESS";
const FV_PORTAL_CREATE_ERROR = "FV_PORTAL_CREATE_ERROR";

const FV_PORTAL_DELETE_START = "FV_PORTAL_DELETE_START";
const FV_PORTAL_DELETE_SUCCESS = "FV_PORTAL_DELETE_SUCCESS";
const FV_PORTAL_DELETE_ERROR = "FV_PORTAL_DELETE_ERROR";

const updatePortal = function updatePortal(newDoc, field) {
  return function (dispatch) {

    dispatch( { type: FV_PORTAL_UPDATE_START, document: newDoc, field: field } );

    return DocumentOperations.updateDocument(newDoc)
      .then((response) => {
        dispatch( { type: FV_PORTAL_UPDATE_SUCCESS, document: response, field: field} );
      }).catch((error) => {
          dispatch( { type: FV_PORTAL_UPDATE_ERROR, error: error, field: field } )
    });
  }
};

const fetchPortal = function fetchPortal(pathOrId) {
  return function (dispatch) {

    dispatch( { type: FV_PORTAL_FETCH_START } );

    return DocumentOperations.getDocument(pathOrId, 'FVPortal', { headers: { 'X-NXenrichers.document': 'ancestry' } })
    .then((response) => {
      dispatch( { type: FV_PORTAL_FETCH_SUCCESS, document: response } )
    }).catch((error) => {
        dispatch( { type: FV_PORTAL_FETCH_ERROR, error: error } )
    });
  }
};

const actions = { fetchPortal, updatePortal };

const reducers = {
  computePortal(state = { isFetching: false, response: {get: function() { return ''; }}, success: false, field: null }, action) {
    switch (action.type) {
      case FV_PORTAL_FETCH_START:
      //case FV_PORTAL_UPDATE_START:
        return Object.assign({}, state, { isFetching: true, success: false, field: action.field });
      break;

      // Send modified document to UI without access REST end-point
      case FV_PORTAL_FETCH_SUCCESS:
      //case FV_PORTAL_UPDATE_SUCCESS:
        return Object.assign({}, state, { response: action.document, isFetching: false, success: true, field: action.field });
      break;

      // Send modified document to UI without access REST end-point
      case FV_PORTAL_FETCH_ERROR:
      //case FV_PORTAL_UPDATE_ERROR:
      case DISMISS_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, field: action.field, response: {get: function() { return ''; }}, error: action.error, errorDismissed: (action.type === DISMISS_ERROR) ? true: false });
      break;

      default: 
        return Object.assign({}, state, { isFetching: false, field: null });
      break;
    }
  }
};

const middleware = [thunk];

export default { actions, reducers, middleware };