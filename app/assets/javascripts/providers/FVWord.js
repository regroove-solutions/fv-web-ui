// Middleware
import thunk from 'redux-thunk';

// Operations
import DirectoryOperations from 'operations/DirectoryOperations';
import DocumentOperations from 'operations/DocumentOperations';

const DISMISS_ERROR = 'DISMISS_ERROR';

/**
* Multiple Word Actions
*/
const FV_WORDS_FETCH_START = "FV_WORDS_FETCH_START";
const FV_WORDS_FETCH_SUCCESS = "FV_WORDS_FETCH_SUCCESS";
const FV_WORDS_FETCH_ERROR = "FV_WORDS_FETCH_ERROR";

const FV_WORDS_UPDATE_START = "FV_WORDS_UPDATE_START";
const FV_WORDS_UPDATE_SUCCESS = "FV_WORDS_UPDATE_SUCCESS";
const FV_WORDS_UPDATE_ERROR = "FV_WORDS_UPDATE_ERROR";

const FV_WORDS_CREATE_START = "FV_WORDS_CREATE_START";
const FV_WORDS_CREATE_SUCCESS = "FV_WORDS_CREATE_SUCCESS";
const FV_WORDS_CREATE_ERROR = "FV_WORDS_CREATE_ERROR";

const FV_WORDS_DELETE_START = "FV_WORDS_DELETE_START";
const FV_WORDS_DELETE_SUCCESS = "FV_WORDS_DELETE_SUCCESS";
const FV_WORDS_DELETE_ERROR = "FV_WORDS_DELETE_ERROR";

/**
* Single Word Actions
*/
const FV_WORD_FETCH_START = "FV_WORD_FETCH_START";
const FV_WORD_FETCH_SUCCESS = "FV_WORD_FETCH_SUCCESS";
const FV_WORD_FETCH_ERROR = "FV_WORD_FETCH_ERROR";

const FV_WORD_FETCH_ALL_START = "FV_WORD_FETCH_ALL_START";
const FV_WORD_FETCH_ALL_SUCCESS = "FV_WORD_FETCH_ALL_SUCCESS";
const FV_WORD_FETCH_ALL_ERROR = "FV_WORD_FETCH_ALL_ERROR";

const FV_WORD_UPDATE_START = "FV_WORD_UPDATE_START";
const FV_WORD_UPDATE_SUCCESS = "FV_WORD_UPDATE_SUCCESS";
const FV_WORD_UPDATE_ERROR = "FV_WORD_UPDATE_ERROR";

const FV_WORD_CREATE_START = "FV_WORD_CREATE_START";
const FV_WORD_CREATE_SUCCESS = "FV_WORD_CREATE_SUCCESS";
const FV_WORD_CREATE_ERROR = "FV_WORD_CREATE_ERROR";

const FV_WORD_DELETE_START = "FV_WORD_DELETE_START";
const FV_WORD_DELETE_SUCCESS = "FV_WORD_DELETE_SUCCESS";
const FV_WORD_DELETE_ERROR = "FV_WORD_DELETE_ERROR";

const createWord = function createWord(parentDoc, docParams) {
  return function (dispatch) {

    dispatch( { type: FV_WORD_CREATE_START, document: docParams } );

    return DocumentOperations.createDocument(parentDoc, docParams)
      .then((response) => {
        dispatch( { type: FV_WORD_CREATE_SUCCESS, document: response} );
      }).catch((error) => {
          dispatch( { type: FV_WORD_CREATE_ERROR, error: error } )
    });
  }
};

const updateWord = function updateWord(newDoc, field) {
  return function (dispatch) {

    dispatch( { type: FV_WORD_UPDATE_START, document: newDoc, field: field } );

    return DocumentOperations.updateDocument(newDoc)
      .then((response) => {
        dispatch( { type: FV_WORD_UPDATE_SUCCESS, document: response, field: field} );
      }).catch((error) => {
          dispatch( { type: FV_WORD_UPDATE_ERROR, error: error, field: field } )
    });
  }
};

const fetchWordsAll = function fetchWordsAll(path, type) {
  return function (dispatch) {

    dispatch( { type: FV_WORD_FETCH_ALL_START } );

    return DirectoryOperations.getDocumentByPath2(path, 'FVWord', '', { headers: { 'X-NXenrichers.document': 'ancestry' } })
    .then((response) => {
      dispatch( { type: FV_WORD_FETCH_ALL_SUCCESS, documents: response } )
    }).catch((error) => {
        dispatch( { type: FV_WORD_FETCH_ALL_ERROR, error: error } )
    });
  }
};

const fetchWordsInPath = function fetchWordsInPath(path, queryAppend, headers = {}, params = {}) {
  return function (dispatch) {

    dispatch( { type: FV_WORDS_FETCH_START } );

    return DirectoryOperations.getDocumentByPath2(path, 'FVWord', queryAppend, headers, params)
    .then((response) => {
      dispatch( { type: FV_WORDS_FETCH_SUCCESS, documents: response } )
    }).catch((error) => {
        dispatch( { type: FV_WORDS_FETCH_ERROR, error: error } )
    });
  }
};

const fetchWord = function fetchWord(pathOrId) {
  return function (dispatch) {

    dispatch( { type: FV_WORD_FETCH_START } );

    return DocumentOperations.getDocument(pathOrId, 'FVWord', { headers: { 'X-NXenrichers.document': 'ancestry' } })
    .then((response) => {
      dispatch( { type: FV_WORD_FETCH_SUCCESS, document: response } )
    }).catch((error) => {
        dispatch( { type: FV_WORD_FETCH_ERROR, error: error } )
    });
  }
};

const actions = { fetchWordsInPath, fetchWord, createWord, fetchWordsAll, updateWord };

const reducers = {
  computeWordsInPath(state = { isFetching: false, response: { get: function() { return ''; } }, success: false }, action) {
    switch (action.type) {
      case FV_WORDS_FETCH_START:
        return Object.assign({}, state, { isFetching: true });
      break;

      // Send modified document to UI without access REST end-point
      case FV_WORDS_FETCH_SUCCESS:
        return Object.assign({}, state, { response: action.documents, isFetching: false, success: true });
      break;

      // Send modified document to UI without access REST end-point
      case FV_WORDS_FETCH_ERROR:
      case DISMISS_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error, errorDismissed: (action.type === DISMISS_ERROR) ? true: false });
      break;

      default: 
        return Object.assign({}, state, { isFetching: false });
      break;
    }
  },
  computeWord(state = { isFetching: false, response: {get: function() { return ''; }}, success: false }, action) {
    switch (action.type) {
      case FV_WORD_FETCH_START:
      case FV_WORD_UPDATE_START:
      case FV_WORD_CREATE_START:
        return Object.assign({}, state, { isFetching: true, success: false });
      break;

      // Send modified document to UI without access REST end-point
      case FV_WORD_FETCH_SUCCESS:
      case FV_WORD_UPDATE_SUCCESS:
      case FV_WORD_CREATE_SUCCESS:
        return Object.assign({}, state, { response: action.document, isFetching: false, success: true });
      break;

      // Send modified document to UI without access REST end-point
      case FV_WORD_FETCH_ERROR:
      case FV_WORD_UPDATE_ERROR:
      case FV_WORD_CREATE_ERROR:
      case DISMISS_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error, errorDismissed: (action.type === DISMISS_ERROR) ? true: false });
      break;

      default: 
        return Object.assign({}, state, { isFetching: false });
      break;
    }
  },
  computeWordsAll(state = { isFetching: false, response: {get: function() { return ''; }}, success: false }, action) {
    switch (action.type) {
      case FV_WORD_FETCH_ALL_START:
        return Object.assign({}, state, { isFetching: true, success: false });
      break;

      case FV_WORD_FETCH_ALL_SUCCESS:
        return Object.assign({}, state, { response: action.documents, isFetching: false, success: true });
      break;

      case FV_WORD_FETCH_ALL_ERROR:
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