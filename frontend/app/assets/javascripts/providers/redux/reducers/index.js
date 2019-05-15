import { combineReducers } from 'redux'
import { errorReducer } from './error'
import { fvContributorReducer } from './fvContributor'
import { fvDialectReducer } from './fvDialect'
import { documentReducer } from './document'
import { windowPathReducer } from './windowPath'
export default combineReducers({
  error: errorReducer,
  fvContributor: fvContributorReducer,
  fvDialect: fvDialectReducer,
  document: documentReducer,
  windowPath: windowPathReducer,
})
