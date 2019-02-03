// Middleware
import thunk from 'redux-thunk'
import Request from 'request'

// Constants
export const EXPORT_DIALECT_HOST_ROOT = '589e1e31-7e3a-4342-b802-699c32bc252d.mock.pstmn.io'
export const EXPORT_DIALECT_HOST_PORT = ''
export const EXPORT_DIALECT_SCHEME_HOST_URL = `https://${EXPORT_DIALECT_HOST_ROOT}${EXPORT_DIALECT_HOST_PORT}`

export const EXPORT_DIALECT_REQUEST_URL = '/api/automation/Document.FVGenerateDocumentWithFormat'
export const EXPORT_DIALECT_PROGRESS_URL = '/api/automation/TBD'
export const EXPORT_DIALECT_DOWNLOAD_URL = '/api/automation/Document.GetFormattedDocument'

const NOT_STARTED = 'NOT_STARTED'
const STARTED = 'STARTED'
const IN_PROGRESS = 'IN_PROGRESS'
const SUCCESS = 'SUCCESS'
const ERROR = 'ERROR'

const initialState = {
  dialectIdDocumentUuid: {},
  dialectIdLifecycle: {},
  dialectIdData: {},
  CONSTANTS: {
    NOT_STARTED,
    IN_PROGRESS,
    SUCCESS,
    ERROR,
  },
}

// Actions
const EXPORT_DIALECT_REQUEST = 'EXPORT_DIALECT_REQUEST'
const EXPORT_DIALECT_REQUEST_SUCCESS = 'EXPORT_DIALECT_REQUEST_SUCCESS'
const EXPORT_DIALECT_PROGRESS = 'EXPORT_DIALECT_PROGRESS'
const EXPORT_DIALECT_SUCCESS = 'EXPORT_DIALECT_SUCCESS'
const EXPORT_DIALECT_ERROR = 'EXPORT_DIALECT_ERROR'

const ExportDialectRequest = function ExportDialectRequest(dialectId, overrideExportDialectSchemeHostUrl) {
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
          url: `${overrideExportDialectSchemeHostUrl || EXPORT_DIALECT_SCHEME_HOST_URL}${EXPORT_DIALECT_REQUEST_URL}`,
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

const ExportDialectProgress = function ExportDialectProgress(
  dialectId,
  documentUuid,
  overrideExportDialectSchemeHostUrl
) {
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
      Request(
        {
          url: `${overrideExportDialectSchemeHostUrl || EXPORT_DIALECT_SCHEME_HOST_URL}${EXPORT_DIALECT_PROGRESS_URL}`,
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

    return promiseRequest
      .then((response) => {
        // Success
        console.log('ExportDialectProgress Success')
        // TODO: SAVE REAL DATA
        const _response = { message: 'Processing...', percentage: '0' }
        const { message, percentage } = _response
        // TODO: SAVE REAL DATA

        dispatch({
          type: EXPORT_DIALECT_PROGRESS,
          payload: {
            dialectId,
            message,
            percentage,
          },
        })
      })
      .catch((error) => {
        // Error
        console.log('ExportDialectProgress ERROR')
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

// Reducers
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

      return newState
    }

    case EXPORT_DIALECT_PROGRESS: {
      // Send progress report
      const { dialectId, message = 'EXPORT_DIALECT_PROGRESS', percentage = -1 } = payload

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
      const { dialectId } = payload
      newState.dialectIdLifecycle[dialectId] = SUCCESS
      // Save data
      newState.dialectIdData[dialectId] = Object.assign({}, newState.dialectIdData[dialectId], {
        // TODO: save document details
      })
      return newState
    }

    default:
      return newState
  }
}

const actions = { ExportDialectRequest, ExportDialectProgress }
const reducers = { ExportDialectReducer }
const middleware = [thunk]

export default { actions, reducers, middleware }
