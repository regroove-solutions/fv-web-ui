// Middleware
import createLoggerMiddleware from 'redux-logger';
const loggerMiddleware = createLoggerMiddleware();

// Operations
import DocumentOperations from 'operations/DocumentOperations';

// Actions
const CLIENT_CREATED = 'CLIENT_CREATED';

const LOGIN_REQUESTED = 'LOGIN_REQUESTED';

/**
* Actions: Represent that something happened
*/
const actions = {
  connect() {
  	  DocumentOperations.initClient();
      return { type: CLIENT_CREATED };
  },
  requestLogin() {
      return { type: LOGIN_REQUESTED };
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

  computeRequestLogin(state = {newState: 'default'}, action) {
    switch(action.type) {
      case LOGIN_REQUESTED:
        return Object.assign({}, {newState: 'test'});
      break;
    }

    return state;
  }

};

function merge (stateProps, dispatchProps, parentProps) {
  return Object.assign(stateProps, dispatchProps, parentProps);
}

const middleware = [/*loggerMiddleware*/];

export default { actions, reducers, middleware, merge };