import Immutable, { List, Map } from 'immutable';

import RESTActions from './rest-actions'
import RESTReducers from './rest-reducers'

// Middleware
import thunk from 'redux-thunk';

// Operations
import DirectoryOperations from 'operations/DirectoryOperations';
import DocumentOperations from 'operations/DocumentOperations';

const DISMISS_ERROR = 'DISMISS_ERROR';

/**
* Multiple Phrase Actions
*/
const FV_PHRASES_FETCH_START = "FV_PHRASES_FETCH_START";
const FV_PHRASES_FETCH_SUCCESS = "FV_PHRASES_FETCH_SUCCESS";
const FV_PHRASES_FETCH_ERROR = "FV_PHRASES_FETCH_ERROR";

const FV_PHRASES_SHARED_FETCH_START = "FV_PHRASES_SHARED_FETCH_START";
const FV_PHRASES_SHARED_FETCH_SUCCESS = "FV_PHRASES_SHARED_FETCH_SUCCESS";
const FV_PHRASES_SHARED_FETCH_ERROR = "FV_PHRASES_SHARED_FETCH_ERROR";

/**
* Single Phrase Actions
*/

const FV_PHRASE_FETCH_ALL_START = "FV_PHRASE_FETCH_ALL_START";
const FV_PHRASE_FETCH_ALL_SUCCESS = "FV_PHRASE_FETCH_ALL_SUCCESS";
const FV_PHRASE_FETCH_ALL_ERROR = "FV_PHRASE_FETCH_ALL_ERROR";

const fetchSharedPhrases = function fetchSharedPhrases(page_provider, headers = {}, params = {}) {
  return function (dispatch) {

    dispatch( { type: FV_PHRASES_SHARED_FETCH_START } );

    return DirectoryOperations.getDocumentsViaPageProvider(page_provider, 'FVPhrase', headers, params)
    .then((response) => {
      dispatch( { type: FV_PHRASES_SHARED_FETCH_SUCCESS, documents: response } )
    }).catch((error) => {
        dispatch( { type: FV_PHRASES_SHARED_FETCH_ERROR, error: error } )
    });
  }
};

const fetchPhrasesAll = function fetchPhrasesAll(path, type) {
  return function (dispatch) {

    dispatch( { type: FV_PHRASE_FETCH_ALL_START } );

    return DirectoryOperations.getDocumentByPath2(path, 'FVPhrase', '', { headers: { 'X-NXenrichers.document': 'ancestry,phrase,permissions' } })
    .then((response) => {
      dispatch( { type: FV_PHRASE_FETCH_ALL_SUCCESS, documents: response } )
    }).catch((error) => {
        dispatch( { type: FV_PHRASE_FETCH_ALL_ERROR, error: error } )
    });
  }
};

const fetchPhrasesInPath = function fetchPhrasesInPath(path, queryAppend, headers = {}, params = {}) {
  return function (dispatch) {

    dispatch( { type: FV_PHRASES_FETCH_START } );

    return DirectoryOperations.getDocumentByPath2(path, 'FVPhrase', queryAppend, {headers: headers}, params)
    .then((response) => {
      dispatch( { type: FV_PHRASES_FETCH_SUCCESS, documents: response } )
    }).catch((error) => {
        dispatch( { type: FV_PHRASES_FETCH_ERROR, error: error } )
    });
  }
};

const fetchPhrase = RESTActions.fetch('FV_PHRASE', 'FVPhrase', { headers: { 'X-NXenrichers.document': 'ancestry,phrase,permissions' } });
const createPhrase = RESTActions.create('FV_PHRASE', 'FVPhrase', { headers: { 'X-NXenrichers.document': 'ancestry,phrase,permissions' } });
const updatePhrase = RESTActions.update('FV_PHRASE', 'FVPhrase', { headers: { 'X-NXenrichers.document': 'ancestry,phrase,permissions' } });
const deletePhrase = RESTActions.delete('FV_PHRASE', 'FVPhrase', {});

const publishPhrase = RESTActions.execute('FV_PHRASE_PUBLISH', 'FVPublish', { headers: { 'X-NXenrichers.document': 'ancestry,phrase,permissions' } });
const askToPublishPhrase = RESTActions.execute('FV_PHRASE_PUBLISH_WORKFLOW', 'Context.StartWorkflow', { headers: { 'X-NXenrichers.document': 'ancestry,word,permissions' } });
const unpublishPhrase = RESTActions.execute('FV_PHRASE_UNPUBLISH', 'FVUnpublishDialect', { headers: { 'X-NXenrichers.document': 'ancestry,phrase,permissions' } });
const askToUnpublishPhrase = RESTActions.execute('FV_PHRASE_UNPUBLISH_WORKFLOW', 'Context.StartWorkflow', { headers: { 'X-NXenrichers.document': 'ancestry,word,permissions' } });
const enablePhrase = RESTActions.execute('FV_PHRASE_ENABLE', 'FVEnableDocument', { headers: { 'X-NXenrichers.document': 'ancestry,phrase,permissions' } });
const askToEnablePhrase = RESTActions.execute('FV_PHRASE_ENABLE_WORKFLOW', 'Context.StartWorkflow', { headers: { 'X-NXenrichers.document': 'ancestry,word,permissions' } });
const disablePhrase = RESTActions.execute('FV_PHRASE_DISABLE', 'FVDisableDocument', { headers: { 'X-NXenrichers.document': 'ancestry,phrase,permissions' } });
const askToDisablePhrase = RESTActions.execute('FV_PHRASE_DISABLE_WORKFLOW', 'Context.StartWorkflow', { headers: { 'X-NXenrichers.document': 'ancestry,word,permissions' } });

const actions = { fetchSharedPhrases, fetchPhrasesInPath, fetchPhrase, createPhrase, fetchPhrasesAll, updatePhrase, deletePhrase, publishPhrase, unpublishPhrase, enablePhrase, disablePhrase, askToPublishPhrase, askToUnpublishPhrase, askToEnablePhrase, askToDisablePhrase };

const computePhraseFactory = RESTReducers.computeFetch('phrase');
const computePhraseDeleteFactory = RESTReducers.computeDelete('delete_phrase');
const computePhraseEnableOperationFactory = RESTReducers.computeOperation('phrase_enable_workflow');
const computePhraseDisableOperationFactory = RESTReducers.computeOperation('phrase_disable_workflow');

const reducers = {
  computeSharedPhrases(state = { isFetching: false, response: { get: function() { return ''; } }, success: false }, action) {
    switch (action.type) {
      case FV_PHRASES_SHARED_FETCH_START:
        return Object.assign({}, state, { isFetching: true });
      break;

      // Send modified document to UI without access REST end-point
      case FV_PHRASES_SHARED_FETCH_SUCCESS:
        return Object.assign({}, state, { response: action.documents, isFetching: false, success: true });
      break;

      // Send modified document to UI without access REST end-point
      case FV_PHRASES_SHARED_FETCH_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error, errorDismissed: (action.type === DISMISS_ERROR) ? true: false });
      break;

      default: 
        return Object.assign({}, state, { isFetching: false });
      break;
    }
  },
  computePhrasesInPath(state = { isFetching: false, response: { get: function() { return ''; } }, success: false }, action) {
    switch (action.type) {
      case FV_PHRASES_FETCH_START:
        return Object.assign({}, state, { isFetching: true });
      break;

      // Send modified document to UI without access REST end-point
      case FV_PHRASES_FETCH_SUCCESS:
        return Object.assign({}, state, { response: action.documents, isFetching: false, success: true });
      break;

      // Send modified document to UI without access REST end-point
      case FV_PHRASES_FETCH_ERROR:
      case DISMISS_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error, errorDismissed: (action.type === DISMISS_ERROR) ? true: false });
      break;

      default: 
        return Object.assign({}, state, { isFetching: false });
      break;
    }
  },
  computePhrase: computePhraseFactory.computePhrase, 
  computeDeletePhrase: computePhraseDeleteFactory.computeDeletePhrase,
  computePhraseEnableWorkflow: computePhraseEnableOperationFactory.computePhraseEnableWorkflow,
  computePhraseDisableWorkflow: computePhraseDisableOperationFactory.computePhraseDisableWorkflow,
  computePhrasesAll(state = { isFetching: false, response: {get: function() { return ''; }}, success: false }, action) {
    switch (action.type) {
      case FV_PHRASE_FETCH_ALL_START:
        return Object.assign({}, state, { isFetching: true, success: false });
      break;

      case FV_PHRASE_FETCH_ALL_SUCCESS:
        return Object.assign({}, state, { response: action.documents, isFetching: false, success: true });
      break;

      case FV_PHRASE_FETCH_ALL_ERROR:
      case DISMISS_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error, errorDismissed: (action.type === DISMISS_ERROR) ? true: false });
      break;

      default: 
        return Object.assign({}, state, { isFetching: false });
      break;
    }
  }
};

const middleware = [thunk];

export default { actions, reducers, middleware };