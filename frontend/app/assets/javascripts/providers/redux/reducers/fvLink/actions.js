import RESTActions from 'providers/rest-actions'
import DirectoryOperations from 'operations/DirectoryOperations'

import { FV_LINKS_SHARED_FETCH_START, FV_LINKS_SHARED_FETCH_SUCCESS, FV_LINKS_SHARED_FETCH_ERROR } from './actionTypes'

export const fetchSharedLinks = function fetchSharedLinks(pageProvider, headers = {}, params = {}) {
  return (dispatch) => {
    dispatch({ type: FV_LINKS_SHARED_FETCH_START })

    return DirectoryOperations.getDocumentsViaPageProvider(pageProvider, 'FVLink', headers, params)
      .then((response) => {
        dispatch({ type: FV_LINKS_SHARED_FETCH_SUCCESS, documents: response })
      })
      .catch((error) => {
        dispatch({ type: FV_LINKS_SHARED_FETCH_ERROR, error: error })
      })
  }
}

export const fetchLink = RESTActions.fetch('FV_LINK', 'FVLink', {
  headers: { 'enrichers.document': 'ancestry, breadcrumb' },
})

export const fetchLinks = RESTActions.query('FV_LINKS', 'FVLink', { headers: { 'enrichers.document': 'ancestry' } })

export const createLink = RESTActions.create('FV_LINK', 'FVLink')

export const updateLink = RESTActions.update(
  'FV_LINK',
  'FVLink',
  { headers: { 'enrichers.document': 'ancestry,permissions' } },
  false
)
