import { combineReducers } from 'redux'
import { errorReducer } from './error'
import { fvContributorReducer } from './fvContributor'
import { fvDialectReducer } from './fvDialect'
import { documentReducer } from './document'
export default combineReducers({
  error: errorReducer,
  fvContributor: fvContributorReducer,
  fvDialect: fvDialectReducer,
  document: documentReducer,
})
