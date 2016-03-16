// Configuration
import ConfGlobal from 'conf/local.json';

// API
import Nuxeo from 'nuxeo';

// Middleware
import createLoggerMiddleware from 'redux-logger';
import thunk from 'redux-thunk';
// Models
import Dialect from 'models/Dialect';
import Dialects from 'models/Dialects';

// Operations
import DocumentOperations from 'operations/DocumentOperations';

const loggerMiddleware = createLoggerMiddleware();

import { PUSH_WINDOW_PATH, REPLACE_WINDOW_PATH } from 'provide-page';

// UX
const TOGGLE_MENU = 'TOGGLE_MENU';
const REQUEST_EDIT = 'REQUEST_EDIT';

// PAGES
const NAVIGATE_PAGE = 'NAVIGATE_PAGE';

// DATA
const CLIENT_CREATED = 'CLIENT_CREATED';

const FETCH_DIALECT = 'FETCH_DIALECT';
const FETCH_PORTAL = 'FETCH_PORTAL';
const FETCH_DIALECT_AND_PORTAL = 'FETCH_DIALECT_AND_PORTAL';

// EDITING
const REQUEST_SAVE_FIELD = 'REQUEST_SAVE_FIELD';

//import RunActions from '../actions/RunActions';
//import UserApiUtils from '../utils/UserApiUtils';
//import RunApiUtils from '../utils/RunApiUtils';
//import logError from '../utils/logError'


const client = new Nuxeo({
  baseURL: ConfGlobal.baseURL,
  restPath: 'site/api/v1',
  automationPath: 'site/automation',
  timeout: 30000
});

client.header('X-NXproperties', '*');

DocumentOperations.setClient(client);

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

console.log(newDoc);
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

  navigateTo(path) {
    return { type: NAVIGATE_PAGE, path };
  },

  toggleMenuAction() {
    return { type: TOGGLE_MENU };
  },

  fetchDialect,

  requestSaveField,

  fetchPortal,

  // Second provider?
  connect() {
      return { type: CLIENT_CREATED };
  },

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

  navigateTo(state = null, action) {
    switch (action.type) {
      case NAVIGATE_PAGE:
        return state;
    }

    return state;
  },

  ui(state = {}, action) {
    switch (action.type) {
      case TOGGLE_MENU:
      	return {
      		...state,
      		menuVisible: !state.menuVisible
      	};

      default:
        return state;
    }
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
  return Object.assign(stateProps, dispatchProps, parentProps, { ui: stateProps.ui });
}

const middleware = [/*loggerMiddleware,*/ thunk];

export default { actions, reducers, middleware, merge };