import RESTActions from './rest-actions'
import RESTReducers from './rest-reducers'

// Middleware
import thunk from 'redux-thunk';

// Operations
import DirectoryOperations from 'operations/DirectoryOperations';
import DocumentOperations from 'operations/DocumentOperations';

const FV_GALLERY_FETCH_START = "FV_GALLERY_FETCH_START";
const FV_GALLERY_FETCH_SUCCESS = "FV_GALLERY_FETCH_SUCCESS";
const FV_GALLERY_FETCH_ERROR = "FV_GALLERY_FETCH_ERROR";

const FV_GALLERIES_FETCH_START = "FV_GALLERY_FETCH_START";
const FV_GALLERIES_FETCH_SUCCESS = "FV_GALLERY_FETCH_SUCCESS";
const FV_GALLERIES_FETCH_ERROR = "FV_GALLERY_FETCH_ERROR";

const FV_GALLERY_CREATE_START = "FV_GALLERY_CREATE_START";
const FV_GALLERY_CREATE_SUCCESS = "FV_GALLERY_CREATE_SUCCESS";
const FV_GALLERY_CREATE_ERROR = "FV_GALLERY_CREATE_ERROR";

const fetchGallery = function fetchGallery(pathOrId) {
  return function (dispatch) {

    dispatch( { type: FV_GALLERY_FETCH_START } );

    return DocumentOperations.getDocument(pathOrId, 'FVGallery', { headers: { 'X-NXenrichers.document': 'ancestry', 'X-NXenrichers.document': 'gallery' } })   
    
    .then((response) => {
    	dispatch( { type: FV_GALLERY_FETCH_SUCCESS, response: response } )
    }).catch((error) => {
        dispatch( { type: FV_GALLERY_FETCH_ERROR, error: error } )
    });
  }
};

const createGallery = function createGallery(parentDoc, docParams) {
  return function (dispatch) {

    dispatch( { type: FV_GALLERY_CREATE_START, document: docParams } );

    return DocumentOperations.createDocument(parentDoc, docParams)
      .then((response) => {
        dispatch( { type: FV_GALLERY_CREATE_SUCCESS, document: response} );
      }).catch((error) => {
          dispatch( { type: FV_GALLERY_CREATE_ERROR, error: error } )
    });
  }
};

const fetchGalleryEntries = RESTActions.query('FV_GALLERY_ENTRIES', 'FVGallery', { headers: { 'X-NXenrichers.document': 'gallery,permissions' } });

const actions = { fetchGallery, fetchGalleryEntries, createGallery };

const computeGalleryEntriesQueryFactory = RESTReducers.computeQuery('gallery_entries');

const reducers = {

  computeGallery(state = { isFetching: false, success: false }, action) {
    switch (action.type) {
      case FV_GALLERY_FETCH_START:
    	  return Object.assign({}, state, { isFetching: true });
      break;

      case FV_GALLERY_FETCH_SUCCESS:
    	  return Object.assign({}, state, { response: action.response, isFetching: false, success: true });
      break;

      case FV_GALLERY_FETCH_ERROR:
    	  return Object.assign({}, state, { isFetching: false, isError: true, error: action.error});
      break;

      default: 
        return Object.assign({}, state);
      break;
    }
  },
  computeGalleryEntries: computeGalleryEntriesQueryFactory.computeGalleryEntries,
  computeCreateGallery(state = { isFetching: false, response: {get: function() { return ''; }}, success: false, pathOrId: null }, action) {
	    switch (action.type) {
	      case FV_GALLERY_CREATE_START:
	        return Object.assign({}, state, { isFetching: true, success: false, pathOrId: action.pathOrId });
	      break;

	      // Send modified document to UI without access REST end-point
	      case FV_GALLERY_CREATE_SUCCESS:
	        return Object.assign({}, state, { response: action.document, isFetching: false, success: true, pathOrId: action.pathOrId });
	      break;

	      // Send modified document to UI without access REST end-point
	      case FV_GALLERY_CREATE_ERROR:
	        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error, pathOrId: action.pathOrId });
	      break;

	      default: 
	        return Object.assign({}, state, { isFetching: false });
	      break;
	    }
	  },  
};

const middleware = [thunk];

export default { actions, reducers, middleware };