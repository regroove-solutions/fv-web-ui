import {
  EXPORT_DIALECT_REQUEST,
  EXPORT_DIALECT_REQUEST_SUCCESS,
  EXPORT_DIALECT_PROGRESS,
  EXPORT_DIALECT_SUCCESS,
  EXPORT_DIALECT_ERROR,
} from './actionTypes'

import { NOT_STARTED, STARTED, IN_PROGRESS, SUCCESS, ERROR } from './constants'

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

export const exportDialectReducer = (state = initialState, action) => {
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
      const { dialectId, documentUuid, message, percentage } = payload

      // Save documentUuid in dialectIdDocumentUuid = {}
      // For easy lookup when a component unloads and reloads in the same session
      newState.dialectIdDocumentUuid[dialectId] = documentUuid

      // Set dialectIdLifecycle state
      newState.dialectIdLifecycle[dialectId] = IN_PROGRESS

      newState.dialectIdData[dialectId] = {
        message,
        percentage,
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

    case EXPORT_DIALECT_SUCCESS: {
      // Send progress report
      const { dialectId, message, percentage, ExportDialectFileName, ExportDialectFileUrl } = payload
      // Set dialectIdLifecycle state
      newState.dialectIdLifecycle[dialectId] = SUCCESS

      newState.dialectIdData[dialectId] = {
        message,
        percentage,
        ExportDialectFileName,
        ExportDialectFileUrl,
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

    default:
      return newState
  }
}
