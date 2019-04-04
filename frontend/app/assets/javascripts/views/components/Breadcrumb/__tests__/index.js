// To test:
import Breadcrumb from '..'
import routesDefault from 'conf/routes'

// Setup:
import React from 'react'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'
import Immutable from 'immutable'

const { axe, toHaveNoViolations } = require('jest-axe')
expect.extend(toHaveNoViolations)

const routeParamsDefault = {
  theme: 'explore',
  area: 'sections',
  dialect_name: 'Dene',
  dialect_path: '/FV/sections/Data/Athabascan/Dene/Dene',
  language_name: 'Dene',
  language_path: '/FV/sections/Data/Athabascan/Dene',
  language_family_name: 'Athabascan',
  language_family_path: '/FV/sections/Data/Athabascan',
}
const splitWindowPathDefault = [
  'nuxeo',
  'app',
  'explore',
  'FV',
  'sections',
  'Data',
  'Athabascan',
  'Dene',
  'Dene',
  'learn',
  'words',
]
const matchedPageDefault = {
  path: ['nuxeo', 'app', { id: 'theme', matcher: {} }, 'FV', { id: 'area', matcher: {} }, 'Data', {}, {}, {}, 'learn'],
  title: 'Learn {$dialect_name}',
  page: { key: null, ref: null, props: {}, _owner: null, _store: {} },
  extractPaths: true,
  redirects: [{}],
}

const getComponent = (props = {}) => {
  const {
    splitWindowPath = splitWindowPathDefault,
    routeParams = routeParamsDefault,
    matchedPage = matchedPageDefault,
    routes = routesDefault,
  } = props
  return <Breadcrumb splitWindowPath={splitWindowPath} routeParams={routeParams} matchedPage={Immutable.fromJS(matchedPage)} routes={Immutable.fromJS(routes)}/>
}

describe('Breadcrumb', () => {
  test('Mounts', () => {
    // Arrange
    const container = document.createElement('div')
    ReactDOM.render(getComponent(), container)

    // Act

    // Assert
    expect(container.querySelector('ul').textContent).toMatch('learnwords')
  })

  test('Is accessibile', async() => {
    // Arrange
    const html = ReactDOMServer.renderToString(getComponent())
    const results = await axe(html)

    // console.log(`--- html ---
    // ${html}
    // `)

    // Act

    // Assert
    expect(results).toHaveNoViolations()
  })
})
