import RESTReducers from 'providers/rest-reducers'
import { combineReducers } from 'redux'

import {
  DISMISS_ERROR,
  FV_CATEGORIES_FETCH_START,
  FV_CATEGORIES_FETCH_SUCCESS,
  FV_CATEGORIES_FETCH_ERROR,
  FV_CATEGORIES_SHARED_FETCH_START,
  FV_CATEGORIES_SHARED_FETCH_SUCCESS,
  FV_CATEGORIES_SHARED_FETCH_ERROR,
  FV_CATEGORY_FETCH_ALL_START,
  FV_CATEGORY_FETCH_ALL_SUCCESS,
  FV_CATEGORY_FETCH_ALL_ERROR,
  FV_CATEGORY_CREATE_START,
  FV_CATEGORY_CREATE_SUCCESS,
  FV_CATEGORY_CREATE_ERROR,
} from './actionTypes'

const initialState = {
  isFetching: false,
  response: {
    get: () => {
      return ''
    },
  },
  success: false,
}

const computeSharedCategories = (state = initialState, action) => {
  switch (action.type) {
    case FV_CATEGORIES_SHARED_FETCH_START:
      return { ...state, isFetching: true }

    // Send modified document to UI without access REST end-point
    case FV_CATEGORIES_SHARED_FETCH_SUCCESS:
      return { ...state, response: action.documents, isFetching: false, success: true }

    // Send modified document to UI without access REST end-point
    case FV_CATEGORIES_SHARED_FETCH_ERROR:
      return {
        ...state,
        isFetching: false,
        isError: true,
        error: action.error,
        errorDismissed: action.type === DISMISS_ERROR ? true : false,
      }

    default:
      return { ...state, isFetching: false }
  }
}

const computeCategoriesInPath = (state = initialState, action) => {
  switch (action.type) {
    case FV_CATEGORIES_FETCH_START:
      return { ...state, isFetching: true }

    // Send modified document to UI without access REST end-point
    case FV_CATEGORIES_FETCH_SUCCESS:
      return { ...state, response: action.documents, isFetching: false, success: true }

    // Send modified document to UI without access REST end-point
    case FV_CATEGORIES_FETCH_ERROR:
    case DISMISS_ERROR:
      return {
        ...state,
        isFetching: false,
        isError: true,
        error: action.error,
        errorDismissed: action.type === DISMISS_ERROR ? true : false,
      }

    default:
      return { ...state, isFetching: false }
  }
}

const _computeCategoryFactory = RESTReducers.computeFetch('category')
const computeCategory = _computeCategoryFactory.computeCategory

const _computeCategoriesFactory = RESTReducers.computeQuery('categories')
const computeCategories = _computeCategoriesFactory.computeCategories

/*
  const computeCategory =(state = { categories: {} }, action) => {
    switch (action.type) {
      case FV_CATEGORY_FETCH_START:
      case FV_CATEGORY_UPDATE_START:

        action.categories[action.pathOrId].isFetching = true;
        action.categories[action.pathOrId].success = false;

        return { ...state, categories: Object.assign(state.categories, action.categories) }
      ;

      // Send modified document to UI without access REST end-point
      case FV_CATEGORY_FETCH_SUCCESS:
      case FV_CATEGORY_UPDATE_SUCCESS:

        action.categories[action.pathOrId].isFetching = false;
        action.categories[action.pathOrId].success = true;

        return { ...state, categories: Object.assign(state.categories, action.categories) }
      ;

      // Send modified document to UI without access REST end-point
      case FV_CATEGORY_FETCH_ERROR:
      case FV_CATEGORY_UPDATE_ERROR:

        action.categories[action.pathOrId].isFetching = false;
        action.categories[action.pathOrId].success = false;
        action.categories[action.pathOrId].isError = true;
        action.categories[action.pathOrId].error = action.error;

        return { ...state, categories: Object.assign(state.categories, action.categories) }
      ;

      default:
        return state;
      ;
    }
  }
*/

const computeCreateCategory = (
  state = {
    ...initialState,
    pathOrId: null,
  },
  action
) => {
  switch (action.type) {
    case FV_CATEGORY_CREATE_START:
      return { ...state, isFetching: true, success: false, pathOrId: action.pathOrId }

    // Send modified document to UI without access REST end-point
    case FV_CATEGORY_CREATE_SUCCESS:
      return { ...state, response: action.document, isFetching: false, success: true, pathOrId: action.pathOrId }

    // Send modified document to UI without access REST end-point
    case FV_CATEGORY_CREATE_ERROR:
      return { ...state, isFetching: false, isError: true, error: action.error, pathOrId: action.pathOrId }

    default:
      return { ...state, isFetching: false }
  }
}

const computeCategoriesAll = (state = initialState, action) => {
  switch (action.type) {
    case FV_CATEGORY_FETCH_ALL_START:
      return { ...state, isFetching: true, success: false }

    case FV_CATEGORY_FETCH_ALL_SUCCESS:
      return { ...state, response: action.documents, isFetching: false, success: true }

    case FV_CATEGORY_FETCH_ALL_ERROR:
    case DISMISS_ERROR:
      return {
        ...state,
        isFetching: false,
        isError: true,
        error: action.error,
        errorDismissed: action.type === DISMISS_ERROR ? true : false,
      }

    default:
      return { ...state, isFetching: false }
  }
}

export const fvCategory = combineReducers({
  computeSharedCategories,
  computeCategoriesInPath,
  computeCategory,
  computeCategories,
  computeCreateCategory,
  computeCategoriesAll,
})
