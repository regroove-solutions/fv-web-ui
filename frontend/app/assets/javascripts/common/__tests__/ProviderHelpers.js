import ProviderHelpers from '../ProviderHelpers'
const {
  fetchIfMissing, // calls getEntry
  filtersToNXQL,
  getDialectGroups,
  getDialectPathFromURLArray,
  getEntry, // calls immutable's isEmpty & find
  isAdmin,
  isActiveRole,
  isDialectMember,
  isDialectPath,
  isRecorderWithApproval,
  isSiteMember,
  replaceAllWorkspaceSectionKeys,
  switchWorkspaceSectionKeys,
  toJSKeepId,
} = ProviderHelpers
describe('ProviderHelpers', () => {
  test('getDialectPathFromURLArray', () => {
    // Structure: Arrange
    const urlStrings = [
      'nuxeo/app/explore/FV/Workspaces/Data/Athabascan/Dene/Dene/learn/words/create',
      'nuxeo/app/v2/explore/FV/Workspaces/Data/Athabascan/Dene/Dene/learn/words/create',
      'explore/FV/Workspaces/Data/Athabascan/Dene/Dene/learn/words/create',
      'FV/Workspaces/Data/Athabascan/Dene/Dene/learn/words/create',
      'nuxeo/app/explore/FVGames/Workspaces/Data/Athabascan/Dene/Dene/learn/words/create',
      'nuxeo/app/v2/explore/FVGames/Workspaces/Data/Athabascan/Dene/Dene/learn/words/create',
      'explore/FVGames/Workspaces/Data/Athabascan/Dene/Dene/learn/words/create',
      'FVGames/Workspaces/Data/Athabascan/Dene/Dene/learn/words/create',

      'nuxeo/app/explore/FV/Workspaces/Data/SEN%C4%86O%C5%A6EN/SEN%C4%86O%C5%A6EN/SEN%C4%86O%C5%A6EN/learn/words/create',
      'nuxeo/app/v2/explore/FV/Workspaces/Data/SEN%C4%86O%C5%A6EN/SEN%C4%86O%C5%A6EN/SEN%C4%86O%C5%A6EN/learn/words/create',
      'explore/FV/Workspaces/Data/SEN%C4%86O%C5%A6EN/SEN%C4%86O%C5%A6EN/SEN%C4%86O%C5%A6EN/learn/words/create',
      'FV/Workspaces/Data/SEN%C4%86O%C5%A6EN/SEN%C4%86O%C5%A6EN/SEN%C4%86O%C5%A6EN/learn/words/create',
      'nuxeo/app/explore/FVGames/Workspaces/Data/SEN%C4%86O%C5%A6EN/SEN%C4%86O%C5%A6EN/SEN%C4%86O%C5%A6EN/learn/words/create',
      'nuxeo/app/v2/explore/FVGames/Workspaces/Data/SEN%C4%86O%C5%A6EN/SEN%C4%86O%C5%A6EN/SEN%C4%86O%C5%A6EN/learn/words/create',
      'explore/FVGames/Workspaces/Data/SEN%C4%86O%C5%A6EN/SEN%C4%86O%C5%A6EN/SEN%C4%86O%C5%A6EN/learn/words/create',
      'FVGames/Workspaces/Data/SEN%C4%86O%C5%A6EN/SEN%C4%86O%C5%A6EN/SEN%C4%86O%C5%A6EN/learn/words/create',

      'nuxeo/app/explore/FV/Workspaces/Data/daniel-test/daniel-test/daniel-test/learn/words/create',
      'nuxeo/app/v2/explore/FV/Workspaces/Data/daniel-test/daniel-test/daniel-test/learn/words/create',
      'explore/FV/Workspaces/Data/daniel-test/daniel-test/daniel-test/learn/words/create',
      'FV/Workspaces/Data/daniel-test/daniel-test/daniel-test/learn/words/create',
      'nuxeo/app/explore/FVGames/Workspaces/Data/daniel-test/daniel-test/daniel-test/learn/words/create',
      'nuxeo/app/v2/explore/FVGames/Workspaces/Data/daniel-test/daniel-test/daniel-test/learn/words/create',
      'explore/FVGames/Workspaces/Data/daniel-test/daniel-test/daniel-test/learn/words/create',
      'FVGames/Workspaces/Data/daniel-test/daniel-test/daniel-test/learn/words/create',

      'nuxeo/app/explore/FV/Workspaces/Data/mariana_test/mariana-test/dialect-mariana/learn/words/create',
      'nuxeo/app/v2/explore/FV/Workspaces/Data/mariana_test/mariana-test/dialect-mariana/learn/words/create',
      'explore/FV/Workspaces/Data/mariana_test/mariana-test/dialect-mariana/learn/words/create',
      'FV/Workspaces/Data/mariana_test/mariana-test/dialect-mariana/learn/words/create',
      'nuxeo/app/explore/FVGames/Workspaces/Data/mariana_test/mariana-test/dialect-mariana/learn/words/create',
      'nuxeo/app/v2/explore/FVGames/Workspaces/Data/mariana_test/mariana-test/dialect-mariana/learn/words/create',
      'explore/FVGames/Workspaces/Data/mariana_test/mariana-test/dialect-mariana/learn/words/create',
      'FVGames/Workspaces/Data/mariana_test/mariana-test/dialect-mariana/learn/words/create',
    ]
    const correctAnswers = [
      '/FV/Workspaces/Data/Athabascan/Dene',
      '/FV/Workspaces/Data/Athabascan/Dene',
      '/FV/Workspaces/Data/Athabascan/Dene',
      '/FV/Workspaces/Data/Athabascan/Dene',
      null,
      null,
      null,
      null,

      '/FV/Workspaces/Data/SEN%C4%86O%C5%A6EN/SEN%C4%86O%C5%A6EN',
      '/FV/Workspaces/Data/SEN%C4%86O%C5%A6EN/SEN%C4%86O%C5%A6EN',
      '/FV/Workspaces/Data/SEN%C4%86O%C5%A6EN/SEN%C4%86O%C5%A6EN',
      '/FV/Workspaces/Data/SEN%C4%86O%C5%A6EN/SEN%C4%86O%C5%A6EN',
      null,
      null,
      null,
      null,

      '/FV/Workspaces/Data/daniel-test/daniel-test',
      '/FV/Workspaces/Data/daniel-test/daniel-test',
      '/FV/Workspaces/Data/daniel-test/daniel-test',
      '/FV/Workspaces/Data/daniel-test/daniel-test',
      null,
      null,
      null,
      null,

      '/FV/Workspaces/Data/mariana_test/mariana-test',
      '/FV/Workspaces/Data/mariana_test/mariana-test',
      '/FV/Workspaces/Data/mariana_test/mariana-test',
      '/FV/Workspaces/Data/mariana_test/mariana-test',
      null,
      null,
      null,
      null,
    ]

    urlStrings.forEach((urlString, index) => {
      // fn() expects array, convert str to arr
      const urlArray = urlString.split('/')
      const output = getDialectPathFromURLArray(urlArray)

      const answer = correctAnswers[index]
      expect(output).toBe(answer)
    })
  })
})
