import RESTReducers from 'providers/rest-reducers'
import { combineReducers } from 'redux'

import {
  DISMISS_ERROR,
  FV_LINKS_SHARED_FETCH_START,
  FV_LINKS_SHARED_FETCH_SUCCESS,
  FV_LINKS_SHARED_FETCH_ERROR,
} from './actionTypes'

const computeLinkFactory = RESTReducers.computeFetch('link')
const computeLinksFactory = RESTReducers.computeQuery('links')

export const fvLinkReducer = combineReducers({
  computeLink: computeLinkFactory.computeLink,
  computeLinks: computeLinksFactory.computeLinks,
  computeSharedLinks(
    state = {
      isFetching: false,
      response: {
        get: () => {
          return ''
        },
      },
      success: false,
    },
    action
  ) {
    switch (action.type) {
      case FV_LINKS_SHARED_FETCH_START:
        return { ...state, isFetching: true }

      // Send modified document to UI without access REST end-point
      case FV_LINKS_SHARED_FETCH_SUCCESS:
        return { ...state, response: action.documents, isFetching: false, success: true }

      // Send modified document to UI without access REST end-point
      case FV_LINKS_SHARED_FETCH_ERROR:
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
  },
})
