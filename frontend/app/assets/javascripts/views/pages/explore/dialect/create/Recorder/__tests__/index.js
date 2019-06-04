// A11Y
const { axe, toHaveNoViolations } = require('jest-axe')
expect.extend(toHaveNoViolations)
import ReactDOMServer from 'react-dom/server'

// Standard/Unit
import React from 'react'

jest.mock('providers/redux/reducers/rest')
jest.mock('common/NavigationHelpers')

// Component to test
import { CreateRecorder } from '..'
const props = {
  pushWindowPath: () => {},
  createContributor: () => {},
  fetchDialect: () => {},
  fetchContributors: () => {},
  computeContributors: {},
  splitWindowPath: [],
  computeDialect: {},
  computeDialect2: {},
  computeContributor: {},
}

describe('Recorder > Create', () => {
  test('Accessibility', async() => {
    const html = ReactDOMServer.renderToString(<CreateRecorder {...props} />)
    const results = await axe(html)
    expect(results).toHaveNoViolations()
  })
})

