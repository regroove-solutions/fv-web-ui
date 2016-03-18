// Middleware
import thunk from 'redux-thunk';

// Operations
import DirectoryOperations from 'operations/DirectoryOperations';
import DocumentOperations from 'operations/DocumentOperations';

const DISMISS_ERROR = 'DISMISS_ERROR';

/**
* Multiple Language Family Actions
*/
const FV_LANGUAGE_FAMILIES_FETCH_START = "FV_LANGUAGE_FAMILIES_FETCH_START";
const FV_LANGUAGE_FAMILIES_FETCH_SUCCESS = "FV_LANGUAGE_FAMILIES_FETCH_SUCCESS";
const FV_LANGUAGE_FAMILIES_FETCH_ERROR = "FV_LANGUAGE_FAMILIES_FETCH_ERROR";

const FV_LANGUAGE_FAMILIES_UPDATE_START = "FV_LANGUAGE_FAMILIES_UPDATE_START";
const FV_LANGUAGE_FAMILIES_UPDATE_SUCCESS = "FV_LANGUAGE_FAMILIES_UPDATE_SUCCESS";
const FV_LANGUAGE_FAMILIES_UPDATE_ERROR = "FV_LANGUAGE_FAMILIES_UPDATE_ERROR";

const FV_LANGUAGE_FAMILIES_CREATE_START = "FV_LANGUAGE_FAMILIES_CREATE_START";
const FV_LANGUAGE_FAMILIES_CREATE_SUCCESS = "FV_LANGUAGE_FAMILIES_CREATE_SUCCESS";
const FV_LANGUAGE_FAMILIES_CREATE_ERROR = "FV_LANGUAGE_FAMILIES_CREATE_ERROR";

const FV_LANGUAGE_FAMILIES_DELETE_START = "FV_LANGUAGE_FAMILIES_DELETE_START";
const FV_LANGUAGE_FAMILIES_DELETE_SUCCESS = "FV_LANGUAGE_FAMILIES_DELETE_SUCCESS";
const FV_LANGUAGE_FAMILIES_DELETE_ERROR = "FV_LANGUAGE_FAMILIES_DELETE_ERROR";

/**
* Single Language Family Actions
*/
const FV_LANGUAGE_FAMILY_FETCH_START = "FV_LANGUAGE_FAMILY_FETCH_START";
const FV_LANGUAGE_FAMILY_FETCH_SUCCESS = "FV_LANGUAGE_FAMILY_FETCH_SUCCESS";
const FV_LANGUAGE_FAMILY_FETCH_ERROR = "FV_LANGUAGE_FAMILY_FETCH_ERROR";

const FV_LANGUAGE_FAMILY_UPDATE_START = "FV_LANGUAGE_FAMILY_UPDATE_START";
const FV_LANGUAGE_FAMILY_UPDATE_SUCCESS = "FV_LANGUAGE_FAMILY_UPDATE_SUCCESS";
const FV_LANGUAGE_FAMILY_UPDATE_ERROR = "FV_LANGUAGE_FAMILY_UPDATE_ERROR";

const FV_LANGUAGE_FAMILY_CREATE_START = "FV_LANGUAGE_FAMILY_CREATE_START";
const FV_LANGUAGE_FAMILY_CREATE_SUCCESS = "FV_LANGUAGE_FAMILY_CREATE_SUCCESS";
const FV_LANGUAGE_FAMILY_CREATE_ERROR = "FV_LANGUAGE_FAMILY_CREATE_ERROR";

const FV_LANGUAGE_FAMILY_DELETE_START = "FV_LANGUAGE_FAMILY_DELETE_START";
const FV_LANGUAGE_FAMILY_DELETE_SUCCESS = "FV_LANGUAGE_FAMILY_DELETE_SUCCESS";
const FV_LANGUAGE_FAMILY_DELETE_ERROR = "FV_LANGUAGE_FAMILY_DELETE_ERROR";

const fetchFamiliesInPath = function fetchFamiliesInPath(path) {
  return function (dispatch) {

    dispatch( { type: FV_LANGUAGE_FAMILIES_FETCH_START } );

    return DirectoryOperations.getDocumentByPath2(path, 'FVLanguageFamily')
    .then((response) => {
      dispatch( { type: FV_LANGUAGE_FAMILIES_FETCH_SUCCESS, documents: response } )
    }).catch((error) => {
        dispatch( { type: FV_LANGUAGE_FAMILIES_FETCH_ERROR, error: error } )
    });
  }
};

const fetchFamily = function fetchFamily(pathOrId) {
  return function (dispatch) {

    dispatch( { type: FV_LANGUAGE_FAMILY_FETCH_START } );

    return DocumentOperations.getDocument(pathOrId, 'FVFamily', { headers: { 'X-NXenrichers.document': 'ancestry' } })
    .then((response) => {
      dispatch( { type: FV_LANGUAGE_FAMILY_FETCH_SUCCESS, document: response } )
    }).catch((error) => {
        dispatch( { type: FV_LANGUAGE_FAMILY_FETCH_ERROR, error: error } )
    });
  }
};

const actions = { fetchFamiliesInPath, fetchFamily }

const reducers = {
  computeFamiliesInPath(state = { isFetching: false, response: { get: function() { return ''; } }, success: false }, action) {
    switch (action.type) {
      case FV_LANGUAGE_FAMILIES_FETCH_START:
        return Object.assign({}, state, { isFetching: true, success: false });
      break;

      // Send modified document to UI without access REST end-point
      case FV_LANGUAGE_FAMILIES_FETCH_SUCCESS:
        return Object.assign({}, state, { response: action.documents, isFetching: false, success: true });
      break;

      // Send modified document to UI without access REST end-point
      case FV_LANGUAGE_FAMILIES_FETCH_ERROR:
      case DISMISS_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error, errorDismissed: (action.type === DISMISS_ERROR) ? true: false });
      break;

      default: 
        return Object.assign({}, state, { isFetching: false });
      break;
    }
  },
  computeFamily(state = { isFetching: false, response: {get: function() { return ''; }}, success: false }, action) {
    switch (action.type) {
      case FV_LANGUAGE_FAMILY_FETCH_START:
      case FV_LANGUAGE_FAMILY_UPDATE_START:
        return Object.assign({}, state, { isFetching: true, success: false });
      break;

      // Send modified document to UI without access REST end-point
      case FV_LANGUAGE_FAMILY_FETCH_SUCCESS:
      case FV_LANGUAGE_FAMILY_UPDATE_SUCCESS:
        return Object.assign({}, state, { response: action.document, isFetching: false, success: true });
      break;

      // Send modified document to UI without access REST end-point
      case FV_LANGUAGE_FAMILY_FETCH_ERROR:
      case FV_LANGUAGE_FAMILY_UPDATE_ERROR:
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