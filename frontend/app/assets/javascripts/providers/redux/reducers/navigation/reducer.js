import { combineReducers } from 'redux'
import {
  TOGGLE_MENU,
  NAVIGATE_PAGE,
  CHANGE_THEME,
  CHANGE_TITLE_PARAMS,
  OVERRIDE_BREADCRUMBS,
  PAGE_PROPERTIES,
  LOAD_GUIDE_STARTED,
  LOAD_GUIDE_SUCCESS,
  LOAD_GUIDE_ERROR,
  LOAD_NAVIGATION_STARTED,
  LOAD_NAVIGATION_SUCCESS,
  LOAD_NAVIGATION_ERROR,
} from './actionTypes'

import ThemeManager from 'material-ui/lib/styles/theme-manager'
import FirstVoicesTheme from 'views/themes/FirstVoicesTheme.js'
const initialStateProperties = { palette: ThemeManager.getMuiTheme(FirstVoicesTheme), id: 'default' }

export const navigationReducer = combineReducers({
  computeNavigateTo(state = { path: null }, action = {}) {
    switch (action.type) {
      case NAVIGATE_PAGE:
        return { path: action.path }
      default: // NOTE: do nothing
    }

    return state
  },
  properties(state = initialStateProperties, action = {}) {
    switch (action.type) {
      case CHANGE_THEME:
        return {
          ...state,
          theme: action.theme,
        }

      case CHANGE_TITLE_PARAMS:
        return {
          ...state,
          pageTitleParams: action.pageTitleParams,
        }

      case OVERRIDE_BREADCRUMBS:
        return {
          ...state,
          breadcrumbs: action.breadcrumbs,
        }

      case PAGE_PROPERTIES:
        return {
          ...state,
          pageProperties: action.pageProperties,
        }

      default:
        return state
    }
  },

  computeLoadGuide(
    state = {
      isFetching: false,
      page: { matchedPage: null, matchedRouteParams: null },
      response: null,
      success: false,
    },
    action = {}
  ) {
    switch (action.type) {
      case LOAD_GUIDE_STARTED:
        return { ...state, isFetching: true, page: action.page }

      // Send modified document to UI without access REST end-point
      case LOAD_GUIDE_SUCCESS:
        return {
          ...state,
          response: action.document,
          isFetching: false,
          page: action.page,
          success: true,
        }

      // Send modified document to UI without access REST end-point
      case LOAD_GUIDE_ERROR:
        return { ...state, isFetching: false, isError: true, error: action.error, page: action.page }

      default:
        return { ...state, isFetching: false, page: action.page }
    }
  },

  computeLoadNavigation(state = { isFetching: false, response: null, success: false }, action = {}) {
    switch (action.type) {
      case LOAD_NAVIGATION_STARTED:
        return { ...state, isFetching: true }

      // Send modified document to UI without access REST end-point
      case LOAD_NAVIGATION_SUCCESS:
        return { ...state, response: action.document, isFetching: false, success: true }

      // Send modified document to UI without access REST end-point
      case LOAD_NAVIGATION_ERROR:
        return { ...state, isFetching: false, isError: true, error: action.error }

      default:
        return { ...state, isFetching: false }
    }
  },

  computeToggleMenuAction(state = { menuVisible: false }, action = {}) {
    switch (action.type) {
      case TOGGLE_MENU:
        return {
          ...state,
          menuVisible: !state.menuVisible,
        }

      default:
        return state
    }
  },
})
