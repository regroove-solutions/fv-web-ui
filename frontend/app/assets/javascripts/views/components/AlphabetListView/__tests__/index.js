// A11Y
// const { axe, toHaveNoViolations } = require('jest-axe')
// expect.extend(toHaveNoViolations)
// import ReactDOMServer from 'react-dom/server'

// Standard/Unit
import React from 'react'
import ReactDOM from 'react-dom'

// Component to test
import { AlphabetListView } from '..'
const props = {
  handleClick: () => {},
  routeParams: {},
  dialect: {},
  splitWindowPath: [],
  computeCharacters: {},
  computePortal: {},
  fetchDialect2: () => {},
  fetchCharacters: () => {},
  letter: 'a',
}
describe('AlphabetListView', () => {
  // test('Mounts', () => {
  //   // Structure: Arrange
  //   const container = document.createElement('div')
  //   ReactDOM.render(<AlphabetListView {...props} />, container)

  //   expect(container.querySelector('h2').textContent).toMatch('Browse Alphabetically')

  //   // Structure: Act
  //   // Structure: Assert
  // })

  test('Snapshot', () => {
    const container = document.createElement('div')
    ReactDOM.render(<AlphabetListView {...props} />, container)

    const element = container.querySelector('.AlphabetListView')
    expect(element).toMatchSnapshot()
  })

  // test('Accessibility', async() => {
  //   const html = ReactDOMServer.renderToString(<AlphabetListView {...props} />)
  //   const results = await axe(html)
  //   expect(results).toHaveNoViolations()
  // })
})
