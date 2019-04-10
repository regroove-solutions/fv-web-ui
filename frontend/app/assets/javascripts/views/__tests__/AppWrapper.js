// A11Y
// const { axe, toHaveNoViolations } = require('jest-axe')
// expect.extend(toHaveNoViolations)
// import ReactDOMServer from 'react-dom/server'

// Standard
import React from 'react'
import ReactDOM from 'react-dom'

// Component to test
// import { JestTestSetup } from 'views/components/JestTestSetup'

// import injectTapEventPlugin from 'react-tap-event-plugin'
import ThemeManager from 'material-ui/lib/styles/theme-manager'
import FirstVoicesTheme from 'views/themes/FirstVoicesTheme.js'
import ConfGlobal from 'conf/local.js'

// Providers provide reducers and actions
import providers from '../../providers/index'

// Views
import AppWrapper from '../AppWrapper'

// require('!style-loader!css-loader!normalize.css')
// require('!style-loader!css-loader!alloyeditor/dist/alloy-editor/assets/alloy-editor-ocean-min.css')
// require('!style-loader!css-loader!tether-shepherd/dist/css/shepherd-theme-arrows.css')
// require('bootstrap/less/bootstrap')
// require('styles/main')

// injectTapEventPlugin()

const context = {
  providers,
  /*combinedProviders: [
      providers // OK for all providers to share the same store for now, make sure actions are unique
    ],*/
  providedState: {
    properties: {
      title: ConfGlobal.title,
      pageTitleParams: null,
      domain: ConfGlobal.domain,
      theme: {
        palette: ThemeManager.getMuiTheme(FirstVoicesTheme),
        id: 'default',
      },
    },
  },
}
describe('AppWrapper', () => {
  test('Mounts', () => {
    // Structure: Arrange
    const container = document.createElement('div')
    ReactDOM.render(<AppWrapper {...context} />, container)

    expect(container.querySelector('#pageNavigation').textContent).toMatch('SIGN IN')
    expect(container.querySelector('#pageFooter').textContent).toMatch('support@fpcc.ca')

    // Structure: Act
    // Structure: Assert
  })

  // test('Accessibility', async() => {
  //   const html = ReactDOMServer.renderToString(<AppWrapper {...context} />)
  //   const results = await axe(html)
  //   expect(results).toHaveNoViolations()
  // })
})
