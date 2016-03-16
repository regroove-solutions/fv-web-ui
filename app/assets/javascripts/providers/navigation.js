// Middleware
import createLoggerMiddleware from 'redux-logger';
const loggerMiddleware = createLoggerMiddleware();

// Action constants
const TOGGLE_MENU = 'TOGGLE_MENU';
const NAVIGATE_PAGE = 'NAVIGATE_PAGE';

/**
* Actions: Represent that something happened, triggered by component or other action
*/
const actions = {
  // Request to navigate to a page
  navigateTo(path) {
    return { type: NAVIGATE_PAGE, path };
  },

  // Request to toggle side-menu
  toggleMenuAction() {
    return { type: TOGGLE_MENU };
  }
}

/**
* Reducers: Handle state changes based on an action.
* Accept current state, return new computed state.
* Reducer must be pure: No mutation, just calculations. See Redux for more info.
*/
const reducers = {

  computeNavigateTo(state = {path: null}, action) {
    switch (action.type) {
      case NAVIGATE_PAGE:
        return {path: action.path}
    }

    return state;
  },

  computeToggleMenuAction(state = {menuVisible: false}, action) {
    switch (action.type) {
      case TOGGLE_MENU:
      	return {
      		...state,
      		menuVisible: !state.menuVisible
      	};

      default:
        return state;
    }
  }
};

function merge (stateProps, dispatchProps, parentProps) {
  return Object.assign(stateProps, dispatchProps, parentProps);
}

const middleware = [/*loggerMiddleware,*/];

export default { actions, reducers, middleware, merge };