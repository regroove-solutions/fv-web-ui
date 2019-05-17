import { combineReducers } from 'redux'

import { directoryReducer } from './directory'
import { documentReducer } from './document'
import { errorReducer } from './error'
import { exportDialectReducer } from './exportDialect'
import { fvAudioReducer } from './fvAudio'
import { fvBookReducer } from './fvBook'
import { fvCategoryReducer } from './fvCategory'
import { fvCharacterReducer } from './fvCharacter'
import { fvContributorReducer } from './fvContributor'
import { fvDialectReducer } from './fvDialect'
import { windowPathReducer } from './windowPath'

export default combineReducers({
  directory: directoryReducer,
  document: documentReducer,
  error: errorReducer,
  exportDialect: exportDialectReducer,
  fvAudio: fvAudioReducer,
  fvBook: fvBookReducer,
  fvCategory: fvCategoryReducer,
  fvCharacter: fvCharacterReducer,
  fvContributor: fvContributorReducer,
  fvDialect: fvDialectReducer,
  windowPath: windowPathReducer,
})
