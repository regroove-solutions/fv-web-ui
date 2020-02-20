import BaseOperations from 'operations/BaseOperations'
import UserOperations from 'operations/UserOperations'
import { setImmersionMode } from './../locale/actions'

import { CONNECT, GET_CURRENT_USER_START, GET_CURRENT_USER_SUCCESS, GET_CURRENT_USER_ERROR } from './actionTypes'

/**
 * Actions: Represent that something happened
 */
export const nuxeoConnect = () => {
  return async(dispatch) => {
    // console.log('! nuxeoConnect 1')
    await BaseOperations.initClient()
    // console.log('! nuxeoConnect 2')
    const properties = await BaseOperations.getProperties()
    // console.log('! nuxeoConnect 3')
    dispatch({ type: CONNECT, client: properties.client })
  }
}

export const getCurrentUser = () => {
  return (dispatch, state) => {
    dispatch({ type: GET_CURRENT_USER_START })

    return UserOperations.getCurrentUser()
      .then((response) => {
        dispatch({ type: GET_CURRENT_USER_SUCCESS, user: response, isAnonymous: response.isAnonymous })
        setImmersionMode(parseInt(response.properties.languagePreference, 10) || 0)(dispatch, state)
      })
      .catch((error) => {
        dispatch({ type: GET_CURRENT_USER_ERROR, error: error })
      })
  }
}

export const updateCurrentUser = (languagePreference = 0) => {
  return (dispatch) => {
    dispatch({ type: GET_CURRENT_USER_START })
    return UserOperations.fvUpdateUser('lworkman', languagePreference.toString()).then(() => {
      return UserOperations.getCurrentUser()
        .then((response) => {
          dispatch({ type: GET_CURRENT_USER_SUCCESS, user: response, isAnonymous: response.isAnonymous })
        })
        .catch((error) => {
          dispatch({ type: GET_CURRENT_USER_ERROR, error: error })
        })
    })
  }
}
