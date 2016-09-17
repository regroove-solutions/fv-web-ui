import RESTActions from './rest-actions'
import RESTReducers from './rest-reducers'

// Middleware
import thunk from 'redux-thunk';


// Operations
import DirectoryOperations from 'operations/DirectoryOperations';

/**
* Multiple Character Actions
*/
const FV_CHARACTERS_FETCH_START = "FV_CHARACTERS_FETCH_START";
const FV_CHARACTERS_FETCH_SUCCESS = "FV_CHARACTERS_FETCH_SUCCESS";
const FV_CHARACTERS_FETCH_ERROR = "FV_CHARACTERS_FETCH_ERROR";

const fetchCharacters = RESTActions.query('FV_CHARACTERS', 'FVCharacter', { headers: { 'X-NXenrichers.document': 'character' } });

const computeCharactersQueryFactory = RESTReducers.computeQuery('characters');

const actions = { fetchCharacters };

const reducers = {
  computeCharacters: computeCharactersQueryFactory.computeCharacters
};

const middleware = [thunk];

export default { actions, reducers, middleware };