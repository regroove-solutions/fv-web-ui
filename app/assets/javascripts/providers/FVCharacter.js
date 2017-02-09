import RESTActions from './rest-actions'
import RESTReducers from './rest-reducers'

// Middleware
import thunk from 'redux-thunk';

const fetchCharacter = RESTActions.fetch('FV_CHARACTER', 'FVCharacter', { headers: { 'X-NXenrichers.document': 'ancestry,character,permissions' } });
const fetchCharacters = RESTActions.query('FV_CHARACTERS', 'FVCharacter', { headers: { 'X-NXenrichers.document': 'character' } });

const computeCharacterFetchFactory = RESTReducers.computeFetch('character');
const computeCharactersQueryFactory = RESTReducers.computeQuery('characters');

const actions = { fetchCharacter, fetchCharacters };

const reducers = {
  computeCharacter: computeCharacterFetchFactory.computeCharacter,
  computeCharacters: computeCharactersQueryFactory.computeCharacters
};

const middleware = [thunk];

export default { actions, reducers, middleware };