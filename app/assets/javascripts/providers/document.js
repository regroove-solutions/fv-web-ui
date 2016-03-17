// Middleware
import createLoggerMiddleware from 'redux-logger';
const loggerMiddleware = createLoggerMiddleware();
import thunk from 'redux-thunk';

// Operations
import DocumentOperations from 'operations/DocumentOperations';

// UI
const DISMISS_ERROR = 'DISMISS_ERROR';

// Action Constants
const ENABLE_EDIT_MODE = 'ENABLE_EDIT_MODE';
const DISABLE_EDIT_MODE = 'DISABLE_EDIT_MODE';

const CLIENT_CREATED = 'CLIENT_CREATED';

const FETCH_DIALECT = 'FETCH_DIALECT';

const FETCH_DIALECT_AND_PORTAL = 'FETCH_DIALECT_AND_PORTAL';

// FETCH
const FETCH_PORTAL_START = 'FETCH_PORTAL_START';
const FETCH_PORTAL_SUCCESS = 'FETCH_PORTAL_SUCCESS';
const FETCH_PORTAL_ERROR = 'FETCH_PORTAL_ERROR';

// UPDATE
const UPDATE_PORTAL_START = 'UPDATE_PORTAL_START';
const UPDATE_PORTAL_SUCCESS = 'UPDATE_PORTAL_SUCCESS';
const UPDATE_PORTAL_ERROR = 'UPDATE_PORTAL_ERROR';

// EDITING
const REQUEST_SAVE_FIELD = 'REQUEST_SAVE_FIELD';

/**
* Action
*/
const fetchDialect = function fetchDialect(path) {
  return function (dispatch) {

  	dispatch( { type: FETCH_DIALECT } );

  	return DocumentOperations.getDocumentByPath(path, 'FVDialect', { headers: { 'X-NXenrichers.document': 'ancestry' } })
  		.then((response) => {
  			dispatch( { type: FETCH_DIALECT, status: 'success', response: response } )
  		}).catch((error) => {
    			dispatch( { type: FETCH_DIALECT, status: 'failed', error: error } )
    	});
  }
};

const fetchPortal = function fetchPortal(path) {
  return function (dispatch) {

  	dispatch( { type: FETCH_PORTAL_START } );

	  return DocumentOperations.getDocumentByPath(path, 'FVPortal', { headers: { 'X-NXenrichers.document': 'ancestry' } })
		.then((response) => {
			dispatch( { type: FETCH_PORTAL_SUCCESS, document: response } )
		}).catch((error) => {
  			dispatch( { type: FETCH_PORTAL_ERROR, error: error } )
		});
  }
};

const updatePortal = function updatePortal(newDoc, field) {
  return function (dispatch) {

    dispatch( { type: UPDATE_PORTAL_START, document: newDoc, field: field } );

    return DocumentOperations.updateDocument(newDoc)
      .then((response) => {
        dispatch( { type: UPDATE_PORTAL_SUCCESS, document: response, field: field} );
      }).catch((error) => {
          dispatch( { type: UPDATE_PORTAL_ERROR, error: error, field: field } )
    });
  }
};

/**
* Actions: Represent that something happened
*/
const actions = {

  dismissError(error) {
   return { type: DISMISS_ERROR };
  },

  enableEditMode(field) {
	 return { type: ENABLE_EDIT_MODE, field: field };
  },

  disableEditMode(field = null) {
   return { type: DISABLE_EDIT_MODE, field: field };
  },

  requestSaveField1() {
    return { type: REQUEST_SAVE_FIELD };
  },
  fetchDialect,

  updatePortal,

  fetchPortal,

  // Change to 
  fetchDialectAndPortal(dialectPath, title) {
    return function (dispatch, getState) {

  	  dispatch( { type: FETCH_DIALECT_AND_PORTAL } );

      return Promise.all([
      	dispatch(fetchDialect(dialectPath)),
        dispatch(fetchPortal(dialectPath + '/Portal'))
      ]).then(() =>
      	dispatch( { type: FETCH_DIALECT_AND_PORTAL, status: 'success', dialect: getState().computeDialect.response, portal: getState().computePortal.response } )
      );
    }
  }

}


/**
* Reducers: Handle state changes based on an action
*/
const reducers = {

  computeEditMode(state = {}, action) {

    let enabledField = {};
    enabledField[action.field] = true;

    switch (action.type) {
      case ENABLE_EDIT_MODE:
        return Object.assign({}, state, enabledField);
      case DISABLE_EDIT_MODE:
        return state;
      case UPDATE_PORTAL_SUCCESS:
        let { [action.field]: deletedItem, ...rest } = state // See http://stackoverflow.com/questions/35342355/remove-data-from-nested-objects-without-mutating/35367927
        return rest;
    }

    return state;
  },

  properties(state = null) {
    return state;
  },

  computeDialect(state = { isFetching: true, response: {get: function() { return ''; }}, success: false }, action) {

  	if (action.type === FETCH_DIALECT) {
	  	if (!action.status) {
	  		return Object.assign({}, state, { isFetching: true });
	  	}

	  	switch (action.status) {
			case 'success':
				return Object.assign({}, state, { isFetching: false, success: true, response: action.response });

			case 'failed':
				return Object.assign({}, state, { isFetching: false, success: false, error: action.error });
	  	}

  	}

  	return Object.assign({}, state, { isFetching: false });
  },
//////////////////////////////// DRY!!!!!!!!!!!!
  computePortal(state = { isFetching: false, response: {get: function() { return ''; }}, success: false }, action) {

    switch (action.type) {
      case UPDATE_PORTAL_START:
      case FETCH_PORTAL_START:
        return Object.assign({}, state, { isFetching: true, success: false });
      break;

      // Send modified document to UI without access REST end-point
      case UPDATE_PORTAL_SUCCESS:
      case FETCH_PORTAL_SUCCESS:
        return Object.assign({}, state, { response: action.document, isFetching: false, success: true });
      break;

      // Send modified document to UI without access REST end-point
      case UPDATE_PORTAL_ERROR:
      case FETCH_PORTAL_ERROR:
      case DISMISS_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error, errorDismissed: (action.type === DISMISS_ERROR) ? true: false });
      break;

      /*case FETCH_PORTAL: 
        if (!action.status) {
          return Object.assign({}, state, { isFetching: true });
        }

        switch (action.status) {
        case 'success':
          return Object.assign({}, state, { isFetching: false, success: true, response: action.response });

        case 'failed':
          return Object.assign({}, state, { isFetching: false, success: false, error: action.error });
        }
      break;*/

      default: 
        return Object.assign({}, state, { isFetching: false });
      break;
    }
  },

///////////////////Normalize me!
  computeDialectAndPortal(state = { isFetching: true, response: {}, success: false }, action) {

  	if (action.type === FETCH_DIALECT_AND_PORTAL) {
	  	if (!action.status) {
	  		return Object.assign({}, state, { isFetching: true });
	  	}

	  	switch (action.status) {
			case 'success':
				let combinedEntities = Object.assign({}, action.dialect, action.portal);
				return Object.assign({}, state, { isFetching: false, success: true, response: combinedEntities });

			case 'failed':
				return Object.assign({}, state, { isFetching: false, success: false, error: action.error });
	  	}

  	}

  	return Object.assign({}, state, { isFetching: false });
  },

  saveField(state = false, action) {
    switch (action.type) {
      case REQUEST_SAVE_FIELD:
        return !state;
    }

    return state;
  }
};

function merge (stateProps, dispatchProps, parentProps) {
  return Object.assign(stateProps, dispatchProps, parentProps);
}

const middleware = [/*loggerMiddleware,*/ thunk];

export default { actions, reducers, middleware, merge };