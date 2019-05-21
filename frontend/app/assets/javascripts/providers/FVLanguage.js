import ConfGlobal from 'conf/local.js'

import RESTActions from 'providers/rest-actions'
import RESTReducers from 'providers/rest-reducers'

import thunk from 'redux-thunk'

const fetchLanguage = RESTActions.fetch('FV_LANGUAGE', 'FVLanguage', { headers: { 'enrichers.document': 'ancestry' } })
const fetchLanguages = RESTActions.query('FV_LANGUAGES', 'FVLanguage', {
  headers: { 'enrichers.document': 'ancestry' },
})

const actions = { fetchLanguages, fetchLanguage }

const computeLanguageFetch = RESTReducers.computeFetch('language')
const computeLanguageQuery = RESTReducers.computeQuery('languages')

const reducers = {
  computeLanguages: computeLanguageQuery.computeLanguages,
  computeLanguage: computeLanguageFetch.computeLanguage,
}

const mockRequest = {
  fetchLanguage: {
    // args PathOrId + type of document
    args: [ConfGlobal.testData.sectionOrWorkspaces + ConfGlobal.testData.languagePath, 'FVLanguage'],
    evaluateResults: function(response) {
      return response.type == 'FVLanguage' && response.properties != null
    },
  },
  fetchLanguages: {
    // args PathOrId + type of document
    args: [ConfGlobal.testData.sectionOrWorkspaces + ConfGlobal.testData.languageFamilyPath, 'FVLanguage'],
    evaluateResults: function(response) {
      return response.totalSize > 0
    },
  },
}

const middleware = [thunk]

export default { actions, reducers, middleware, mockRequest }
