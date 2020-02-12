import { SET_LOCALE } from "./actionTypes"

export const setLocale = (locale = "") => {
  return (dispatch) => {
    dispatch({ type: SET_LOCALE, payload: locale })
  }
}