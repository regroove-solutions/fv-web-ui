import {provide, unshiftMiddleware, createCombinedStore} from 'react-redux-provide';
import page, { PUSH_WINDOW_PATH, REPLACE_WINDOW_PATH } from 'provide-page';
import createLoggerMiddleware from 'redux-logger';

import FVLanguageFamily from './FVLanguageFamily';
import FVLanguage from './FVLanguage';
import FVDialect from './FVDialect';
import FVPortal from './FVPortal';
import FVWord from './FVWord';

import connect from './connect';
import navigation from './navigation';

const loggerMiddleware = createLoggerMiddleware();

// Enable log for specific provider
//unshiftMiddleware([FVDialect], loggerMiddleware);

//console.log(createCombinedStore({Editor, FVPortal}));

/**
* These providers will be exposed to each componenet that has the @provide decorator,
* thus exposing their actions and reducers.
*/
export default {
  page,
  connect,
  navigation,
  FVLanguageFamily,
  FVLanguage,
  FVDialect,
  FVPortal,
  FVWord
};
