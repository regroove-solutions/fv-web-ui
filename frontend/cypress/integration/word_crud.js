describe('Word', () => {
  const host = 'http://0.0.0.0:3001'
  //   const page = `${host}/nuxeo/app/explore/FV/Workspaces/Data/Athabascan/Dene/Dene/learn/words/f1464526-9022-4103-9174-9a7fffc71419`
  const login = 'https://firstvoices-dev.apps.prod.nuxeo.io/nuxeo/startup'
  const create =
    'https://firstvoices-dev.apps.prod.nuxeo.io/nuxeo/api/v1/path/FV/Workspaces/Data/Athabascan/Dene/Dene/Dictionary'
  const prefix = '/nuxeo/app'
  it('Edit', () => {
    // Note: need to set environment variables in your bash_profile, eg:
    // export ADMIN_USERNAME='THE_USERNAME'
    // export ADMIN_PASSWORD='THE_PASSWORD'

    // NB: Cypress drops the `CYPRESS__` prefix when using:
    expect(Cypress.env('ADMIN_USERNAME')).not.to.be.undefined
    expect(Cypress.env('ADMIN_PASSWORD')).not.to.be.undefined

    // Login
    cy.request({
      method: 'POST',
      url: login,
      form: true, // we are submitting a regular form body
      body: {
        user_name: Cypress.env('ADMIN_USERNAME'),
        user_password: Cypress.env('ADMIN_PASSWORD'),
        language: 'en',
        requestedUrl: 'app',
        forceAnonymousLogin: true,
        form_submitted_marker: undefined,
        Submit: 'Log+In',
      },
    })

    // Create
    const nowCreate = Date.now()
    const title = `Cypress: Word > CRUD | Test ran at ${nowCreate}`
    const word = {
      'entity-type': 'document',
      type: 'FVWord',
      name: '1553060181758',
      properties: {
        'dc:title': title,
        'fv-word:pronunciation': 'Auto created by Cypress test',
        'fv-word:part_of_speech': 'verb',
      },
    }
    cy.request({
      method: 'POST',
      url: create,
      body: word,
    }).then((response) => {
      // Visit
      const page = `${host}${prefix}/explore/FV/Workspaces/Data/Athabascan/Dene/Dene/learn/words/${response.body.uid}`
      cy.log(`Visit: ${page}`)
      cy.visit(page)
      const waitLong = 4000
      const waitShort = 50
      // Update
      cy.getByText('Edit word', { exact: false }).click()
      const nowEdit = Date.now()
      cy.log('Update Reference')
      cy.get('input[label="Reference"].form-control').type(nowEdit)
      cy.getByText('save', { exact: false }).click()

      cy.wait(waitLong)
      cy.getByText(title).should('exist')
      cy.getByText('METADATA', { exact: false }).click()
      cy.get('aside').contains(nowEdit)

      // Delete
      cy.getByText('delete word', { exact: false }).click()
      cy.wait(waitShort)
      cy.getByText('Deleting word', { exact: false })
        .parent()
        .within(() => {
          cy.get('button')
            .eq(1)
            .click()
        })
      cy.wait(waitShort)
      cy.getByText('Delete word success', { exact: false }).should('exist')
    })
  })
})
