import RESTActions from 'providers/rest-actions'
import DirectoryOperations from 'operations/DirectoryOperations'
// console.log('! fvContributor', { RESTActions, DirectoryOperations }) // eslint-disable-line

import {
  FV_CONTRIBUTORS_FETCH_START,
  FV_CONTRIBUTORS_FETCH_SUCCESS,
  FV_CONTRIBUTORS_FETCH_ERROR,
  FV_CONTRIBUTORS_SHARED_FETCH_START,
  FV_CONTRIBUTORS_SHARED_FETCH_SUCCESS,
  FV_CONTRIBUTORS_SHARED_FETCH_ERROR,
  FV_CONTRIBUTOR_FETCH_ALL_START,
  FV_CONTRIBUTOR_FETCH_ALL_SUCCESS,
  FV_CONTRIBUTOR_FETCH_ALL_ERROR,
} from './actionTypes'

export const fetchSharedContributors = function fetchSharedContributors(pageProvider, headers = {}, params = {}) {
  return (dispatch) => {
    dispatch({ type: FV_CONTRIBUTORS_SHARED_FETCH_START })

    return DirectoryOperations.getDocumentsViaPageProvider(pageProvider, 'FVContributor', headers, params)
      .then((response) => {
        dispatch({ type: FV_CONTRIBUTORS_SHARED_FETCH_SUCCESS, documents: response })
      })
      .catch((error) => {
        dispatch({ type: FV_CONTRIBUTORS_SHARED_FETCH_ERROR, error: error })
      })
  }
}

export const fetchContributorsAll = function fetchContributorsAll(path /*, type*/) {
  return (dispatch) => {
    dispatch({ type: FV_CONTRIBUTOR_FETCH_ALL_START })

    return DirectoryOperations.getDocuments(path, 'FVContributor', '', {
      headers: { 'enrichers.document': 'ancestry' },
    })
      .then((response) => {
        dispatch({ type: FV_CONTRIBUTOR_FETCH_ALL_SUCCESS, documents: response })
      })
      .catch((error) => {
        dispatch({ type: FV_CONTRIBUTOR_FETCH_ALL_ERROR, error: error })
      })
  }
}

export const fetchContributorsInPath = function fetchContributorsInPath(path, queryAppend, headers = {}, params = {}) {
  return (dispatch) => {
    dispatch({ type: FV_CONTRIBUTORS_FETCH_START })

    return DirectoryOperations.getDocuments(path, 'FVContributor', queryAppend, headers, params)
      .then((response) => {
        dispatch({ type: FV_CONTRIBUTORS_FETCH_SUCCESS, documents: response })
      })
      .catch((error) => {
        dispatch({ type: FV_CONTRIBUTORS_FETCH_ERROR, error: error })
      })
  }
}
/*
export const fetchContributor = function fetchContributor(pathOrId) {
  return (dispatch) => {

    let contributors = {};
    contributors[pathOrId] = {};

    dispatch( { type: FV_CONTRIBUTOR_FETCH_START, contributors: contributors, pathOrId: pathOrId } );

    return DocumentOperations.getDocument(pathOrId, 'FVContributor', { headers: { 'enrichers.document': 'ancestry' } })
    .then((response) => {

      contributors[pathOrId] = { response: response };

      dispatch( { type: FV_CONTRIBUTOR_FETCH_SUCCESS, contributors: contributors, pathOrId: pathOrId } )
    }).catch((error) => {

        contributors[pathOrId] = { error: error };

        dispatch( { type: FV_CONTRIBUTOR_FETCH_ERROR, contributors: contributors, pathOrId: pathOrId } )
    });
  }
};
*/

export const fetchContributor = RESTActions.fetch('FV_CONTRIBUTOR', 'FVContributor', {
  headers: { 'enrichers.document': 'ancestry' },
})
export const fetchContributors = RESTActions.query('FV_CONTRIBUTORS', 'FVContributor', {
  headers: { 'enrichers.document': 'ancestry' },
})
export const createContributor = RESTActions.create('FV_CONTRIBUTOR', 'FVContributor')
export const updateContributor = RESTActions.update(
  'FV_CONTRIBUTOR',
  'FVContributor',
  { headers: { 'enrichers.document': 'ancestry' } },
  false
)
