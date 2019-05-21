import RESTReducers from 'providers/rest-reducers'
import { combineReducers } from 'redux'

const computeLanguageFetch = RESTReducers.computeFetch('language')
const computeLanguageQuery = RESTReducers.computeQuery('languages')

export const fvLanguageReducer = combineReducers({
  computeLanguages: computeLanguageQuery.computeLanguages,
  computeLanguage: computeLanguageFetch.computeLanguage,
})
