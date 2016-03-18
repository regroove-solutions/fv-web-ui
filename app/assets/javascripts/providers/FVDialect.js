// Middleware
import thunk from 'redux-thunk';

// Operations
import DirectoryOperations from 'operations/DirectoryOperations';
import DocumentOperations from 'operations/DocumentOperations';

const DISMISS_ERROR = 'DISMISS_ERROR';

/**
* Multiple Dialect Actions
*/
const FV_DIALECTS_FETCH_START = "FV_DIALECTS_FETCH_START";
const FV_DIALECTS_FETCH_SUCCESS = "FV_DIALECTS_FETCH_SUCCESS";
const FV_DIALECTS_FETCH_ERROR = "FV_DIALECTS_FETCH_ERROR";

const FV_DIALECTS_UPDATE_START = "FV_DIALECTS_UPDATE_START";
const FV_DIALECTS_UPDATE_SUCCESS = "FV_DIALECTS_UPDATE_SUCCESS";
const FV_DIALECTS_UPDATE_ERROR = "FV_DIALECTS_UPDATE_ERROR";

const FV_DIALECTS_CREATE_START = "FV_DIALECTS_CREATE_START";
const FV_DIALECTS_CREATE_SUCCESS = "FV_DIALECTS_CREATE_SUCCESS";
const FV_DIALECTS_CREATE_ERROR = "FV_DIALECTS_CREATE_ERROR";

const FV_DIALECTS_DELETE_START = "FV_DIALECTS_DELETE_START";
const FV_DIALECTS_DELETE_SUCCESS = "FV_DIALECTS_DELETE_SUCCESS";
const FV_DIALECTS_DELETE_ERROR = "FV_DIALECTS_DELETE_ERROR";

/**
* Single Dialect Actions
*/
const FV_DIALECT_FETCH_START = "FV_DIALECT_FETCH_START";
const FV_DIALECT_FETCH_SUCCESS = "FV_DIALECT_FETCH_SUCCESS";
const FV_DIALECT_FETCH_ERROR = "FV_DIALECT_FETCH_ERROR";

const FV_DIALECT_FETCH_ALL_START = "FV_DIALECT_FETCH_ALL_START";
const FV_DIALECT_FETCH_ALL_SUCCESS = "FV_DIALECT_FETCH_ALL_SUCCESS";
const FV_DIALECT_FETCH_ALL_ERROR = "FV_DIALECT_FETCH_ALL_ERROR";

const FV_DIALECT_UPDATE_START = "FV_DIALECT_UPDATE_START";
const FV_DIALECT_UPDATE_SUCCESS = "FV_DIALECT_UPDATE_SUCCESS";
const FV_DIALECT_UPDATE_ERROR = "FV_DIALECT_UPDATE_ERROR";

const FV_DIALECT_CREATE_START = "FV_DIALECT_CREATE_START";
const FV_DIALECT_CREATE_SUCCESS = "FV_DIALECT_CREATE_SUCCESS";
const FV_DIALECT_CREATE_ERROR = "FV_DIALECT_CREATE_ERROR";

const FV_DIALECT_DELETE_START = "FV_DIALECT_DELETE_START";
const FV_DIALECT_DELETE_SUCCESS = "FV_DIALECT_DELETE_SUCCESS";
const FV_DIALECT_DELETE_ERROR = "FV_DIALECT_DELETE_ERROR";

const updateDialect = function updateDialect(newDoc, field) {
  return function (dispatch) {

    dispatch( { type: FV_DIALECT_UPDATE_START, document: newDoc, field: field } );

    return DocumentOperations.updateDocument(newDoc)
      .then((response) => {
        dispatch( { type: FV_DIALECT_UPDATE_SUCCESS, document: response, field: field} );
      }).catch((error) => {
          dispatch( { type: FV_DIALECT_UPDATE_ERROR, error: error, field: field } )
    });
  }
};

const fetchDialectsAll = function fetchDialectsAll(path, type) {
  return function (dispatch) {

    dispatch( { type: FV_DIALECT_FETCH_ALL_START } );

    return DirectoryOperations.getDocumentByPath2(path, 'FVDialect', { headers: { 'X-NXenrichers.document': 'ancestry' } })
    .then((response) => {
      dispatch( { type: FV_DIALECT_FETCH_ALL_SUCCESS, documents: response } )
    }).catch((error) => {
        dispatch( { type: FV_DIALECT_FETCH_ALL_ERROR, error: error } )
    });
  }
};

const fetchDialectsInPath = function fetchDialectsInPath(path, type) {
  return function (dispatch) {

    dispatch( { type: FV_DIALECTS_FETCH_START } );

    return DirectoryOperations.getDocumentByPath2(path, 'FVDialect', { headers: { 'X-NXenrichers.document': 'ancestry' } })
    .then((response) => {
      dispatch( { type: FV_DIALECTS_FETCH_SUCCESS, documents: response } )
    }).catch((error) => {
        dispatch( { type: FV_DIALECTS_FETCH_ERROR, error: error } )
    });
  }
};

const fetchDialect = function fetchDialect(pathOrId) {
  return function (dispatch) {

    dispatch( { type: FV_DIALECT_FETCH_START } );

    return DocumentOperations.getDocument(pathOrId, 'FVDialect', { headers: { 'X-NXenrichers.document': 'ancestry' } })
    .then((response) => {
      dispatch( { type: FV_DIALECT_FETCH_SUCCESS, document: response } )
    }).catch((error) => {
        dispatch( { type: FV_DIALECT_FETCH_ERROR, error: error } )
    });
  }
};

const actions = { fetchDialectsInPath, fetchDialect, fetchDialectsAll, updateDialect };

const reducers = {
  computeDialectsInPath(state = { isFetching: false, response: { get: function() { return ''; } }, success: false }, action) {
    switch (action.type) {
      case FV_DIALECTS_FETCH_START:
        return Object.assign({}, state, { isFetching: true });
      break;

      // Send modified document to UI without access REST end-point
      case FV_DIALECTS_FETCH_SUCCESS:
        return Object.assign({}, state, { response: action.documents, isFetching: false, success: true });
      break;

      // Send modified document to UI without access REST end-point
      case FV_DIALECTS_FETCH_ERROR:
      case DISMISS_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error, errorDismissed: (action.type === DISMISS_ERROR) ? true: false });
      break;

      default: 
        return Object.assign({}, state, { isFetching: false });
      break;
    }
  },
  computeDialect(state = { isFetching: false, response: {get: function() { return ''; }}, success: false }, action) {
    switch (action.type) {
      case FV_DIALECT_FETCH_START:
      case FV_DIALECT_UPDATE_START:
        return Object.assign({}, state, { isFetching: true, success: false });
      break;

      // Send modified document to UI without access REST end-point
      case FV_DIALECT_FETCH_SUCCESS:
      case FV_DIALECT_UPDATE_SUCCESS:
        return Object.assign({}, state, { response: action.document, isFetching: false, success: true });
      break;

      // Send modified document to UI without access REST end-point
      case FV_DIALECT_FETCH_ERROR:
      case FV_DIALECT_UPDATE_ERROR:
      case DISMISS_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error, errorDismissed: (action.type === DISMISS_ERROR) ? true: false });
      break;

      default: 
        return Object.assign({}, state, { isFetching: false });
      break;
    }
  },
  computeDialectsAll(state = { isFetching: false, response: {get: function() { return ''; }}, success: false }, action) {
    switch (action.type) {
      case FV_DIALECT_FETCH_ALL_START:
        return Object.assign({}, state, { isFetching: true, success: false });
      break;

      case FV_DIALECT_FETCH_ALL_SUCCESS:
        return Object.assign({}, state, { response: action.documents, isFetching: false, success: true });
      break;

      case FV_DIALECT_FETCH_ALL_ERROR:
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