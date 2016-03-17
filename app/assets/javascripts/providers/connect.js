// Middleware
import createLoggerMiddleware from 'redux-logger';
const loggerMiddleware = createLoggerMiddleware();

// Operations
import DocumentOperations from 'operations/DocumentOperations';

const CLIENT_CREATED = 'CLIENT_CREATED';

/**
* Actions: Represent that something happened
*/
const actions = {
  connect() {
  	  DocumentOperations.initClient();
      return { type: CLIENT_CREATED };
  }
}

/**
* Reducers: Handle state changes based on an action
*/
const reducers = {

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

};

function merge (stateProps, dispatchProps, parentProps) {
  return Object.assign(stateProps, dispatchProps, parentProps);
}

const middleware = [/*loggerMiddleware,*/];

export default { actions, reducers, middleware, merge };