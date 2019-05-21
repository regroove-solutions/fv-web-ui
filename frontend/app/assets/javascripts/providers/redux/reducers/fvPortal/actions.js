import RESTActions from 'providers/rest-actions'
import DirectoryOperations from 'operations/DirectoryOperations'

import { FV_FETCH_PORTALS_START, FV_FETCH_PORTALS_FETCH_SUCCESS, FV_FETCH_PORTALS_FETCH_ERROR } from './actionTypes'

export const updatePortal = RESTActions.update('FV_PORTAL', 'FVPortal', {
  headers: { 'enrichers.document': 'ancestry,portal' },
})
export const publishPortal = RESTActions.execute('FV_PORTAL_PUBLISH', 'FVPublish', {
  headers: { 'enrichers.document': 'ancestry,portal' },
})
export const unpublishPortal = RESTActions.execute('FV_PORTAL_UNPUBLISH', 'FVUnpublishDialect', {
  headers: { 'enrichers.document': 'ancestry,portal' },
})
export const fetchPortal = RESTActions.fetch('FV_PORTAL', 'FVPortal', {
  headers: { 'enrichers.document': 'ancestry,portal' },
})
// export const fetchPortals = RESTActions.query("FV_PORTALS", "FVPortal", {
//   page_provider: "get_dialects",
//   headers: { "enrichers.document": "ancestry,portal", "properties": "" },
// })

export const fetchPortals = function fetchPortals(pageProvider, headers = {}, params = {}) {
  return (dispatch) => {
    dispatch({ type: FV_FETCH_PORTALS_START })

    return DirectoryOperations.getDocumentsViaPageProvider(pageProvider, 'FVPortal', headers, params)
      .then((response) => {
        dispatch({ type: FV_FETCH_PORTALS_FETCH_SUCCESS, documents: response })
      })
      .catch((error) => {
        dispatch({ type: FV_FETCH_PORTALS_FETCH_ERROR, error: error })
      })
  }
}
