// Middleware
import createLoggerMiddleware from 'redux-logger';
const loggerMiddleware = createLoggerMiddleware();
import thunk from 'redux-thunk';

// Operations
import DocumentOperations from 'operations/DocumentOperations';

// Action Constants
const REQUEST_EDIT = 'REQUEST_EDIT';

const CLIENT_CREATED = 'CLIENT_CREATED';

const FETCH_DIALECT = 'FETCH_DIALECT';
const FETCH_PORTAL = 'FETCH_PORTAL';
const FETCH_DIALECT_AND_PORTAL = 'FETCH_DIALECT_AND_PORTAL';

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

  	dispatch( { type: FETCH_PORTAL } );

	return DocumentOperations.getDocumentByPath(path, 'FVPortal', { headers: { 'X-NXenrichers.document': 'ancestry' } })
		.then((response) => {
			dispatch( { type: FETCH_PORTAL, status: 'success', response: response } )
		}).catch((error) => {
  			dispatch( { type: FETCH_PORTAL, status: 'failed', error: error } )
  		});
  }
};

const requestSaveField = function updateDocument(newDoc) {
  return function (dispatch) {

   // dispatch( { type: FETCH_PORTAL } );

  return DocumentOperations.updateDocument(newDoc)
    .then((response) => {
      dispatch( { type: FETCH_PORTAL, status: 'success', response: response } )
    }).catch((error) => {
        dispatch( { type: FETCH_PORTAL, status: 'failed', error: error } )
      });
  }
};

/**
* Actions: Represent that something happened
*/
const actions = {

  requestEdit() {
	 return { type: REQUEST_EDIT };
  },

  requestSaveField1() {
    return { type: REQUEST_SAVE_FIELD };
  },
  fetchDialect,

  requestSaveField,

  fetchPortal,

  // Second provider?
  connect() {
  	  DocumentOperations.initClient();
      return { type: CLIENT_CREATED };
  },

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
  editMode(state = false, action) {
    switch (action.type) {
      case REQUEST_EDIT:
        return !state;
    }

    return state;
  },

  properties(state = null) {
    return state;
  },

  connect(state = {isConnected: false}, action) {
  	switch (action.type) {
  		case CLIENT_CREATED:
		return Object.assign({}, state, {
			isConnected: true,
			client: action.client
		})

  	}
  	return {state};
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
  computePortal(state = { isFetching: true, response: {get: function() { return ''; }}, success: false }, action) {

  	if (action.type === FETCH_PORTAL) {
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