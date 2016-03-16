import page, { PUSH_WINDOW_PATH, REPLACE_WINDOW_PATH } from 'provide-page';
import settings from './settings';

/**
* These providers will be exposed to each componenet that has the @provide decorator,
* thus exposing their actions and reducers.
*/
export default {
  page,
  settings
};