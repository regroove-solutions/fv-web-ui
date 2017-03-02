// Middleware
//import createLoggerMiddleware from 'redux-logger';
import thunk from 'redux-thunk';

import ThemeManager from 'material-ui/lib/styles/theme-manager';

import FirstVoicesTheme from 'views/themes/FirstVoicesTheme.js';
import FirstVoicesKidsTheme from 'views/themes/FirstVoicesKidsTheme.js';
import FirstVoicesWorkspaceTheme from 'views/themes/FirstVoicesWorkspaceTheme.js';

import ProviderHelpers from 'common/ProviderHelpers';

import DirectoryOperations from 'operations/DirectoryOperations';

//const loggerMiddleware = createLoggerMiddleware();

// Action constants
const TOGGLE_MENU = 'TOGGLE_MENU';
const NAVIGATE_PAGE = 'NAVIGATE_PAGE';
const CHANGE_THEME = 'CHANGE_THEME';

const LOAD_GUIDE_STARTED = 'LOAD_GUIDE_STARTED';
const LOAD_GUIDE_SUCCESS = 'LOAD_GUIDE_SUCCESS';
const LOAD_GUIDE_ERROR = 'LOAD_GUIDE_ERROR';

const loadGuide = function loadGuide(currentPage, pageMatch) {
  return function (dispatch) {

    dispatch( { type: LOAD_GUIDE_STARTED, page: pageMatch  } );

    let currentPageArray = decodeURIComponent(currentPage).split('/');

    // Remove empties
    currentPageArray = currentPageArray.filter(String);

    let preparedCurrentPage = pageMatch.matchedPage.get('path').map(function(fragment, i){
      let ANYTHING_BUT_SLASH_REGEX = '/' + ProviderHelpers.regex.ANYTHING_BUT_SLASH.replace('/', '\\/') + '/';
      // Check if path fragment matches ANYTHING_BUT_SLASH regex and replace wildcard.
      if (fragment == ANYTHING_BUT_SLASH_REGEX || fragment.hasOwnProperty('matcher') && fragment.matcher == ANYTHING_BUT_SLASH_REGEX) {
        currentPageArray[i] = '%'
      }
    })
    
    //console.log('GUIDE MATCH = /' + currentPageArray.join('/') + '/');
    
    return DirectoryOperations.getDocumentByPath2('/FV/Workspaces/SharedData/Guides', 'FVGuide', ' AND fvguide:pageMatch LIKE \'/' + currentPageArray.join('/') + '/\'', { 'X-NXenrichers.document': '' })
    .then((response) => {
      dispatch( { type: LOAD_GUIDE_SUCCESS, document: response, page: pageMatch } )
    }).catch((error) => {
        dispatch( { type: LOAD_GUIDE_ERROR, error: error, page: pageMatch } )
    });
  }
};

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

      case 'workspace':
        theme = ThemeManager.getMuiTheme(FirstVoicesWorkspaceTheme);
      break;
    }

    return { type: CHANGE_THEME, theme: {palette: theme, id: id } }
  },
  
  loadGuide
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

  computeLoadGuide(state = { isFetching: false, page: { matchedPage: null, matchedRouteParams: null }, response: null, success: false }, action) {
    switch (action.type) {
      case LOAD_GUIDE_STARTED:
        return Object.assign({}, state, { isFetching: true, page: action.page });
      break;

      // Send modified document to UI without access REST end-point
      case LOAD_GUIDE_SUCCESS:
        return Object.assign({}, state, { response: action.document, isFetching: false, page: action.page, success: true });
      break;

      // Send modified document to UI without access REST end-point
      case LOAD_GUIDE_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error, page: action.page });
      break;

      default: 
        return Object.assign({}, state, { isFetching: false, page: action.page });
      break;
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
  },
};

function merge (stateProps, dispatchProps, parentProps) {
  return Object.assign(stateProps, dispatchProps, parentProps);
}

const middleware = [/*loggerMiddleware,*/ thunk];

export default { actions, reducers, middleware, merge };