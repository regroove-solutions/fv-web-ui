// Middleware
import createLoggerMiddleware from 'redux-logger';
const loggerMiddleware = createLoggerMiddleware();
import thunk from 'redux-thunk';

// Operations
import DirectoryOperations from 'operations/DirectoryOperations';

// UI
const DISMISS_ERROR = 'DISMISS_ERROR';

// DIALECTS
const FETCH_DIALECTS_START = 'FETCH_DIALECTS_START';
const FETCH_DIALECTS_SUCCESS = 'FETCH_DIALECTS_SUCCESS';
const FETCH_DIALECTS_ERROR = 'FETCH_DIALECTS_ERROR';

// FAMILIES
const FETCH_FAMILIES_START = 'FETCH_FAMILIES_START';
const FETCH_FAMILIES_SUCCESS = 'FETCH_FAMILIES_SUCCESS';
const FETCH_FAMILIES_ERROR = 'FETCH_FAMILIES_ERROR';

/**
* Action
*/
const fetchDialects = function fetchDialects(pathOrId, type) {
  return function (dispatch) {

  	dispatch( { type: FETCH_DIALECTS_START } );

	  return DirectoryOperations.getDocumentByPath2(pathOrId, type, { headers: { 'X-NXenrichers.document': 'ancestry' } })
		.then((response) => {
			dispatch( { type: FETCH_DIALECTS_SUCCESS, document: response } )
		}).catch((error) => {
  			dispatch( { type: FETCH_DIALECTS_ERROR, error: error } )
		});
  }
};

const fetchFamilies = function fetchFamilies(pathOrId, type) {
  return function (dispatch) {

    dispatch( { type: FETCH_FAMILIES_START } );

    return DirectoryOperations.getDocumentByPath2(pathOrId, type, { headers: { 'X-NXenrichers.document': 'ancestry' } })
    .then((response) => {
      dispatch( { type: FETCH_FAMILIES_SUCCESS, document: response } )
    }).catch((error) => {
        dispatch( { type: FETCH_FAMILIES_ERROR, error: error } )
    });
  }
};

/**
* Actions: Represent that something happened
*/
const actions = { fetchDialects, fetchFamilies };

/**
* Reducers: Handle state changes based on an action
*/
const reducers = {
  computeDialects(state = { isFetching: false, response: {get: function() { return ''; }}, success: false }, action) {

    switch (action.type) {
      case FETCH_DIALECTS_START:
        return Object.assign({}, state, { isFetching: true, success: false });
      break;

      // Send modified document to UI without access REST end-point
      case FETCH_DIALECTS_SUCCESS:
        return Object.assign({}, state, { response: action.document, isFetching: false, success: true });
      break;

      // Send modified document to UI without access REST end-point
      case FETCH_DIALECTS_ERROR:
      case DISMISS_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error, errorDismissed: (action.type === DISMISS_ERROR) ? true: false });
      break;

      default: 
        return Object.assign({}, state, { isFetching: false });
      break;
    }
  },
  computeFamilies(state = { isFetching: false, response: {get: function() { return ''; }}, success: false }, action) {

    switch (action.type) {
      case FETCH_FAMILIES_START:
        return Object.assign({}, state, { isFetching: true, success: false });
      break;

      // Send modified document to UI without access REST end-point
      case FETCH_FAMILIES_SUCCESS:
        return Object.assign({}, state, { response: action.document, isFetching: false, success: true });
      break;

      // Send modified document to UI without access REST end-point
      case FETCH_FAMILIES_ERROR:
      case DISMISS_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error, errorDismissed: (action.type === DISMISS_ERROR) ? true: false });
      break;

      default: 
        return Object.assign({}, state, { isFetching: false });
      break;
    }
  }
};

function merge (stateProps, dispatchProps, parentProps) {
  return Object.assign(stateProps, dispatchProps, parentProps);
}

const middleware = [/*loggerMiddleware,*/ thunk];

export default { actions, reducers, middleware, merge };