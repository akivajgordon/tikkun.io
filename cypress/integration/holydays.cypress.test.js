/* global describe, cy, it, */

describe('holydays', () => {
  it('can jump to rosh hashanah', () => {
    cy.visit('http://localhost:8000')

    cy.get('.app-toolbar').contains('בראשית').click()

    cy.contains('ראש השנה א׳').click()

    cy.contains('פָּקַ֥ד אֶת־שָׂרָ֖ה כַּאֲשֶׁ֣ר אָמָ֑ר')
  })
})
