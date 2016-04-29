// Middleware
import thunk from 'redux-thunk';

// Operations
import DirectoryOperations from 'operations/DirectoryOperations';
import DocumentOperations from 'operations/DocumentOperations';

const FV_GALLERY_FETCH_START = "FV_GALLERY_FETCH_START";
const FV_GALLERY_FETCH_SUCCESS = "FV_GALLERY_FETCH_SUCCESS";
const FV_GALLERY_FETCH_ERROR = "FV_GALLERY_FETCH_ERROR";

const fetchGallery = function fetchGallery(pathOrId) {
  return function (dispatch) {

    dispatch( { type: FV_GALLERY_FETCH_START } );

    //return DocumentOperations.getDocument(pathOrId, 'FVGallery', { headers: { 'X-NXenrichers.document': 'ancestry', 'X-NXenrichers.document': 'children' } })
    //return DirectoryOperations.getDocumentByPath2(path, 'FVGallery', '', { headers: { 'X-NXenrichers.document': 'ancestry' } })
    return DocumentOperations.getDocument(pathOrId, 'FVGallery', { headers: { 'X-NXenrichers.document': 'ancestry', 'X-NXenrichers.document': 'gallery' } })   
    
    .then((response) => {
    	dispatch( { type: FV_GALLERY_FETCH_SUCCESS, response: response } )
    }).catch((error) => {
        dispatch( { type: FV_GALLERY_FETCH_ERROR, error: error } )
    });
  }
};

const actions = { fetchGallery };

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
  }
};

const middleware = [thunk];

export default { actions, reducers, middleware };