// Middleware
import thunk from 'redux-thunk';
import Request from 'request';

// Configuration
import ConfGlobal from 'conf/local.json';

// Operations
import BaseOperations from 'operations/BaseOperations';
import UserOperations from 'operations/UserOperations';

// Actions
const CONNECT = "CONNECT";

const LOGIN_START = "LOGIN_START";
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGIN_ERROR = "LOGIN_ERROR";

const GET_USER_START = "GET_USER_START";
const GET_USER_SUCCESS = "GET_USER_SUCCESS";
const GET_USER_ERROR = "GET_USER_ERROR";

/**
* Actions: Represent that something happened
*/
const connect = function connect() {
  return function (dispatch) {
    BaseOperations.initClient();
    dispatch( { type: CONNECT } );
  }
}

const login = function login(username, password) {
  return function (dispatch) {

    dispatch( { type: LOGIN_START } );

    // TODO: Better way of handling logout. Currently the 'login' method does not invalidate an existing cookie.
    Request({url: ConfGlobal.baseURL + "logout", method: "GET"}, function (error, response, body) {
      return BaseOperations.login(username, password)
        .then((response) => {
          dispatch( { type: LOGIN_SUCCESS, user: response, isAnonymous: response.isAnonymous} );
        }).catch((error) => {
            dispatch( { type: LOGIN_ERROR, error: error, field: field } )
      });
    });
  }
};

const getUser = function getUser() {
  return function (dispatch) {

    dispatch( { type: GET_USER_START } );

    return UserOperations.getUser()
      .then((response) => {
        dispatch( { type: GET_USER_SUCCESS, user: response, isAnonymous: response.isAnonymous} );
      }).catch((error) => {
          dispatch( { type: GET_USER_ERROR, error: error, field: field } )
    });
  }
}

const actions = { connect, login, getUser };

/**
* Reducers: Handle state changes based on an action
*/
const reducers = {

  connect(state = {isConnected: false}, action) {
  	switch (action.type) {
  		case CONNECT:
		return Object.assign({}, state, {
			isConnected: true,
			client: action.client
		})

  	}
  	return {state};
  },

  computeLogin(state = { isFetching: false, response: {get: function() { return ''; }}, success: false }, action) {
    switch (action.type) {
      case LOGIN_START:
        return Object.assign({}, state, { isFetching: true, success: false });
      break;

      case LOGIN_SUCCESS:
      case GET_USER_SUCCESS:
        return Object.assign({}, state, { response: action.user, isFetching: false, success: true, isConnected: !action.isAnonymous });
      break;

      case LOGIN_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error });
      break;

      default: 
        return Object.assign({}, state, { isFetching: false });
      break;
    }
  }
};

const middleware = [thunk];

export default { actions, reducers, middleware };