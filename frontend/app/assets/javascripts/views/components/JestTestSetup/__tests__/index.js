const { axe, toHaveNoViolations } = require('jest-axe')
expect.extend(toHaveNoViolations)
import ReactDOMServer from 'react-dom/server'

import React from 'react'
import ReactDOM from 'react-dom'
import { JestTestSetup } from '..'
// import renderer from 'react-test-renderer'

// Resolves promise on next tick:
// const flushPromises = () => {
//   return new Promise(resolve => {
//     setTimeout(resolve, 0)
//   })
// }
// Mock a dependency:
// jest.mock('../../some/lib', ()=> {
//   return {
//     aProp: {
//       aMethod: jest.fn(()=> Promise.resolve())
//     }
//   }
// })
// test('JestTestSetup Mounts', async () => {

// beforeEach(() => {
//   initializeCityDatabase();
// });

// afterEach(() => {
//   clearCityDatabase();
// });
describe('JestTestSetup', () => {
  test('Mounts', () => {
    // const div = document.createElement('div')
    // await flushPromises()
    // expect(fakeHistory.push).toHaveBeenCalledTimes(1)
    // expect(utilsMock.posts.create).toHaveBeenCalledWith({date: expect.any(String)})
    // ReactDOM.render(<JestTestSetup />, div)

    // Structure: Arrange
    const handleSubmit = jest.fn()
    const container = document.createElement('div')
    ReactDOM.render(<JestTestSetup onSubmit={handleSubmit} />, container)

    const form = container.querySelector('form')
    const { username, password } = form.elements
    username.value = 'name from jest test'
    password.value = 'pasword from jest test'

    // form.dispatchEvent(new Event('submit'))
    form.dispatchEvent(new window.Event('submit'))

    // expect(container.querySelector('h1').textContent).toMatch('This is the form')

    expect(handleSubmit).toHaveBeenCalledTimes(1)
    expect(handleSubmit).toHaveBeenCalledWith({
      username: username.value,
      password: password.value,
    })
    // Structure: Act
    // Structure: Assert
  })

  test('Accessibility', async () => {
    const html = ReactDOMServer.renderToString(<JestTestSetup onSubmit={() => {}} />)
    const results = await axe(html)
    expect(results).toHaveNoViolations()
  })
})
