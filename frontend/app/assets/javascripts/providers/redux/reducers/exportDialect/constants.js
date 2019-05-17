// Constants
// TODO: CHANGE TO BACKEND ADDRESS
export const EXPORT_DIALECT_HOST_ROOT = 'localhost'
export const EXPORT_DIALECT_HOST_PORT = '8081' // ''
// TODO: CHANGE TO BACKEND ADDRESS

// TODO: USE HTTPS
export const EXPORT_DIALECT_SCHEME_HOST_URL = `http://${EXPORT_DIALECT_HOST_ROOT}${
  EXPORT_DIALECT_HOST_PORT ? `:${EXPORT_DIALECT_HOST_PORT}` : ''
}`
// TODO: USE HTTPS

export const EXPORT_DIALECT_CHECK_PREVIOUS_URL = '/automation/Document.GetFormattedDocument' // TODO: endpoint may change to plural
export const EXPORT_DIALECT_REQUEST_URL = '/automation/Document.FVGenerateDocumentWithFormat'

export const NOT_STARTED = 'NOT_STARTED'
export const STARTED = 'STARTED'
export const IN_PROGRESS = 'IN_PROGRESS'
export const SUCCESS = 'SUCCESS'
export const ERROR = 'ERROR'
