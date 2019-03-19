import {
  computeLoginRecorderApproval,
  computeLoginAdmin,
  computeLoginGuest,
  computeLoginStub,
  computeDialect2,
  // computeDialect,
} from './__mocks__/data.js'
import ProviderHelpers from '../ProviderHelpers'
import { fromJS } from 'immutable'

const {
  // fetchIfMissing, // TODO
  // filtersToNXQL, // TODO
  // getDialectGroups, // TODO
  getDialectPathFromURLArray,
  getEntry,
  isAdmin,
  isActiveRole,
  // isDialectMember, // Note: not certain if this fn() is being used
  isDialectPath,
  isRecorderWithApproval,
  isSiteMember,
  // replaceAllWorkspaceSectionKeys, // TODO
  // switchWorkspaceSectionKeys, // TODO
  // toJSKeepId, // TODO
} = ProviderHelpers

// const dataSwitchWorkspaceSectionKeys1 = ['fv-word:categories', 'sections']
// const dataSwitchWorkspaceSectionKeys2 = ['fv-phrase:phrase_books', 'sections']
// const dataSwitchWorkspaceSectionKeys3 = ['fv-word:categories', 'Workspaces']

describe('ProviderHelpers', () => {
  test('getEntry', () => {
    const path = '/FV/Workspaces/Data/SENĆOŦEN/SENĆOŦEN/SENĆOŦEN'
    const success = getEntry(fromJS(computeDialect2), path)
    expect(success.id).toBe(path)
    expect(getEntry(fromJS(computeDialect2), '/FV/Workspaces/Data/INCORRECT/PATH')).toBe(null)
  })
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

      '/FV/Workspaces/Data/SENĆOŦEN/SENĆOŦEN',
      '/FV/Workspaces/Data/SENĆOŦEN/SENĆOŦEN',
      '/FV/Workspaces/Data/SENĆOŦEN/SENĆOŦEN',
      '/FV/Workspaces/Data/SENĆOŦEN/SENĆOŦEN',
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

  test('isAdmin', () => {
    expect(isAdmin(computeLoginAdmin)).toBe(true)
    expect(isAdmin(computeLoginGuest)).toBe(false)
    expect(isAdmin(computeLoginStub)).toBe(undefined)
    expect(isAdmin()).toBe(undefined)
  })

  test('isSiteMember', () => {
    const dataIsSiteMember1 = undefined
    const dataIsSiteMember2 = []
    const dataIsSiteMember3 = ['administrators']
    const dataIsSiteMember4 = ['members']
    expect(isSiteMember(dataIsSiteMember1)).toBe(undefined)
    expect(isSiteMember(dataIsSiteMember2)).toBe(false)
    expect(isSiteMember(dataIsSiteMember3)).toBe(false)
    expect(isSiteMember(dataIsSiteMember4)).toBe(true)
  })

  test('isDialectPath', () => {
    const dataIsDialectPath1 = '/'
    const dataIsDialectPath2 =
      '/nuxeo/app/explore/FV/sections/Data/SEN%C4%86O%C5%A6EN/SEN%C4%86O%C5%A6EN/SEN%C4%86O%C5%A6EN/learn'
    const dataIsDialectPath3 = undefined
    const dataIsDialectPath4 = '/nuxeo/app/kids/FV/Workspaces/Data/Athabascan/Dene/Dene'

    expect(isDialectPath(dataIsDialectPath1)).toBe(false)
    expect(isDialectPath(dataIsDialectPath2)).toBe(false)
    expect(isDialectPath(dataIsDialectPath3)).toBe(false)
    expect(isDialectPath(dataIsDialectPath4)).toBe(true)
  })

  test('isActiveRole', () => {
    const dataIsActiveRole1 = []
    const dataIsActiveRole2 = ['Record']
    const dataIsActiveRole3 = ['Approve']
    const dataIsActiveRole4 = ['Manage']
    const dataIsActiveRole5 = ['Member']
    const dataIsActiveRole6 = ['Record', 'Member']
    const dataIsActiveRole7 = ['Record', 'Approve', 'Manage']
    const dataIsActiveRole8 = ['Record', 'Approve', 'Manage', 'Member']
    const dataIsActiveRole9 = undefined
    expect(isActiveRole(dataIsActiveRole1)).toBe(false)
    expect(isActiveRole(dataIsActiveRole2)).toBe(true)
    expect(isActiveRole(dataIsActiveRole3)).toBe(true)
    expect(isActiveRole(dataIsActiveRole4)).toBe(true)
    expect(isActiveRole(dataIsActiveRole5)).toBe(true)
    expect(isActiveRole(dataIsActiveRole6)).toBe(true)
    expect(isActiveRole(dataIsActiveRole7)).toBe(true)
    expect(isActiveRole(dataIsActiveRole8)).toBe(true)
    expect(isActiveRole(dataIsActiveRole9)).toBe(false)
  })

  test('isRecorderWithApproval', () => {
    expect(isRecorderWithApproval(computeLoginAdmin)).toBe(false)
    expect(isRecorderWithApproval(computeLoginGuest)).toBe(false)
    expect(isRecorderWithApproval(computeLoginStub)).toBe(false)
    expect(isRecorderWithApproval()).toBe(false)
    expect(isRecorderWithApproval(computeLoginRecorderApproval)).toBe(true)
  })

  // NOTE: not certain if isDialectMember() is being used
  // test('isDialectMember', () => {
  //   const _computeDialect = fromJS(computeDialect)
  //   expect(isDialectMember(computeLoginAdmin, computeDialect)).toBe(false)
  //   expect(isDialectMember(computeLoginGuest, computeDialect)).toBe(false)
  //   expect(isDialectMember(computeLoginStub, computeDialect)).toBe(false)
  //   expect(isDialectMember(undefined, computeDialect)).toBe(false)
  //   expect(isDialectMember(computeLoginAdmin, undefined)).toBe(false)
  //   expect(isDialectMember(computeLoginGuest, undefined)).toBe(false)
  //   expect(isDialectMember(computeLoginStub, undefined)).toBe(false)
  // })
})
