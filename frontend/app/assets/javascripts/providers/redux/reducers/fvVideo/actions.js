import RESTActions from 'providers/rest-actions'
import DocumentOperations from 'operations/DocumentOperations'
import DirectoryOperations from 'operations/DirectoryOperations'

import {
  FV_VIDEOS_SHARED_FETCH_START,
  FV_VIDEOS_SHARED_FETCH_SUCCESS,
  FV_VIDEOS_SHARED_FETCH_ERROR,
  FV_VIDEO_FETCH_STATS_START,
  FV_VIDEO_FETCH_STATS_SUCCESS,
  FV_VIDEO_FETCH_STATS_ERROR,
  FV_VIDEO_UPDATE_START,
  FV_VIDEO_UPDATE_SUCCESS,
  FV_VIDEO_UPDATE_ERROR,
} from './actionTypes'

/*
export const createVideo = function createVideo(parentDoc, docParams, file) {
  return (dispatch) => {

    dispatch( { type: FV_VIDEO_CREATE_START, document: docParams } );

    return DocumentOperations.createDocumentWithBlob(parentDoc, docParams, file)
      .then((response) => {
        dispatch( { type: FV_VIDEO_CREATE_SUCCESS, document: response} );
      }).catch((error) => {
          dispatch( { type: FV_VIDEO_CREATE_ERROR, error: error } )
    });
  }
};*/

export const updateVideo = function updateVideo(newDoc /*, field*/) {
  return (dispatch) => {
    const videos = {}
    videos[newDoc.id] = {}

    dispatch({ type: FV_VIDEO_UPDATE_START, videos: videos, pathOrId: newDoc.id })

    return DocumentOperations.updateDocument(newDoc)
      .then((response) => {
        videos[newDoc.id] = { response: response }

        dispatch({ type: FV_VIDEO_UPDATE_SUCCESS, videos: videos, pathOrId: newDoc.id })
      })
      .catch((error) => {
        videos[newDoc.id] = { error: error }

        dispatch({ type: FV_VIDEO_UPDATE_ERROR, videos: videos, pathOrId: newDoc.id })
      })
  }
}

export const fetchSharedVideos = function fetchSharedVideos(pageProvider, headers = {}, params = {}) {
  return (dispatch) => {
    dispatch({ type: FV_VIDEOS_SHARED_FETCH_START })

    return DirectoryOperations.getDocumentsViaPageProvider(pageProvider, 'FVVideo', headers, params)
      .then((response) => {
        dispatch({ type: FV_VIDEOS_SHARED_FETCH_SUCCESS, documents: response })
      })
      .catch((error) => {
        dispatch({ type: FV_VIDEOS_SHARED_FETCH_ERROR, error: error })
      })
  }
}

/*
export const fetchVideoAndStats = function fetchVideoWithStats(path) {
	  return dispatch => Promise.all([
	    dispatch(fetchVideo(path)),
        dispatch(fetchVideoStats())
      ]);
}
export const fetchVideo = function fetchVideo(pathOrId) {
  return (dispatch) => {

    let videos = {};
    videos[pathOrId] = {};

    dispatch( { type: FV_VIDEO_FETCH_START, videos: videos, pathOrId: pathOrId } );

    return DocumentOperations.getDocument(pathOrId, 'FVVideo', { headers: { 'enrichers.document': 'ancestry' } })
    .then((response) => {

      videos[pathOrId] = { response: response };

      dispatch( { type: FV_VIDEO_FETCH_SUCCESS, videos: videos, pathOrId: pathOrId } )
    }).catch((error) => {

        videos[pathOrId] = { error: error };

        dispatch( { type: FV_VIDEO_FETCH_ERROR, videos: videos, pathOrId: pathOrId } )
    });
  }
};
*/

export const fetchVideoStats = function fetchVideoStats(dialectId) {
  return (dispatch) => {
    dispatch({ type: FV_VIDEO_FETCH_STATS_START })

    return DocumentOperations.getVideoStats(dialectId)
      .then((response) => {
        dispatch({ type: FV_VIDEO_FETCH_STATS_SUCCESS, document: response })
      })
      .catch((error) => {
        dispatch({ type: FV_VIDEO_FETCH_STATS_ERROR, error: error })
      })
  }
}

export const fetchVideo = RESTActions.fetch('FV_VIDEO', 'FVVideo', {
  headers: { 'enrichers.document': 'ancestry, media' },
})

export const createVideo = RESTActions.create('FV_VIDEO', 'FVVideo')
