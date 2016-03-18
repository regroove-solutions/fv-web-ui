// Middleware
import thunk from 'redux-thunk';

// Operations
import DirectoryOperations from 'operations/DirectoryOperations';
import DocumentOperations from 'operations/DocumentOperations';

const DISMISS_ERROR = 'DISMISS_ERROR';

/**
* Multiple Language Actions
*/
const FV_LANGUAGES_FETCH_START = "FV_LANGUAGES_FETCH_START";
const FV_LANGUAGES_FETCH_SUCCESS = "FV_LANGUAGES_FETCH_SUCCESS";
const FV_LANGUAGES_FETCH_ERROR = "FV_LANGUAGES_FETCH_ERROR";

const FV_LANGUAGES_UPDATE_START = "FV_LANGUAGES_UPDATE_START";
const FV_LANGUAGES_UPDATE_SUCCESS = "FV_LANGUAGES_UPDATE_SUCCESS";
const FV_LANGUAGES_UPDATE_ERROR = "FV_LANGUAGES_UPDATE_ERROR";

const FV_LANGUAGES_CREATE_START = "FV_LANGUAGES_CREATE_START";
const FV_LANGUAGES_CREATE_SUCCESS = "FV_LANGUAGES_CREATE_SUCCESS";
const FV_LANGUAGES_CREATE_ERROR = "FV_LANGUAGES_CREATE_ERROR";

const FV_LANGUAGES_DELETE_START = "FV_LANGUAGES_DELETE_START";
const FV_LANGUAGES_DELETE_SUCCESS = "FV_LANGUAGES_DELETE_SUCCESS";
const FV_LANGUAGES_DELETE_ERROR = "FV_LANGUAGES_DELETE_ERROR";

/**
* Single Language Actions
*/
const FV_LANGUAGE_FETCH_START = "FV_LANGUAGE_FETCH_START";
const FV_LANGUAGE_FETCH_SUCCESS = "FV_LANGUAGE_FETCH_SUCCESS";
const FV_LANGUAGE_FETCH_ERROR = "FV_LANGUAGE_FETCH_ERROR";

const FV_LANGUAGE_UPDATE_START = "FV_LANGUAGE_UPDATE_START";
const FV_LANGUAGE_UPDATE_SUCCESS = "FV_LANGUAGE_UPDATE_SUCCESS";
const FV_LANGUAGE_UPDATE_ERROR = "FV_LANGUAGE_UPDATE_ERROR";

const FV_LANGUAGE_CREATE_START = "FV_LANGUAGE_CREATE_START";
const FV_LANGUAGE_CREATE_SUCCESS = "FV_LANGUAGE_CREATE_SUCCESS";
const FV_LANGUAGE_CREATE_ERROR = "FV_LANGUAGE_CREATE_ERROR";

const FV_LANGUAGE_DELETE_START = "FV_LANGUAGE_DELETE_START";
const FV_LANGUAGE_DELETE_SUCCESS = "FV_LANGUAGE_DELETE_SUCCESS";
const FV_LANGUAGE_DELETE_ERROR = "FV_LANGUAGE_DELETE_ERROR";

const fetchLanguagesInPath = function fetchLanguagesInPath(path, type) {
  return function (dispatch) {

    dispatch( { type: FV_LANGUAGES_FETCH_START } );

    return DirectoryOperations.getDocumentByPath2(path, 'FVLanguage')
    .then((response) => {
      dispatch( { type: FV_LANGUAGES_FETCH_SUCCESS, documents: response } )
    }).catch((error) => {
        dispatch( { type: FV_LANGUAGES_FETCH_ERROR, error: error } )
    });
  }
};

const fetchLanguage = function fetchLanguage(pathOrId) {
  return function (dispatch) {

    dispatch( { type: FV_LANGUAGE_FETCH_START } );

    return DocumentOperations.getDocument(pathOrId, 'FVLanguage', { headers: { 'X-NXenrichers.document': 'ancestry' } })
    .then((response) => {
      dispatch( { type: FV_LANGUAGE_FETCH_SUCCESS, document: response } )
    }).catch((error) => {
        dispatch( { type: FV_LANGUAGE_FETCH_ERROR, error: error } )
    });
  }
};

const actions = { fetchLanguagesInPath, fetchLanguage };

const reducers = {
  computeLanguagesInPath(state = { isFetching: false, response: { get: function() { return ''; } }, success: false }, action) {
    switch (action.type) {
      case FV_LANGUAGES_FETCH_START:
        return Object.assign({}, state, { isFetching: true, success: false });
      break;

      // Send modified document to UI without access REST end-point
      case FV_LANGUAGES_FETCH_SUCCESS:
        return Object.assign({}, state, { response: action.documents, isFetching: false, success: true });
      break;

      // Send modified document to UI without access REST end-point
      case FV_LANGUAGES_FETCH_ERROR:
      case DISMISS_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error, errorDismissed: (action.type === DISMISS_ERROR) ? true: false });
      break;

      default: 
        return Object.assign({}, state, { isFetching: false });
      break;
    }
  },
  computeLanguage(state = { isFetching: false, response: {get: function() { return ''; }}, success: false }, action) {
    switch (action.type) {
      case FV_LANGUAGE_FETCH_START:
      case FV_LANGUAGE_UPDATE_START:
        return Object.assign({}, state, { isFetching: true, success: false });
      break;

      // Send modified document to UI without access REST end-point
      case FV_LANGUAGE_FETCH_SUCCESS:
      case FV_LANGUAGE_UPDATE_SUCCESS:
        return Object.assign({}, state, { response: action.document, isFetching: false, success: true });
      break;

      // Send modified document to UI without access REST end-point
      case FV_LANGUAGE_FETCH_ERROR:
      case FV_LANGUAGE_UPDATE_ERROR:
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