// A11Y
const { axe, toHaveNoViolations } = require('jest-axe')
expect.extend(toHaveNoViolations)
import ReactDOMServer from 'react-dom/server'

// Standard/Unit
import React from 'react'

jest.mock('providers/redux/reducers/rest')
jest.mock('common/NavigationHelpers')

// Component to test
import { Contributor } from '../create'
const props = {
  // REDUX: reducers/state
  computeContributor: {},
  computeContributors: {},
  computeCreateContributor: {},
  computeDialect: {},
  computeDialect2: {},
  splitWindowPath: [],
  // REDUX: actions/dispatch/func
  createContributor: () => {},
  fetchContributors: () => {},
  fetchDialect: () => {},
  pushWindowPath: () => {},
}

describe('Contributor > Create', () => {
  test('Accessibility', async() => {
    const html = ReactDOMServer.renderToString(<Contributor {...props} />)
    const results = await axe(html)
    expect(results).toHaveNoViolations()
  })
})

