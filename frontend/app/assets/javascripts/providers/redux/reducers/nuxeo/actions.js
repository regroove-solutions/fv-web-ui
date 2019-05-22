import BaseOperations from 'operations/BaseOperations'
import UserOperations from 'operations/UserOperations'

import { CONNECT, GET_CURRENT_USER_START, GET_CURRENT_USER_SUCCESS, GET_CURRENT_USER_ERROR } from './actionTypes'

/**
 * Actions: Represent that something happened
 */
export const connect = () => {
  return (dispatch) => {
    BaseOperations.initClient()
    dispatch({ type: CONNECT })
  }
}

export const getCurrentUser = () => {
  return (dispatch) => {
    dispatch({ type: GET_CURRENT_USER_START })

    return UserOperations.getCurrentUser()
      .then((response) => {
        dispatch({ type: GET_CURRENT_USER_SUCCESS, user: response, isAnonymous: response.isAnonymous })
      })
      .catch((error) => {
        dispatch({ type: GET_CURRENT_USER_ERROR, error: error })
      })
  }
}
