import RESTReducers from 'providers/rest-reducers'
import { combineReducers } from 'redux'

const computeLanguageFamilyFetch = RESTReducers.computeFetch('language_family')
export const fvLanguageFamilyReducer = combineReducers({
  computeLanguageFamily: computeLanguageFamilyFetch.computeLanguageFamily,
})
