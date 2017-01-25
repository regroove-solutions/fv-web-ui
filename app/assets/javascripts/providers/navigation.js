// Middleware
import createLoggerMiddleware from 'redux-logger';

import ThemeManager from 'material-ui/lib/styles/theme-manager';

import FirstVoicesTheme from 'views/themes/FirstVoicesTheme.js';
import FirstVoicesKidsTheme from 'views/themes/FirstVoicesKidsTheme.js';

const loggerMiddleware = createLoggerMiddleware();

// Action constants
const TOGGLE_MENU = 'TOGGLE_MENU';
const NAVIGATE_PAGE = 'NAVIGATE_PAGE';
const CHANGE_THEME = 'CHANGE_THEME';

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
  },
  
  // Change theme
  changeTheme(id) {

    let theme = ThemeManager.getMuiTheme(FirstVoicesTheme);

    switch (id) {
      case 'kids':
        theme = ThemeManager.getMuiTheme(FirstVoicesKidsTheme);
      break;
    }

    return { type: CHANGE_THEME, theme: {palette: theme, id: id } }
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
        return Object.assign({}, {path: action.path});
    }

    return state;
  },

  properties(state = null, action) {
    switch (action.type) {
      case CHANGE_THEME:
      	return {
      		...state,
      		theme: action.theme
      	};

      default:
        return state;
    }
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