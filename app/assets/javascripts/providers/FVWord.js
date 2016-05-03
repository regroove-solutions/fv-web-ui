import Immutable, { List, Map } from 'immutable';

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

const FV_WORDS_SHARED_FETCH_START = "FV_WORDS_SHARED_FETCH_START";
const FV_WORDS_SHARED_FETCH_SUCCESS = "FV_WORDS_SHARED_FETCH_SUCCESS";
const FV_WORDS_SHARED_FETCH_ERROR = "FV_WORDS_SHARED_FETCH_ERROR";

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

const updateWord = function updateWord(newDoc) {
  return function (dispatch) {

    dispatch( { type: FV_WORD_UPDATE_START, pathOrId: newDoc.path } );

    return DocumentOperations.updateDocument(newDoc)
      .then((response) => {
        dispatch( { type: FV_WORD_UPDATE_SUCCESS, response: response, pathOrId: newDoc.path } )
      }).catch((error) => {
          dispatch( { type: FV_WORD_UPDATE_ERROR, error: error, pathOrId: newDoc.path } )
    });
  }
};

const fetchWord = function fetchWord(pathOrId) {
  return function (dispatch) {

    dispatch( { type: FV_WORD_FETCH_START, pathOrId: pathOrId } );

    return DocumentOperations.getDocument(pathOrId, 'FVWord', { headers: { 'X-NXenrichers.document': 'ancestry,word' } })
    .then((response) => {
      dispatch( { type: FV_WORD_FETCH_SUCCESS, response: response, pathOrId: pathOrId } )
    }).catch((error) => {
        dispatch( { type: FV_WORD_FETCH_ERROR, error: error, pathOrId: pathOrId } )
    });
  }
};

const fetchSharedWords = function fetchSharedWords(page_provider, headers = {}, params = {}) {
  return function (dispatch) {

    dispatch( { type: FV_WORDS_SHARED_FETCH_START } );

    return DirectoryOperations.getDocumentsViaPageProvider(page_provider, 'FVWord', headers, params)
    .then((response) => {
      dispatch( { type: FV_WORDS_SHARED_FETCH_SUCCESS, documents: response } )
    }).catch((error) => {
        dispatch( { type: FV_WORDS_SHARED_FETCH_ERROR, error: error } )
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

    return DirectoryOperations.getDocumentByPath2(path, 'FVWord', queryAppend, {headers: headers}, params)
    .then((response) => {
      dispatch( { type: FV_WORDS_FETCH_SUCCESS, documents: response } )
    }).catch((error) => {
        dispatch( { type: FV_WORDS_FETCH_ERROR, error: error } )
    });
  }
};

const actions = { fetchSharedWords, fetchWordsInPath, fetchWord, createWord, fetchWordsAll, updateWord };

const reducers = {
  computeSharedWords(state = { isFetching: false, response: { get: function() { return ''; } }, success: false }, action) {
    switch (action.type) {
      case FV_WORDS_SHARED_FETCH_START:
        return Object.assign({}, state, { isFetching: true });
      break;

      // Send modified document to UI without access REST end-point
      case FV_WORDS_SHARED_FETCH_SUCCESS:
        return Object.assign({}, state, { response: action.documents, isFetching: false, success: true });
      break;

      // Send modified document to UI without access REST end-point
      case FV_WORDS_SHARED_FETCH_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error, errorDismissed: (action.type === DISMISS_ERROR) ? true: false });
      break;

      default: 
        return Object.assign({}, state, { isFetching: false });
      break;
    }
  },
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
  computeWord(state = new List([]), action) {

    // Find entry within state based on id
    let indexOfEntry = state.findIndex(function(item) {
      return item.get("id") === action.pathOrId; 
    });

    switch (action.type) {
      case FV_WORD_FETCH_START:
      case FV_WORD_UPDATE_START:

        return state.push(Map({
          id: action.pathOrId,
          isFetching: true,
          success: false
        }));

      break;

      case FV_WORD_FETCH_SUCCESS:
      case FV_WORD_UPDATE_SUCCESS:

        // Replace entry within state
        return state.set(indexOfEntry, Map({
          id: action.pathOrId,
          isFetching: false,
          success: true,
          response: action.response
        }));

      break;

      case FV_WORD_FETCH_ERROR:
      case FV_WORD_UPDATE_ERROR:

        // Add error message
        return state.set(indexOfEntry, Map({
          id: action.pathOrId,
          isFetching: false,
          isError: true,
          success: false,
          response: state.get(indexOfEntry).get('response'),
          error: action.error
        }));

      break;
    }

    return state;
 },
 computeCreateWord(state = { isFetching: false, response: {get: function() { return ''; }}, success: false, pathOrId: null }, action) {
   switch (action.type) {
     case FV_WORD_CREATE_START:
       return Object.assign({}, state, { isFetching: true, success: false, pathOrId: action.pathOrId });
     break;
 
     // Send modified document to UI without access REST end-point
     case FV_WORD_CREATE_SUCCESS:
       return Object.assign({}, state, { response: action.document, isFetching: false, success: true, pathOrId: action.pathOrId, isError: false, error: null });
     break;
 
     // Send modified document to UI without access REST end-point
     case FV_WORD_CREATE_ERROR:
       return Object.assign({}, state, { isFetching: false, isError: true, error: action.error, pathOrId: action.pathOrId });
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