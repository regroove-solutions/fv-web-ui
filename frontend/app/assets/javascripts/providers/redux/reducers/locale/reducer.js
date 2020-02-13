import {
  SET_LOCALE, FV_LABELS_FETCH_START,
  FV_LABELS_FETCH_SUCCESS,
  FV_LABELS_FETCH_ERROR,
  SET_WORKSPACE
} from './actionTypes'
import IntlService from '../../../../views/services/intl';
import en from 'views/../locale/locale.en.json'
import fr from 'views/../locale/locale.fr.json'
import sp from 'views/../locale/locale.sp.json'

const initialState = {
  localeLists: {
    en,
    fr,
    sp
  },
  intlService: new IntlService({
    en,
    fr,
    sp
  }, getLocaleFromStorage()),
  workspace: ""
}

function getLocaleFromStorage() {
  let locale;

  if (localStorage !== null && localStorage !== undefined) {
    if (localStorage.hasOwnProperty('intl-service-locale')) {
      locale = localStorage.getItem('intl-service-locale')
    }
  }
  if (locale === null) {
    if (navigator !== null && navigator !== undefined) {
      const ls = navigator.language
      if (ls[0] !== null && ls[0] !== undefined) {
        if (ls[0].search('en') >= 0) {
          locale = 'en'
        } else if (ls[1].search('fr') >= 0) {
          locale = 'fr'
        } else if (ls[1].search('sp') >= 0) {
          locale = 'sp'
        }
      }
    }
  }
  if (locale === null) {
    locale = 'en'
  }
  locale = "en";

  return locale;
}

export const localeReducer =
  (state = initialState, action) => {
    switch (action.type) {
      case SET_LOCALE:
        return Object.assign({}, state, { intlService: new IntlService(state.localeLists, action.payload, state.workspace) });
      case SET_WORKSPACE:
        console.log(action.payload);
        return Object.assign({}, state, { intlService: new IntlService(state.localeLists, state.intlService.locale, action.payload), workspace: action.payload });
      case FV_LABELS_FETCH_START:
        return { ...state, fvlabelsFetch: { isFetching: true } };
      case FV_LABELS_FETCH_SUCCESS:
        const newLocales = {
          ...state.localeLists
        };
        newLocales[action.payload.workspace] = action.payload.labels;
        return { ...state, workspace: action.payload.workspace, fvlabelsFetch: { isFetching: false, success: true }, intlService: new IntlService(newLocales, action.payload.locale, action.payload.workspace) };
      case FV_LABELS_FETCH_ERROR:
        return {
          ...state,
          fvlabelsFetch: {
            isFetching: false,
            isError: true,
            error: action.error,
            errorDismissed: false
          }
        }

      default:
        return state
    }
  }
