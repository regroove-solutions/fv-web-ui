import RESTActions from './rest-actions'
import RESTReducers from './rest-reducers'

//Middleware
import thunk from 'redux-thunk';

// Operations
import UserOperations from 'operations/UserOperations';

const FV_TASKS_FETCH_START = "FV_TASKS_FETCH_START";
const FV_TASKS_FETCH_SUCCESS = "FV_TASKS_FETCH_SUCCESS";
const FV_TASKS_FETCH_ERROR = "FV_TASKS_FETCH_ERROR";

const fetchUserTasks = function fetchUserTasks() {
	  return function (dispatch) {
	
	    dispatch( { type: FV_TASKS_FETCH_START } );
	
		return UserOperations.getUserTasks()
			.then((response) => {
			dispatch( { type: FV_TASKS_FETCH_SUCCESS, documents: response } )
	    }).catch((error) => {
	        dispatch( { type: FV_TASKS_FETCH_ERROR, error: error } )
	    });
	  }
};

const approveDocument = RESTActions.execute('FV_DOCUMENT_APPROVE', 'WorkflowTask.Complete', { headers: { 'X-NXenrichers.document': 'ancestry,word,permissions' }, params: { 'status': 'validate'} });
const rejectDocument = RESTActions.execute('FV_DOCUMENT_REJECT', 'WorkflowTask.Complete', { headers: { 'X-NXenrichers.document': 'ancestry,word,permissions' }, params: { 'status': 'reject'} });

const computeApproveDocumentOperationFactory = RESTReducers.computeOperation('document_approve');
const computeRejectDocumentOperationFactory = RESTReducers.computeOperation('document_reject');

const actions = { fetchUserTasks, approveDocument, rejectDocument };

const reducers = {
	computeUserTasks(state = { isFetching: false, response: { get: function() { return ''; } }, success: false }, action) {
		switch (action.type) {
			case FV_TASKS_FETCH_START:
				return Object.assign({}, state, { isFetching: true });
				break;
	
			case FV_TASKS_FETCH_SUCCESS:
				return Object.assign({}, state, { response: action.documents, isFetching: false, success: true });
				break;
	
			case FV_TASKS_FETCH_ERROR:
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