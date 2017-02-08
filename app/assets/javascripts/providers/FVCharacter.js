import RESTActions from './rest-actions'
import RESTReducers from './rest-reducers'

// Middleware
import thunk from 'redux-thunk';

const fetchCharacters = RESTActions.query('FV_CHARACTERS', 'FVCharacter', { headers: { 'X-NXenrichers.document': 'character' } });

const computeCharactersQueryFactory = RESTReducers.computeQuery('characters');

const actions = { fetchCharacters };

const reducers = {
  computeCharacters: computeCharactersQueryFactory.computeCharacters
};

const middleware = [thunk];

export default { actions, reducers, middleware };