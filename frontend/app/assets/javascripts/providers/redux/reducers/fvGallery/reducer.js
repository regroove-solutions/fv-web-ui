import RESTReducers from 'providers/rest-reducers'
import { combineReducers } from 'redux'

const computeGalleryFetchFactory = RESTReducers.computeFetch('gallery')
const computeGalleryEntriesQueryFactory = RESTReducers.computeQuery('galleries')
const computeGalleryDeleteFactory = RESTReducers.computeDelete('delete_gallery')

export const fvGalleryReducer = combineReducers({
  computeGallery: computeGalleryFetchFactory.computeGallery,
  computeGalleries: computeGalleryEntriesQueryFactory.computeGalleries,
  computeDeleteGallery: computeGalleryDeleteFactory.computeDeleteGallery,
})
