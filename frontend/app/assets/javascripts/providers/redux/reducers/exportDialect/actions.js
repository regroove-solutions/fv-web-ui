import selectn from 'selectn'

import {
  EXPORT_DIALECT_REQUEST,
  EXPORT_DIALECT_REQUEST_SUCCESS,
  EXPORT_DIALECT_PROGRESS,
  EXPORT_DIALECT_SUCCESS,
  EXPORT_DIALECT_ERROR,
} from './actionTypes'

import {
  EXPORT_DIALECT_SCHEME_HOST_URL,
  EXPORT_DIALECT_CHECK_PREVIOUS_URL,
  EXPORT_DIALECT_REQUEST_URL,
} from './constants'

// let EXPORT_DIALECT_PROGRESS_URL = '/nuxeo/site/automation/Document.GetExportProgress'
// TODO: TEMP, REMOVE. (FAKING BACKEND PROGRESS UPDATES)
let URLCOUNTER = 0
const EXPORT_DIALECT_PROGRESS_URLS = [
  '/nuxeo/site/automation/Document.GetExportProgress/1',
  '/nuxeo/site/automation/Document.GetExportProgress/2',
  '/nuxeo/site/automation/Document.GetExportProgress/3',
]
let EXPORT_DIALECT_PROGRESS_URL = '/nuxeo/site/automation/Document.GetExportProgress/1'
// TODO: TEMP, REMOVE

export const ExportDialectCheckPrevious = (dialectId) => {
  return (dispatch) => {
    const promiseRequest = new Promise((resolve, reject) => {
      Request(
        {
          url: `${EXPORT_DIALECT_SCHEME_HOST_URL}${EXPORT_DIALECT_CHECK_PREVIOUS_URL}`,
          method: 'POST',
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
        const _dialectExported = (body.entries || []).filter((existingExport) => {
          const exportedDialectId = selectn('properties.fvexport:dialect', existingExport)
          return exportedDialectId === dialectId
        })
        if (_dialectExported.length) {
          const dialectExported = _dialectExported[0]
          const documentUuid = dialectExported.uid
          const message = dialectExported.properties['fvexport:progressString']
          const percentage = dialectExported.properties['fvexport:progressValue']

          if (percentage === 100) {
            const file = body.properties['file:content']
            dispatch({
              type: EXPORT_DIALECT_SUCCESS,
              payload: {
                dialectId,
                documentUuid,
                message,
                percentage,
                ExportDialectFileName: file.name,
                ExportDialectFileUrl: file.data,
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
        }
      })
      .catch((error) => {
        dispatch({
          type: EXPORT_DIALECT_ERROR,
          payload: {
            error,
          },
        })
      })
    return promiseRequestResult
  }
}

export const ExportDialectRequest = (dialectId) => {
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
        dispatch({
          type: EXPORT_DIALECT_REQUEST_SUCCESS,
          payload: {
            dialectId,
            documentUuid: body.uid,
            message: body.properties['fvexport:progressString'],
            percentage: body.properties['fvexport:progressValue'],
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

export const ExportDialectProgress = (dialectId, documentUuid) => {
  return (dispatch) => {
    const reqBody = {
      input: documentUuid,
    }

    const promiseRequest = new Promise((resolve, reject) => {
      // TODO: TEMP, REMOVE WHEN INTEGRATED
      EXPORT_DIALECT_PROGRESS_URL = EXPORT_DIALECT_PROGRESS_URLS[URLCOUNTER]
      if (URLCOUNTER >= 2) {
        URLCOUNTER = 0
      } else {
        URLCOUNTER += 1
      }
      // TODO: TEMP, REMOVE WHEN INTEGRATED

      Request(
        {
          url: `${EXPORT_DIALECT_SCHEME_HOST_URL}${EXPORT_DIALECT_PROGRESS_URL}`,
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

    return promiseRequest
      .then((body) => {
        // Success
        const message = body.properties['fvexport:progressString']
        const percentage = body.properties['fvexport:progressValue']
        if (percentage === 100) {
          const file = body.properties['file:content']

          dispatch({
            type: EXPORT_DIALECT_SUCCESS,
            payload: {
              dialectId,
              message,
              percentage,
              ExportDialectFileName: file.name,
              ExportDialectFileUrl: file.data,
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
