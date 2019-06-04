import { fetch, update, query, execute } from 'providers/redux/reducers/rest'

export const fetchCharacter = fetch('FV_CHARACTER', 'FVCharacter', {
  headers: { 'enrichers.document': 'ancestry,character,permissions' },
})

export const updateCharacter = update('FV_CHARACTER', 'FVCharacter', {
  headers: { 'enrichers.document': 'ancestry,character,permissions' },
})

export const fetchCharacters = query('FV_CHARACTERS', 'FVCharacter', {
  headers: { 'enrichers.document': 'character' },
})

export const publishCharacter = execute('FV_CHARACTER_PUBLISH', 'FVPublish', {
  headers: { 'enrichers.document': 'ancestry,character,permissions' },
})
