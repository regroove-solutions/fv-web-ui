// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import 'cypress-testing-library/add-commands'

describe('Navigation.js > Navigation', () => {
  it('FW-266: Navigation: clicking between "Get Started", "Contribute", & "FirstVoices Apps" loads incorrect page content', () => {
    cy.visit('/')
    cy.getByText('menu open', { exact: false }).click({ force: true })
    cy.getByText('get started', { exact: false }).click()
    cy.getByTestId('pageContainer').within(() => {
      cy.queryByText('What is FirstVoices', { exact: false }).should('exist')
    })

    cy.getByText('menu open', { exact: false }).click({ force: true })
    cy.getByText('FirstVoices apps', { exact: false }).click()
    cy.getByTestId('pageContainer').within(() => {
      cy.queryByText('FirstVoices Apps', { exact: false }).should('exist')
    })
  })
})
