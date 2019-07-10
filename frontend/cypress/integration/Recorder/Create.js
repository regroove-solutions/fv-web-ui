import 'cypress-testing-library/add-commands'
import copy from '../../../app/assets/javascripts/views/pages/explore/dialect/create/Recorder/internationalization'
describe('Recorder', () => {
  it('Create', () => {
    // Login
    cy.login()

    cy.visit('http://0.0.0.0:3001/nuxeo/app/explore/FV/Workspaces/Data/Athabascan/Dene/Dene/create/recorder')
    cy.queryByText(copy.default.title).should('exist')

    // Submit w/no data
    cy.getByText(copy.default.submit).click()

    // Error should be displayed
    cy.getByLabelText(copy.validation.name)

    // Fill in required field
    cy.getByLabelText(copy.default.name).type('[CY] Recorder Name')

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
