// Middleware
import thunk from 'redux-thunk'
import Request from 'request'

// Constants
// TODO: CHANGE TO BACKEND ADDRESS
const EXPORT_DIALECT_HOST_ROOT = 'localhost'
const EXPORT_DIALECT_HOST_PORT = '8081'
// TODO: CHANGE TO BACKEND ADDRESS
const EXPORT_DIALECT_SCHEME_HOST_URL = `http://${EXPORT_DIALECT_HOST_ROOT}${
  EXPORT_DIALECT_HOST_PORT ? `:${EXPORT_DIALECT_HOST_PORT}` : ''
}` // TODO: USE HTTPS

const EXPORT_DIALECT_REQUEST_URL = '/api/automation/Document.FVGenerateDocumentWithFormat'

// TODO: TEMP
let URLCOUNTER = 0
const EXPORT_DIALECT_PROGRESS_URLS = [
  '/api/automation/TodoResponse1',
  '/api/automation/TodoResponse2',
  '/api/automation/TodoResponse3',
]
let EXPORT_DIALECT_PROGRESS_URL = '/api/automation/TodoResponse1' // TODO: FIX
// TODO: TEMP

const EXPORT_DIALECT_DOWNLOAD_URL = '/api/automation/Document.GetFormattedDocument'

const NOT_STARTED = 'NOT_STARTED'
const STARTED = 'STARTED'
const IN_PROGRESS = 'IN_PROGRESS'
const IN_PROGRESS_SUCCESS = 'IN_PROGRESS_SUCCESS'
const SUCCESS = 'SUCCESS'
const ERROR = 'ERROR'

const initialState = {
  dialectIdDocumentUuid: {},
  dialectIdLifecycle: {},
  dialectIdData: {},
  CONSTANTS: {
    NOT_STARTED,
    IN_PROGRESS,
    IN_PROGRESS_SUCCESS,
    SUCCESS,
    ERROR,
  },
}

// Actions
const EXPORT_DIALECT_REQUEST = 'EXPORT_DIALECT_REQUEST'
const EXPORT_DIALECT_REQUEST_SUCCESS = 'EXPORT_DIALECT_REQUEST_SUCCESS'
const EXPORT_DIALECT_PROGRESS = 'EXPORT_DIALECT_PROGRESS'
const EXPORT_DIALECT_PROGRESS_SUCCESS = 'EXPORT_DIALECT_PROGRESS_SUCCESS'
const EXPORT_DIALECT_SUCCESS = 'EXPORT_DIALECT_SUCCESS'
const EXPORT_DIALECT_ERROR = 'EXPORT_DIALECT_ERROR'
const ExportDialectRequest = function ExportDialectRequest(dialectId) {
  return (dispatch) => {
    dispatch({
      type: EXPORT_DIALECT_REQUEST,
      payload: {
        dialectId,
      },
    })
    const reqBody = {
      input: dialectId,
      params: {
        columns: '*',
        format: 'CSV',
        query: '*',
      },
    }
    const promiseRequest = new Promise((resolve, reject) => {
      Request(
        {
          url: `${EXPORT_DIALECT_SCHEME_HOST_URL}${EXPORT_DIALECT_REQUEST_URL}`,
          method: 'POST',
          body: reqBody,
          json: true,
        },
        (error, response, body) => {
          if (response && response.statusCode === 204) {
            resolve(response)
          } else {
            reject(error)
          }
        }
      )
    })
    const promiseRequestResult = promiseRequest
      .then((response) => {
        // Success
        console.log('ExportDialectRequest', response)

        // TODO: SAVE REAL documentUuid
        const _response = { documentUuid: dialectId }
        const { documentUuid } = _response
        // TODO: SAVE REAL documentUuid

        dispatch({
          type: EXPORT_DIALECT_REQUEST_SUCCESS,
          payload: {
            dialectId,
            documentUuid,
          },
        })
      })
      .catch((error) => {
        console.log('ExportDialectRequest error', error)
        dispatch({
          type: EXPORT_DIALECT_ERROR,
          payload: {
            dialectId,
            error,
          },
        })
      })
    return promiseRequestResult
  }
}

const ExportDialectProgress = function ExportDialectProgress(dialectId, documentUuid) {
  return (dispatch) => {
    console.log('ExportDialectProgress', { dialectId, documentUuid })
    // TODO: Need to verify params to send
    const reqBody = {
      input: documentUuid,
      params: {
        columns: '*',
        format: 'CSV',
        query: '*',
      },
    }

    const promiseRequest = new Promise((resolve, reject) => {
      // TODO: TEMP
      EXPORT_DIALECT_PROGRESS_URL = EXPORT_DIALECT_PROGRESS_URLS[URLCOUNTER]
      if (URLCOUNTER >= 2) {
        URLCOUNTER = 0
      } else {
        URLCOUNTER += 1
      }
      // TODO: TEMP

      Request(
        {
          url: `${EXPORT_DIALECT_SCHEME_HOST_URL}${EXPORT_DIALECT_PROGRESS_URL}`,
          method: 'POST',
          body: reqBody,
          json: true,
        },
        (error, response, body) => {
          // TODO: CONFIRM STATUS CODE
          if (response && response.statusCode === 200) {
            resolve(response)
          } else {
            reject(error)
          }
        }
      )
    })

    return promiseRequest
      .then((response) => {
        // Success
        // TODO: SAVE REAL DATA
        // const _response = { message: 'Processing...', percentage: '0' }
        const { message, percentage } = response.body
        // TODO: SAVE REAL DATA
        if (percentage === 100) {
          dispatch({
            type: EXPORT_DIALECT_PROGRESS_SUCCESS,
            payload: {
              dialectId,
              message,
              percentage,
            },
          })
        } else {
          dispatch({
            type: EXPORT_DIALECT_PROGRESS,
            payload: {
              dialectId,
              message,
              percentage,
            },
          })
        }
      })
      .catch((error) => {
        console.log('ExportDialectProgress error', error)
        // Error
        dispatch({
          type: EXPORT_DIALECT_ERROR,
          payload: {
            dialectId,
            documentUuid,
            error,
          },
        })
        // return error
      })
  }
}

const ExportDialectDownload = function ExportDialectDownload(dialectId) {
  return (dispatch) => {
    const reqBody = {
      input: dialectId,
      params: {
        columns: '*',
        format: 'CSV',
        query: '*',
      },
    }
    const promiseRequest = new Promise((resolve, reject) => {
      Request(
        {
          url: `${EXPORT_DIALECT_SCHEME_HOST_URL}${EXPORT_DIALECT_DOWNLOAD_URL}`,
          method: 'POST',
          body: reqBody,
          json: true,
        },
        (error, response, body) => {
          if (response && response.statusCode === 200) {
            resolve(body)
          } else {
            reject(error)
          }
        }
      )
    })
    const promiseRequestResult = promiseRequest
      .then((body) => {
        // Success

        // TODO: SAVE REAL documentUuid
        // const _response = { documentUuid: dialectId }
        // const { documentUuid } = _response
        // TODO: SAVE REAL documentUuid

        dispatch({
          type: EXPORT_DIALECT_SUCCESS,
          payload: {
            dialectId,
            entityType: body['entity-type'],
            entries: body.entries,
          },
        })
      })
      .catch((error) => {
        console.log('ExportDialectDownload error', error)
        dispatch({
          type: EXPORT_DIALECT_ERROR,
          payload: {
            dialectId,
            error,
          },
        })
      })
    return promiseRequestResult
  }
}

// Reducer
// =================================
const ExportDialectReducer = function ExportDialectReducer(state = initialState, action) {
  // grab current state
  const newState = Object.assign({}, state)

  const { payload } = action
  switch (action.type) {
    case EXPORT_DIALECT_REQUEST: {
      const { dialectId } = payload
      // Set dialectIdLifecycle state
      newState.dialectIdLifecycle[dialectId] = STARTED
      return newState
    }

    case EXPORT_DIALECT_REQUEST_SUCCESS: {
      const { dialectId, documentUuid } = payload

      // Save documentUuid in dialectIdDocumentUuid = {}
      // For easy lookup when a component unloads and reloads in the same session
      newState.dialectIdDocumentUuid[dialectId] = documentUuid

      // Set dialectIdLifecycle state
      newState.dialectIdLifecycle[dialectId] = IN_PROGRESS

      newState.dialectIdData[dialectId] = {
        message: '',
        percentage: 0,
      }

      return newState
    }

    case EXPORT_DIALECT_PROGRESS: {
      // Send progress report
      const { dialectId, message = 'EXPORT_DIALECT_PROGRESS', percentage = -1 } = payload

      // Set dialectIdLifecycle state
      newState.dialectIdLifecycle[dialectId] = IN_PROGRESS

      newState.dialectIdData[dialectId] = {
        message,
        percentage,
      }

      return newState
    }

    case EXPORT_DIALECT_PROGRESS_SUCCESS: {
      // Send progress report
      const { dialectId, message, percentage } = payload
      // Set dialectIdLifecycle state
      newState.dialectIdLifecycle[dialectId] = IN_PROGRESS_SUCCESS

      newState.dialectIdData[dialectId] = {
        message,
        percentage,
      }

      return newState
    }

    case EXPORT_DIALECT_ERROR: {
      const { dialectId, error } = payload
      // Notify user
      newState.dialectIdLifecycle[dialectId] = ERROR
      newState.dialectIdData[dialectId] = {
        message: 'We encountered a problem trying to create the document. Please try again later',
        error,
      }
      return newState
    }

    case EXPORT_DIALECT_SUCCESS: {
      const { dialectId, entityType, entries } = payload
      newState.dialectIdLifecycle[dialectId] = SUCCESS

      // TODO: USE REAL DATA
      const ExportDialectEntityType = entityType
      const ExportDialectEntries = entries
      // TODO: USE REAL DATA

      // Save data
      newState.dialectIdData[dialectId] = Object.assign({}, newState.dialectIdData[dialectId], {
        ExportDialectEntityType,
        ExportDialectEntries,
      })
      return newState
    }

    default:
      return newState
  }
}

const actions = { ExportDialectRequest, ExportDialectProgress, ExportDialectDownload }
const reducers = { ExportDialectReducer }
const middleware = [thunk]

export default { actions, reducers, middleware }
