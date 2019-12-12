describe('DialectFilterList-Phrases.js > DialectFilterList', () => {
  it('Select category with enough results for pagination, confirm has data, navigate to next page, confirm has data', () => {
    cy.log('Forcing the test to fail until FW-707 is fixed.').then(() => {
      cy.expect(true).to.equal(false)
    })

    cy.visit('/explore/FV/sections/Data/TEst/Test/TestLanguageSix/learn/phrases')

    const category = 'TestPhraseBook'
    cy.DialectFilterList({
      category,
      confirmData: true,
      shouldPaginate: true,
      clearFilter: true,
      clearFilterText: 'stop browsing by phrase book',
    })
  })
  it('FW-255: ‘Create’ button is not working after filtering by Category (Navigate to a category, click Create Phrase)', () => {
    cy.login({
      userName: 'TESTLANGUAGESIX_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/TestLanguageSix/learn/phrases')

    const category = 'TestPhraseBook'

    cy.DialectFilterList({
      category,
      confirmData: false,
      shouldPaginate: false,
      clearFilter: false,
    })

    cy.getByText('Create new phrase', {
      exact: false,
    }).click()

    cy.getByText('Add New Phrase to', {
      exact: false,
    }).should('exist')

    cy.log('Test complete')
  })
})
