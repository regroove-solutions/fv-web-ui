import RESTReducers from 'providers/rest-reducers'
import { combineReducers } from 'redux'

const computeUserFetchFactory = RESTReducers.computeFetch('user')
const computeUserSuggestion = RESTReducers.computeOperation('user_suggestion')
const computeUserSelfregisterOperation = RESTReducers.computeOperation('user_selfregister')
const computeUserUpdate = RESTReducers.computeOperation('user_update')
const computeUserUpgrade = RESTReducers.computeOperation('user_upgrade')
const computeUserDialectsOperation = RESTReducers.computeOperation('user_dialects')

export const fvUserReducer = combineReducers({
  computeUser: computeUserFetchFactory.computeUser,
  computeUserUpdate: computeUserUpdate.computeUserUpdate,
  computeUserUpgrade: computeUserUpgrade.computeUserUpgrade,
  computeUserSuggestion: computeUserSuggestion.computeUserSuggestion,
  computeUserSelfregister: computeUserSelfregisterOperation.computeUserSelfregister,
  computeUserDialects: computeUserDialectsOperation.computeUserDialects,
})
