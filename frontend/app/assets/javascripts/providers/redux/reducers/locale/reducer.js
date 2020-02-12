import { SET_LOCALE } from './actionTypes'

const initialState = {
  locale: getLocaleFromStorage()
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
  locale = "immersive";

  return locale;
}

export const localeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOCALE: {
      // Update state
      // ------------------------------------------------------------
      return Object.assign({}, state, { locale: action.payload })
    }

    default:
      return state
  }
}
