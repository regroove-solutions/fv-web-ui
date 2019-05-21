import RESTActions from 'providers/rest-actions'

export const fetchLanguageFamily = RESTActions.fetch('FV_LANGUAGE_FAMILY', 'FVLanguageFamily', {
  headers: { 'enrichers.document': 'ancestry' },
})
