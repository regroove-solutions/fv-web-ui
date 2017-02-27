import RESTActions from './rest-actions'
import RESTReducers from './rest-reducers'

// Middleware
import thunk from 'redux-thunk';

const fetchGallery = RESTActions.fetch('FV_GALLERY', 'FVGallery', { headers: { 'X-NXenrichers.document': 'ancestry,gallery,permissions' } });
const fetchGalleries = RESTActions.query('FV_GALLERIES', 'FVGallery', { headers: { 'X-NXenrichers.document': 'ancestry,gallery,permissions' } });
const createGallery = RESTActions.create('FV_GALLERY', 'FVGallery', { headers: { 'X-NXenrichers.document': 'ancestry,gallery,permissions' } });
const updateGallery = RESTActions.update('FV_GALLERY', 'FVGallery', { headers: { 'X-NXenrichers.document': 'ancestry,gallery,permissions' } });
const deleteGallery = RESTActions.delete('FV_GALLERY', 'FVGallery', {});

const actions = { fetchGallery, updateGallery, fetchGalleries, createGallery, deleteGallery };

const computeGalleryFetchFactory = RESTReducers.computeFetch('gallery');
const computeGalleryEntriesQueryFactory = RESTReducers.computeQuery('galleries');

const reducers = {
  computeGallery: computeGalleryFetchFactory.computeGallery,
  computeGalleries: computeGalleryEntriesQueryFactory.computeGalleries 
};

const middleware = [thunk];

export default { actions, reducers, middleware };