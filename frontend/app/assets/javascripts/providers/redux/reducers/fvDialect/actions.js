import RESTActions from 'providers/restActions'
import DocumentOperations from 'operations/DocumentOperations'
console.log('! fvDialect:', { RESTActions, DocumentOperations }) // eslint-disable-line
import { FV_DIALECT_FETCH_START, FV_DIALECT_FETCH_SUCCESS, FV_DIALECT_FETCH_ERROR } from './actionTypes'

export const fetchDialect = (pathOrId) => {
  return (dispatch) => {
    dispatch({ type: FV_DIALECT_FETCH_START })

    return DocumentOperations.getDocument(pathOrId, 'FVDialect', {
      headers: { 'enrichers.document': 'ancestry,dialect,permissions,acls' },
    })
      .then((response) => {
        dispatch({ type: FV_DIALECT_FETCH_SUCCESS, document: response })
      })
      .catch((error) => {
        dispatch({ type: FV_DIALECT_FETCH_ERROR, error: error })
      })
  }
}

export const updateDialect2 = RESTActions.update('FV_DIALECT2', 'FVDialect', {
  headers: { 'enrichers.document': 'ancestry,dialect,permissions,acls' },
})

export const fetchDialect2 = RESTActions.fetch('FV_DIALECT2', 'FVDialect', {
  headers: { 'enrichers.document': 'ancestry,dialect,permissions,acls' },
})

export const queryDialect2ByShortURL = RESTActions.query('FV_DIALECT2_SHORTURL', 'FVDialect', {})

export const fetchDialectStats = RESTActions.execute('FV_DIALECT_STATS', 'FVGenerateJsonStatistics', {})

export const fetchDialects = RESTActions.query('FV_DIALECTS', 'FVDialect', {
  headers: { 'enrichers.document': 'ancestry,dialect' },
})

export const fetchDialectList = RESTActions.execute('FV_DIALECT_LIST', 'Document.ListDialects', {})

export const publishDialect = RESTActions.execute('FV_DIALECT2_PUBLISH', 'FVPublish', {
  headers: { 'enrichers.document': 'ancestry,dialect,permissions,acls' },
})

export const publishDialectOnly = RESTActions.execute('FV_DIALECT2_PUBLISH', 'Document.PublishToSection', {
  headers: { 'enrichers.document': 'ancestry,dialect,permissions,acls' },
})

export const unpublishDialect = RESTActions.execute('FV_DIALECT2_UNPUBLISH', 'FVUnpublishDialect', {
  headers: { 'enrichers.document': 'ancestry,dialect,permissions,acls' },
})

export const enableDialect = RESTActions.execute('FV_DIALECT2_ENABLE', 'FVEnableDocument', {
  headers: { 'enrichers.document': 'ancestry,dialect,permissions,acls' },
})

export const disableDialect = RESTActions.execute('FV_DIALECT2_DISABLE', 'FVDisableDocument', {
  headers: { 'enrichers.document': 'ancestry,dialect,permissions,acls' },
})
