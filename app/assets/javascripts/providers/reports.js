// Middleware
import thunk from 'redux-thunk';

// Operations
import DirectoryOperations from 'operations/DirectoryOperations';
import DocumentOperations from 'operations/DocumentOperations';

const REPORT_DOCUMENTS_FETCH_START = "REPORT_DOCUMENTS_FETCH_START";
const REPORT_DOCUMENTS_FETCH_SUCCESS = "REPORT_DOCUMENTS_FETCH_SUCCESS";
const REPORT_DOCUMENTS_FETCH_ERROR = "REPORT_DOCUMENTS_FETCH_ERROR";

const GET_REPORT = "GET_REPORT";

const fetchReportDocuments = function fetchReportDocuments(path, queryAppend, type) {
  return function (dispatch) {

    dispatch( { type: REPORT_DOCUMENTS_FETCH_START } );
    
	return DocumentOperations.queryDocumentsByDialect("/" + path, queryAppend,
	    {'X-NXproperties': 'dublincore, fv-word, fvcore'},
	    {'currentPageIndex': 0, 'pageSize': 20}
	)     
    .then((response) => {
      dispatch( { type: REPORT_DOCUMENTS_FETCH_SUCCESS, documents: response } )
    }).catch((error) => {
        dispatch( { type: REPORT_DOCUMENTS_FETCH_ERROR, error: error } )
    });
  }
};

const getReport = function getReport(path, queryAppend) {
    return function(dispatch) {
		dispatch( { type: GET_REPORT, path: path, queryAppend: queryAppend } );
    };
}

const actions = { fetchReportDocuments, getReport };

const reducers = {
  computeReportDocuments(state = { isFetching: false, response: { get: function() { return ''; } }, success: false }, action) {
    switch (action.type) {
      case REPORT_DOCUMENTS_FETCH_START:
        return Object.assign({}, state, { isFetching: true });
      break;

      case REPORT_DOCUMENTS_FETCH_SUCCESS:
        return Object.assign({}, state, { response: action.documents, isFetching: false, success: true });
      break;

      case REPORT_DOCUMENTS_FETCH_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error});
      break;

      default: 
        return Object.assign({}, state, { isFetching: false });
      break;
    }
  },
  
  computeReport(state = {}, action) {
	    switch (action.type) {
	      case GET_REPORT:
	        return Object.assign({}, state, { path: action.path, queryAppend: action.queryAppend });
	      break;

	      default: 
	        return Object.assign({}, state, {});
	      break;
	    }	  
  }
};

const middleware = [thunk];

export default { actions, reducers, middleware };