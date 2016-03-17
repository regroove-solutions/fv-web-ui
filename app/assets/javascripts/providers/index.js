import page, { PUSH_WINDOW_PATH, REPLACE_WINDOW_PATH } from 'provide-page';
import document from './document';
import directory from './directory';
import connect from './connect';
import navigation from './navigation';

/**
* These providers will be exposed to each componenet that has the @provide decorator,
* thus exposing their actions and reducers.
*/
export default {
  page,
  document,
  directory,
  connect,
  navigation
};
