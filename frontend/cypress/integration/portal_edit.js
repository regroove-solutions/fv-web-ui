describe('Authentication', () => {
  it('Logins to //firstvoices-dev.apps.prod.nuxeo.io as SENCOTEN_ADMIN and updates the portal About Us on //0.0.0.0:3001', () => {
    // Note: need to set environment variables in your bash_profile, eg:
    // export ADMIN_USERNAME='THE_USERNAME'
    // export ADMIN_PASSWORD='THE_PASSWORD'

    // Login
    cy.log('--- LOGIN ---')
    cy.login()

    cy.visit(
      'http://0.0.0.0:3001/nuxeo/app/explore/FV/Workspaces/Data/SEN%C4%86O%C5%A6EN/SEN%C4%86O%C5%A6EN/SEN%C4%86O%C5%A6EN'
    )
    cy.get('#pageNavigation').contains('FPCCAdmin')

    const updateMessage = `PORTAL UPDATE (${new Date()})`
    cy.getByText('ABOUT US')
      // TODO: need more reliable hook
      .parents('div:first')
      .parent()
      .within(() => {
        cy.getByText('mode_edit')
          .parents('button:first')
          .click()
        // Note: need to wait for WYSIWYG editor to init
        cy.wait(500)
        // TODO: need user visible hook, not implementation detail
        cy.get('#editablePortal_introduction')
          .clear()
          .type(updateMessage)

        cy.getByText('Save', { exact: false }).click()
      })
    cy.getByText('ABOUT US')
      // TODO: need more reliable hook
      .parents('div:first')
      .parent()
      .within(() => {
        cy.getByText(updateMessage).should('exist')
      })
  })
})
