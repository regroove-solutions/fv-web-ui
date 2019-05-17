import RESTReducers from './rest-reducers'
import { combineReducers } from 'redux'

const computeCharacterFetchFactory = RESTReducers.computeFetch('character')
const computeCharactersQueryFactory = RESTReducers.computeQuery('characters')

export const fvCharacterReducer = combineReducers({
  computeCharacter: computeCharacterFetchFactory.computeCharacter,
  computeCharacters: computeCharactersQueryFactory.computeCharacters,
})
