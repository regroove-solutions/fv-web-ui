// Middleware
import thunk from 'redux-thunk';

// Operations
import DirectoryOperations from 'operations/DirectoryOperations';
import DocumentOperations from 'operations/DocumentOperations';

const QUERY_SEARCH_RESULTS_START = "QUERY_SEARCH_RESULTS_START";
const QUERY_SEARCH_RESULTS_SUCCESS = "QUERY_SEARCH_RESULTS_SUCCESS";
const QUERY_SEARCH_RESULTS_ERROR = "QUERY_SEARCH_RESULTS_ERROR";

const querySearchResults = function querySearchResults(queryParam, queryPath, docTypes, page, pageSize) {
  return function (dispatch) {

    dispatch( { type: QUERY_SEARCH_RESULTS_START } );

	return DocumentOperations.searchDocuments(queryParam, queryPath, docTypes,
	    {'X-NXproperties': 'fvcore'},
	    {'currentPageIndex': page, 'pageSize': pageSize}
	)     
    .then((response) => {
      dispatch( { type: QUERY_SEARCH_RESULTS_SUCCESS, documents: response } )
    }).catch((error) => {
        dispatch( { type: QUERY_SEARCH_RESULTS_ERROR, error: error } )
    });
  }
};

const actions = { querySearchResults };

const reducers = {
	computeSearchResults(state = { isFetching: false, response: { get: function() { return ''; } }, success: false }, action) {
		switch (action.type) {
			case QUERY_SEARCH_RESULTS_START:
				return Object.assign({}, state, { isFetching: true });
				break;
	
			case QUERY_SEARCH_RESULTS_SUCCESS:
				return Object.assign({}, state, { response: action.documents, isFetching: false, success: true });
				break;
	
			case QUERY_SEARCH_RESULTS_ERROR:
				return Object.assign({}, state, { isFetching: false, isError: true, error: action.error});
				break;
	
			default: 
				return Object.assign({}, state, { isFetching: false });
			break;
		}
	}	
};

const middleware = [thunk];

export default { actions, reducers, middleware };