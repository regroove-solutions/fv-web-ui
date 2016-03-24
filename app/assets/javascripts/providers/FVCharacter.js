// Middleware
import thunk from 'redux-thunk';

// Operations
import DocumentOperations from 'operations/DocumentOperations';

/**
* Character Actions
*/
const FV_CHARACTERS_FETCH_START = "FV_CHARACTERS_FETCH_START";
const FV_CHARACTERS_FETCH_SUCCESS = "FV_CHARACTERS_FETCH_SUCCESS";
const FV_CHARACTERS_FETCH_ERROR = "FV_CHARACTERS_FETCH_ERROR";

const fetchCharacters = function fetchCharacters(dialectPath) {
	return function (dispatch) {

		dispatch( { type: FV_CHARACTERS_FETCH_START } );

		return DocumentOperations.getCharactersByDialect(dialectPath, { headers: { 'X-NXenrichers.document': 'character' } })
			.then((response) => {
				dispatch( { type: FV_CHARACTERS_FETCH_SUCCESS, document: response } )
			}).catch((error) => {
		        dispatch( { type: FV_CHARACTERS_FETCH_SUCCESS, error: error } )
			});
	}
};

const actions = { fetchCharacters };

const reducers = {

  computeCharacters(state = { isFetching: false, response: {get: function() { return ''; }}, success: false }, action) {
    switch (action.type) {
      case FV_CHARACTERS_FETCH_START:
        return Object.assign({}, state, { isFetching: true, success: false });
      break;

      case FV_CHARACTERS_FETCH_SUCCESS:
        return Object.assign({}, state, { response: action.document, isFetching: false, success: true });
      break;

      case FV_CHARACTERS_FETCH_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error});
      break;

      default: 
        return Object.assign({}, state, { isFetching: false });
      break;
    }
  }  
};

const middleware = [thunk];

export default { actions, reducers, middleware };