import RESTActions from 'providers/rest-actions'
export const fetchLanguage = RESTActions.fetch('FV_LANGUAGE', 'FVLanguage', {
  headers: { 'enrichers.document': 'ancestry' },
})
export const fetchLanguages = RESTActions.query('FV_LANGUAGES', 'FVLanguage', {
  headers: { 'enrichers.document': 'ancestry' },
})
