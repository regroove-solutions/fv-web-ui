import Immutable, { List, Map } from 'immutable';

const TITLE_CASE_KEY = function (key) {
  return key[0].toUpperCase()+key.substring(1)
};

const UPPER_CASE_KEY = function (key) {
  return 'FV_' + key.toUpperCase()
};

const CAMEL_CASE_KEY = function (key) {
  
  if (key.indexOf('_') === -1) {
    return TITLE_CASE_KEY(key);
  }

  let modifiedKey = '';
  let keyArray = key.split('_');

  for (let i = 0; i < keyArray.length; ++i) {
    modifiedKey += TITLE_CASE_KEY(keyArray[i]);
  }

  return modifiedKey;
};

export default {
  computeFetch: function computeFetch(key) {

    return {['compute' + CAMEL_CASE_KEY(key)]: (state = new List([]), action) => {

        // Find entry within state based on id
        let indexOfEntry = state.findIndex(function(item) {
          return item.get("id") === action.pathOrId; 
        });

        switch (action.type) {
          case UPPER_CASE_KEY(key) + '_FETCH_START':
          case UPPER_CASE_KEY(key) + '_UPDATE_START':
          case UPPER_CASE_KEY(key) + '_CREATE_START':

            return state.push(Map({
              action: action.type,            	
              id: action.pathOrId,
              message: action.message,
              isFetching: true,
              success: false
            }));

          break;

          case UPPER_CASE_KEY(key) + '_FETCH_SUCCESS':
          case UPPER_CASE_KEY(key) + '_UPDATE_SUCCESS':
          case UPPER_CASE_KEY(key) + '_CREATE_SUCCESS':
        	  
            // Replace entry within state
            return state.set(indexOfEntry, Map({
              action: action.type,
              id: action.pathOrId,
              isFetching: false,
              success: true,
              response: action.response,
              message: action.message
            }));

          break;

          case UPPER_CASE_KEY(key) + '_FETCH_ERROR':
          case UPPER_CASE_KEY(key) + '_UPDATE_ERROR':
          case UPPER_CASE_KEY(key) + '_CREATE_ERROR':

            // Add error message
            return state.set(indexOfEntry, Map({
              action: action.type,            	
              id: action.pathOrId,
              isFetching: false,
              isError: true,
              success: false,
              response: state.get(indexOfEntry).get('response'),
              message: action.message
            }));

          break;
        }

        return state;
    }}
  },
  computeQuery: function computeQuery(key) {

    return {['compute' + CAMEL_CASE_KEY(key)]: (state = new List([]), action) => {

        // Find entry within state based on id
        let indexOfEntry = state.findIndex(function(item) {
          return item.get("id") === action.pathOrId; 
        });

        switch (action.type) {
          case UPPER_CASE_KEY(key) + '_QUERY_START':

            return state.push(Map({
              action: action.type,              
              id: action.pathOrId,
              message: action.message,
              isFetching: true,
              success: false
            }));

          break;

          case UPPER_CASE_KEY(key) + '_QUERY_SUCCESS':
            
            // Replace entry within state
            return state.set(indexOfEntry, Map({
              action: action.type,
              id: action.pathOrId,
              isFetching: false,
              success: true,
              response: action.response,
              message: action.message
            }));

          break;

          case UPPER_CASE_KEY(key) + '_QUERY_ERROR':

            // Add error message
            return state.set(indexOfEntry, Map({
              action: action.type,              
              id: action.pathOrId,
              isFetching: false,
              isError: true,
              success: false,
              response: state.get(indexOfEntry).get('response'),
              message: action.message
            }));

          break;
        }

        return state;
    }}
  },
  computeOperation: function computeOperation(key) {

    return {['compute' + CAMEL_CASE_KEY(key)]: (state = new List([]), action) => {

        // Find entry within state based on id
        let indexOfEntry = state.findIndex(function(item) {
          return item.get("id") === action.pathOrId; 
        });

        switch (action.type) {
          case UPPER_CASE_KEY(key) + '_EXECUTE_START':

            return state.push(Map({
              action: action.type,              
              id: action.pathOrId,
              message: action.message,
              isFetching: true,
              success: false
            }));

          break;

          case UPPER_CASE_KEY(key) + '_EXECUTE_SUCCESS':
            
            // Replace entry within state
            return state.set(indexOfEntry, Map({
              action: action.type,
              id: action.pathOrId,
              isFetching: false,
              success: true,
              response: action.response,
              message: action.message
            }));

          break;

          case UPPER_CASE_KEY(key) + '_EXECUTE_ERROR':

            // Add error message
            return state.set(indexOfEntry, Map({
              action: action.type,              
              id: action.pathOrId,
              isFetching: false,
              isError: true,
              success: false,
              response: state.get(indexOfEntry).get('response'),
              message: action.message
            }));

          break;
        }

        return state;
    }}
  },
  computeDelete: function computeDelete(key) {

    return {['compute' + CAMEL_CASE_KEY(key)]: (state = new List([]), action) => {

        // Find entry within state based on id
        let indexOfEntry = state.findIndex(function(item) {
          return item.get("id") === action.pathOrId; 
        });

        switch (action.type) {
          case UPPER_CASE_KEY(key) + '_DELETE_START':

            return state.push(Map({
              action: action.type,              
              id: action.pathOrId,
              message: action.message,
              isFetching: true,
              success: false
            }));

          break;

          case UPPER_CASE_KEY(key) + '_DELETE_SUCCESS':
            
            // Replace entry within state
            return state.set(indexOfEntry, Map({
              action: action.type,
              id: action.pathOrId,
              isFetching: false,
              success: true,
              response: action.response,
              message: action.message
            }));

          break;

          case UPPER_CASE_KEY(key) + '_DELETE_ERROR':

            // Add error message
            return state.set(indexOfEntry, Map({
              action: action.type,              
              id: action.pathOrId,
              isFetching: false,
              isError: true,
              success: false,
              response: state.get(indexOfEntry).get('response'),
              message: action.message
            }));

          break;
        }

        return state;
    }}
  }
}