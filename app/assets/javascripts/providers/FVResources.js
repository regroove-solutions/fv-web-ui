import RESTActions from './rest-actions'
import RESTReducers from './rest-reducers'

// Middleware
import thunk from 'redux-thunk';

const fetchWord = RESTActions.fetch('FV_WORD', 'FVWord', { headers: { 'X-NXenrichers.document': 'ancestry,word,permissions' } });
const fetchResources = RESTActions.query('FV_RESOURCES', 'FVPicture,FVAudio,FVVideo', { headers: {} });
const updateWord = RESTActions.update('FV_WORD', 'FVWord', { headers: { 'X-NXenrichers.document': 'ancestry,word,permissions' } });

const computeWordFetchFactory = RESTReducers.computeFetch('word');
const computeResourcesQueryFactory = RESTReducers.computeQuery('resources');

const actions = { fetchResources, fetchWord, updateWord };

const reducers = {
  computeWord: computeWordFetchFactory.computeWord,
  computeResources: computeResourcesQueryFactory.computeResources
};

const middleware = [thunk];

export default { actions, reducers, middleware };