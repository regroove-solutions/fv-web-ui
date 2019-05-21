import RESTReducers from 'providers/rest-reducers'
import { combineReducers } from 'redux'

import {
  DISMISS_ERROR,
  FV_PHRASES_SHARED_FETCH_START,
  FV_PHRASES_SHARED_FETCH_SUCCESS,
  FV_PHRASES_SHARED_FETCH_ERROR,
  FV_PHRASE_FETCH_ALL_START,
  FV_PHRASE_FETCH_ALL_SUCCESS,
  FV_PHRASE_FETCH_ALL_ERROR,
  FV_PHRASES_USER_MODIFIED_QUERY_START,
  FV_PHRASES_USER_MODIFIED_QUERY_SUCCESS,
  FV_PHRASES_USER_MODIFIED_QUERY_ERROR,
  FV_PHRASES_USER_CREATED_QUERY_START,
  FV_PHRASES_USER_CREATED_QUERY_SUCCESS,
  FV_PHRASES_USER_CREATED_QUERY_ERROR,
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
const computePhraseFactory = RESTReducers.computeFetch('phrase')
const computePhraseDeleteFactory = RESTReducers.computeDelete('delete_phrase')
const computePhraseEnableOperationFactory = RESTReducers.computeOperation('phrase_enable_workflow')
const computePhraseDisableOperationFactory = RESTReducers.computeOperation('phrase_disable_workflow')

const computePhrasesQueryFactory = RESTReducers.computeQuery('phrases')
const computeRecentlyModifiedPhrasesQuery = RESTReducers.computeQuery('modified_phrases')
const computeRecentlyCreatedPhrasesQuery = RESTReducers.computeQuery('created_phrases')

export const fvPhraseReducer = combineReducers({
  computeSharedPhrases(state = initialState, action) {
    switch (action.type) {
      case FV_PHRASES_SHARED_FETCH_START:
        return { ...state, isFetching: true }

      // Send modified document to UI without access REST end-point
      case FV_PHRASES_SHARED_FETCH_SUCCESS:
        return { ...state, response: action.documents, isFetching: false, success: true }

      // Send modified document to UI without access REST end-point
      case FV_PHRASES_SHARED_FETCH_ERROR:
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
  computePhrase: computePhraseFactory.computePhrase,
  computePhrases: computePhrasesQueryFactory.computePhrases,
  computeDeletePhrase: computePhraseDeleteFactory.computeDeletePhrase,
  computePhraseEnableWorkflow: computePhraseEnableOperationFactory.computePhraseEnableWorkflow,
  computePhraseDisableWorkflow: computePhraseDisableOperationFactory.computePhraseDisableWorkflow,
  computePhrasesAll(state = initialState, action) {
    switch (action.type) {
      case FV_PHRASE_FETCH_ALL_START:
        return { ...state, isFetching: true, success: false }

      case FV_PHRASE_FETCH_ALL_SUCCESS:
        return { ...state, response: action.documents, isFetching: false, success: true }

      case FV_PHRASE_FETCH_ALL_ERROR:
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
  },
  computeModifiedPhrases: computeRecentlyModifiedPhrasesQuery.computeModifiedPhrases,
  computeCreatedPhrases: computeRecentlyCreatedPhrasesQuery.computeCreatedPhrases,
  computeUserModifiedPhrases(state = initialState, action) {
    switch (action.type) {
      case FV_PHRASES_USER_MODIFIED_QUERY_START:
        return { ...state, isFetching: true }

      // Send modified document to UI without access REST end-point
      case FV_PHRASES_USER_MODIFIED_QUERY_SUCCESS:
        return { ...state, response: action.document, isFetching: false, success: true }

      // Send modified document to UI without access REST end-point
      case FV_PHRASES_USER_MODIFIED_QUERY_ERROR:
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
  },
  computeUserCreatedPhrases(state = initialState, action) {
    switch (action.type) {
      case FV_PHRASES_USER_CREATED_QUERY_START:
        return { ...state, isFetching: true }

      // Send modified document to UI without access REST end-point
      case FV_PHRASES_USER_CREATED_QUERY_SUCCESS:
        return { ...state, response: action.document, isFetching: false, success: true }

      // Send modified document to UI without access REST end-point
      case FV_PHRASES_USER_CREATED_QUERY_ERROR: // NOTE: intentional fallthrough
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
  },
})
