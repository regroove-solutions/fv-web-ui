import ConfGlobal from 'conf/local.js'

import RESTActions from 'providers/rest-actions'
import RESTReducers from 'providers/rest-reducers'

import thunk from 'redux-thunk'

const fetchLanguageFamily = RESTActions.fetch('FV_LANGUAGE_FAMILY', 'FVLanguageFamily', {
  headers: { 'enrichers.document': 'ancestry' },
})

const actions = { fetchLanguageFamily }

const computeLanguageFamilyFetch = RESTReducers.computeFetch('language_family')

const reducers = {
  computeLanguageFamily: computeLanguageFamilyFetch.computeLanguageFamily,
}

const mockRequest = {
  fetchLanguageFamily: {
    // args PathOrId + type of document
    args: [ConfGlobal.testData.sectionOrWorkspaces + ConfGlobal.testData.languageFamilyPath, 'FVLanguageFamily'],
    evaluateResults: function(response) {
      return response.type == 'FVLanguageFamily' && response.properties != null
    },
  },
}

const middleware = [thunk]

export default { actions, reducers, middleware, mockRequest }
