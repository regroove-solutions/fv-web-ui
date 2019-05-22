import { combineReducers } from 'redux'
import { connectReducer } from './connect'
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
import { fvGalleryReducer } from './fvGallery'
import { fvLanguageReducer } from './fvLanguage'
import { fvLanguageFamilyReducer } from './fvLanguageFamily'
import { fvLinkReducer } from './fvLink'
import { fvPageReducer } from './fvPage'
import { fvPhraseReducer } from './fvPhrase'
import { fvPictureReducer } from './fvPicture'
import { fvPortalReducer } from './fvPortal'
import { fvResourcesReducer } from './fvResources'
import { fvUserReducer } from './fvUser'
import { fvVideoReducer } from './fvVideo'
import { fvWordReducer } from './fvWord'
import { navigationReducer } from './navigation'
import { reportsReducer } from './reports'
import { restReducer } from './rest'
import { searchReducer } from './search'
import { tasksReducer } from './tasks'
import { windowPathReducer } from './windowPath'

export default combineReducers({
  connect: connectReducer,
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
  fvGallery: fvGalleryReducer,
  fvLanguage: fvLanguageReducer,
  fvLanguageFamily: fvLanguageFamilyReducer,
  fvLink: fvLinkReducer,
  fvPage: fvPageReducer,
  fvPhrase: fvPhraseReducer,
  fvPicture: fvPictureReducer,
  fvPortal: fvPortalReducer,
  fvResources: fvResourcesReducer,
  fvUser: fvUserReducer,
  fvVideo: fvVideoReducer,
  fvWord: fvWordReducer,
  navigation: navigationReducer,
  reports: reportsReducer,
  rest: restReducer,
  search: searchReducer,
  tasks: tasksReducer,
  windowPath: windowPathReducer,
})
