// A11Y
const { axe, toHaveNoViolations } = require('jest-axe')
expect.extend(toHaveNoViolations)
import ReactDOMServer from 'react-dom/server'

// Standard/Unit
import React from 'react'

// REDUX
import { Provider } from 'react-redux'
import store from 'providers/redux/store'

jest.mock('providers/redux/reducers/rest')
jest.mock('common/NavigationHelpers')

// Component to test
import CreateRecorder from '../create'

describe('Recorder > Create', () => {
  test('Accessibility', async() => {
    const html = ReactDOMServer.renderToString(<Provider store={store}>
      <CreateRecorder /></Provider>)
    const results = await axe(html)
    expect(results).toHaveNoViolations()
  })
})

