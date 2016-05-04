import Immutable, { List, Map } from 'immutable';

export default {
  computeFetch: function computeFetch(key) {
    return function (state = new List([]), action) {

        // Find entry within state based on id
        let indexOfEntry = state.findIndex(function(item) {
          return item.get("id") === action.pathOrId; 
        });

        switch (action.type) {
          case key + '_FETCH_START':
          case key + '_UPDATE_START':

            return state.push(Map({
              id: action.pathOrId,
              isFetching: true,
              success: false
            }));

          break;

          case key + '_FETCH_SUCCESS':
          case key + '_UPDATE_ERROR':

            // Replace entry within state
            return state.set(indexOfEntry, Map({
              id: action.pathOrId,
              isFetching: false,
              success: true,
              response: action.response
            }));

          break;

          case key + '_FETCH_ERROR':
          case key + '_UPDATE_ERROR':

            // Add error message
            return state.set(indexOfEntry, Map({
              id: action.pathOrId,
              isFetching: false,
              isError: true,
              success: false,
              response: state.get(indexOfEntry).get('response'),
              error: action.error
            }));

          break;
        }

        return state;
    }
  }
}