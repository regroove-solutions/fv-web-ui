// Middleware
import thunk from 'redux-thunk';

// Operations
import DirectoryOperations from 'operations/DirectoryOperations';
import DocumentOperations from 'operations/DocumentOperations';

const DISMISS_ERROR = 'DISMISS_ERROR';

/**
* Multiple Book Actions
*/
const FV_BOOKS_FETCH_START = "FV_BOOKS_FETCH_START";
const FV_BOOKS_FETCH_SUCCESS = "FV_BOOKS_FETCH_SUCCESS";
const FV_BOOKS_FETCH_ERROR = "FV_BOOKS_FETCH_ERROR";

const FV_BOOKS_UPDATE_START = "FV_BOOKS_UPDATE_START";
const FV_BOOKS_UPDATE_SUCCESS = "FV_BOOKS_UPDATE_SUCCESS";
const FV_BOOKS_UPDATE_ERROR = "FV_BOOKS_UPDATE_ERROR";

const FV_BOOKS_CREATE_START = "FV_BOOKS_CREATE_START";
const FV_BOOKS_CREATE_SUCCESS = "FV_BOOKS_CREATE_SUCCESS";
const FV_BOOKS_CREATE_ERROR = "FV_BOOKS_CREATE_ERROR";

const FV_BOOKS_DELETE_START = "FV_BOOKS_DELETE_START";
const FV_BOOKS_DELETE_SUCCESS = "FV_BOOKS_DELETE_SUCCESS";
const FV_BOOKS_DELETE_ERROR = "FV_BOOKS_DELETE_ERROR";

const FV_BOOKS_SHARED_FETCH_START = "FV_BOOKS_SHARED_FETCH_START";
const FV_BOOKS_SHARED_FETCH_SUCCESS = "FV_BOOKS_SHARED_FETCH_SUCCESS";
const FV_BOOKS_SHARED_FETCH_ERROR = "FV_BOOKS_SHARED_FETCH_ERROR";

/**
* Single Book Actions
*/
const FV_BOOK_FETCH_START = "FV_BOOK_FETCH_START";
const FV_BOOK_FETCH_SUCCESS = "FV_BOOK_FETCH_SUCCESS";
const FV_BOOK_FETCH_ERROR = "FV_BOOK_FETCH_ERROR";

const FV_BOOK_FETCH_ALL_START = "FV_BOOK_FETCH_ALL_START";
const FV_BOOK_FETCH_ALL_SUCCESS = "FV_BOOK_FETCH_ALL_SUCCESS";
const FV_BOOK_FETCH_ALL_ERROR = "FV_BOOK_FETCH_ALL_ERROR";

const FV_BOOK_UPDATE_START = "FV_BOOK_UPDATE_START";
const FV_BOOK_UPDATE_SUCCESS = "FV_BOOK_UPDATE_SUCCESS";
const FV_BOOK_UPDATE_ERROR = "FV_BOOK_UPDATE_ERROR";

const FV_BOOK_CREATE_START = "FV_BOOK_CREATE_START";
const FV_BOOK_CREATE_SUCCESS = "FV_BOOK_CREATE_SUCCESS";
const FV_BOOK_CREATE_ERROR = "FV_BOOK_CREATE_ERROR";

const FV_BOOK_DELETE_START = "FV_BOOK_DELETE_START";
const FV_BOOK_DELETE_SUCCESS = "FV_BOOK_DELETE_SUCCESS";
const FV_BOOK_DELETE_ERROR = "FV_BOOK_DELETE_ERROR";

const createBook = function createBook(parentDoc, docParams) {
  return function (dispatch) {

    dispatch( { type: FV_BOOK_CREATE_START, document: docParams } );

    return DocumentOperations.createDocument(parentDoc, docParams)
      .then((response) => {
        dispatch( { type: FV_BOOK_CREATE_SUCCESS, document: response} );
      }).catch((error) => {
          dispatch( { type: FV_BOOK_CREATE_ERROR, error: error } )
    });
  }
};

const updateBook = function updateBook(newDoc, field) {
  return function (dispatch) {

    let books = {};
    books[newDoc.id] = {};

    dispatch( { type: FV_BOOK_UPDATE_START, books: books, pathOrId: newDoc.id } );

    return DocumentOperations.updateDocument(newDoc)
      .then((response) => {

        books[newDoc.id] = { response: response };

        dispatch( { type: FV_BOOK_UPDATE_SUCCESS, books: books, pathOrId: newDoc.id} );
      }).catch((error) => {

          books[newDoc.id] = { error: error };

          dispatch( { type: FV_BOOK_UPDATE_ERROR, books: books, pathOrId: newDoc.id } )
    });
  }
};

const fetchSharedBooks = function fetchSharedBooks(page_provider, headers = {}, params = {}) {
  return function (dispatch) {

    dispatch( { type: FV_BOOKS_SHARED_FETCH_START } );

    return DirectoryOperations.getDocumentsViaPageProvider(page_provider, 'FVBook', headers, params)
    .then((response) => {
      dispatch( { type: FV_BOOKS_SHARED_FETCH_SUCCESS, documents: response } )
    }).catch((error) => {
        dispatch( { type: FV_BOOKS_SHARED_FETCH_ERROR, error: error } )
    });
  }
};

const fetchBooksAll = function fetchBooksAll(path, type) {
  return function (dispatch) {

    dispatch( { type: FV_BOOK_FETCH_ALL_START } );

    return DirectoryOperations.getDocumentByPath2(path, 'FVBook', '', { headers: { 'X-NXenrichers.document': 'ancestry' } })
    .then((response) => {
      dispatch( { type: FV_BOOK_FETCH_ALL_SUCCESS, documents: response } )
    }).catch((error) => {
        dispatch( { type: FV_BOOK_FETCH_ALL_ERROR, error: error } )
    });
  }
};

const fetchBooksInPath = function fetchBooksInPath(path, queryAppend, headers = {}, params = {}) {
  return function (dispatch) {

    dispatch( { type: FV_BOOKS_FETCH_START } );

    return DirectoryOperations.getDocumentByPath2(path, 'FVBook', queryAppend, {headers: headers}, params)
    .then((response) => {
      dispatch( { type: FV_BOOKS_FETCH_SUCCESS, documents: response } )
    }).catch((error) => {
        dispatch( { type: FV_BOOKS_FETCH_ERROR, error: error } )
    });
  }
};

const fetchBook = function fetchBook(pathOrId) {
  return function (dispatch) {

    let books = {};
    books[pathOrId] = {};

    dispatch( { type: FV_BOOK_FETCH_START, books: books, pathOrId: pathOrId } );

    return DocumentOperations.getDocument(pathOrId, 'FVBook', { headers: { 'X-NXenrichers.document': 'ancestry' } })
    .then((response) => {

      books[pathOrId] = { response: response };

      dispatch( { type: FV_BOOK_FETCH_SUCCESS, books: books, pathOrId: pathOrId } )
    }).catch((error) => {

        books[pathOrId] = { error: error };

        dispatch( { type: FV_BOOK_FETCH_ERROR, books: books, pathOrId: pathOrId } )
    });
  }
};

const actions = { fetchSharedBooks, fetchBooksInPath, fetchBook, createBook, fetchBooksAll, updateBook };

const reducers = {
  computeSharedBooks(state = { isFetching: false, response: { get: function() { return ''; } }, success: false }, action) {
    switch (action.type) {
      case FV_BOOKS_SHARED_FETCH_START:
        return Object.assign({}, state, { isFetching: true });
      break;

      // Send modified document to UI without access REST end-point
      case FV_BOOKS_SHARED_FETCH_SUCCESS:
        return Object.assign({}, state, { response: action.documents, isFetching: false, success: true });
      break;

      // Send modified document to UI without access REST end-point
      case FV_BOOKS_SHARED_FETCH_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error, errorDismissed: (action.type === DISMISS_ERROR) ? true: false });
      break;

      default: 
        return Object.assign({}, state, { isFetching: false });
      break;
    }
  },
  computeBooksInPath(state = { isFetching: false, response: { get: function() { return ''; } }, success: false }, action) {
    switch (action.type) {
      case FV_BOOKS_FETCH_START:
        return Object.assign({}, state, { isFetching: true });
      break;

      // Send modified document to UI without access REST end-point
      case FV_BOOKS_FETCH_SUCCESS:
        return Object.assign({}, state, { response: action.documents, isFetching: false, success: true });
      break;

      // Send modified document to UI without access REST end-point
      case FV_BOOKS_FETCH_ERROR:
      case DISMISS_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error, errorDismissed: (action.type === DISMISS_ERROR) ? true: false });
      break;

      default: 
        return Object.assign({}, state, { isFetching: false });
      break;
    }
  },
  computeBook(state = { books: {} }, action) {
    switch (action.type) {
      case FV_BOOK_FETCH_START:
      case FV_BOOK_UPDATE_START:

        action.books[action.pathOrId].isFetching = true;
        action.books[action.pathOrId].success = false;

        return Object.assign({}, state, { books: Object.assign(state.books, action.books) });
      break;

      // Send modified document to UI without access REST end-point
      case FV_BOOK_FETCH_SUCCESS:
      case FV_BOOK_UPDATE_SUCCESS:
        
        action.books[action.pathOrId].isFetching = false;
        action.books[action.pathOrId].success = true;

        return Object.assign({}, state, { books: Object.assign(state.books, action.books) });
      break;

      // Send modified document to UI without access REST end-point
      case FV_BOOK_FETCH_ERROR:
      case FV_BOOK_UPDATE_ERROR:

        action.books[action.pathOrId].isFetching = false;
        action.books[action.pathOrId].success = false;
        action.books[action.pathOrId].isError = true;
        action.books[action.pathOrId].error = action.error;

        return Object.assign({}, state, { books: Object.assign(state.books, action.books) });
      break;

      default: 
        return Object.assign({}, state);
      break;
    }
  },  
  computeCreateBook(state = { isFetching: false, response: {get: function() { return ''; }}, success: false, pathOrId: null }, action) {
    switch (action.type) {
      case FV_BOOK_CREATE_START:
        return Object.assign({}, state, { isFetching: true, success: false, pathOrId: action.pathOrId });
      break;

      // Send modified document to UI without access REST end-point
      case FV_BOOK_CREATE_SUCCESS:
        return Object.assign({}, state, { response: action.document, isFetching: false, success: true, pathOrId: action.pathOrId });
      break;

      // Send modified document to UI without access REST end-point
      case FV_BOOK_CREATE_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error, pathOrId: action.pathOrId });
      break;

      default: 
        return Object.assign({}, state, { isFetching: false });
      break;
    }
  },
  computeBooksAll(state = { isFetching: false, response: {get: function() { return ''; }}, success: false }, action) {
    switch (action.type) {
      case FV_BOOK_FETCH_ALL_START:
        return Object.assign({}, state, { isFetching: true, success: false });
      break;

      case FV_BOOK_FETCH_ALL_SUCCESS:
        return Object.assign({}, state, { response: action.documents, isFetching: false, success: true });
      break;

      case FV_BOOK_FETCH_ALL_ERROR:
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