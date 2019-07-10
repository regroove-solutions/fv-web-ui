// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import 'cypress-testing-library/add-commands'

// TODO: ENABLE WEBPACK ALIASES IN CYPRESS TESTS!
// import copy from '/views/pages/explore/dialect/Recorder/internationalization'
import copy from '../../../app/assets/javascripts/views/pages/explore/dialect/Recorder/internationalization.js'

describe('Recorder', () => {
  it('Create', () => {
    // Login
    cy.login()

    cy.visit('http://0.0.0.0:3001/explore/FV/Workspaces/Data/Athabascan/Dene/Dene/create/recorder')
    cy.queryByText(copy.default.title).should('exist')

    // Submit w/no data
    cy.getByText(copy.default.submit).click()

    // Error should be displayed
    cy.getByLabelText(copy.validation.name)

    // Fill in required field
    cy.getByLabelText(copy.default.name).type('[CY] Contributor Name')

    // Resubmit
    cy.getByText(copy.default.submit).click()

    // Should see success
    cy.getByText(copy.default.success.title).should('exist')

    // Create another
    cy.getByText(copy.default.success.createAnother).click()

    // Confirm
    cy.queryByText(copy.default.title).should('exist')

    // Submit w/no data
    cy.getByText(copy.default.submit).click()

    // Error should be displayed
    cy.getByLabelText(copy.validation.name)
  })
})
