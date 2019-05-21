import RESTActions from 'providers/rest-actions'

export const fetchCharacter = RESTActions.fetch('FV_CHARACTER', 'FVCharacter', {
  headers: { 'enrichers.document': 'ancestry,character,permissions' },
})

export const updateCharacter = RESTActions.update('FV_CHARACTER', 'FVCharacter', {
  headers: { 'enrichers.document': 'ancestry,character,permissions' },
})

export const fetchCharacters = RESTActions.query('FV_CHARACTERS', 'FVCharacter', {
  headers: { 'enrichers.document': 'character' },
})

export const publishCharacter = RESTActions.execute('FV_CHARACTER_PUBLISH', 'FVPublish', {
  headers: { 'enrichers.document': 'ancestry,character,permissions' },
})
