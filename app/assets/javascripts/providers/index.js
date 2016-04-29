import {provide, unshiftMiddleware, createCombinedStore} from 'react-redux-provide';
import page, { PUSH_WINDOW_PATH, REPLACE_WINDOW_PATH } from 'provide-page';
import createLoggerMiddleware from 'redux-logger';

import Document from './Document';
import Directory from './Directory';
import FVLanguageFamily from './FVLanguageFamily';
import FVLanguage from './FVLanguage';
import FVDialect from './FVDialect';
import FVPortal from './FVPortal';
import FVWord from './FVWord';
import FVPhrase from './FVPhrase';
import FVBook from './FVBook';
import FVContributor from './FVContributor';
import FVCategory from './FVCategory';
import FVAudio from './FVAudio';
import FVPicture from './FVPicture';
import FVVideo from './FVVideo';
import FVCharacter from './FVCharacter';
import FVGallery from './FVGallery';

import connect from './connect';
import navigation from './navigation'
import reports from './reports';
import search from './search';

const loggerMiddleware = createLoggerMiddleware();

// Enable log for specific provider
//unshiftMiddleware([connect], loggerMiddleware);

//console.log(createCombinedStore({Editor, FVPortal}));

/**
* These providers will be exposed to each componenet that has the @provide decorator,
* thus exposing their actions and reducers.
*/
export default {
  page,
  connect,
  navigation,
  Document,
  Directory,
  FVLanguageFamily,
  FVLanguage,
  FVDialect,
  FVPortal,
  FVAudio,
  FVVideo,
  FVPicture,
  FVWord,
  FVPhrase,
  FVBook,
  FVCategory,
  FVContributor,
  FVCharacter,
  FVGallery,
  reports,
  search
};
