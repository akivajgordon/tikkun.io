/* global describe, cy, it, */

describe('holydays', () => {
  it('can jump to rosh hashanah', () => {
    cy.visit('http://localhost:8000')

    cy.get('.app-toolbar').contains('בראשית').click()

    cy.contains('ראש השנה א׳').click()

    cy.contains('פָּקַ֥ד אֶת־שָׂרָ֖ה כַּאֲשֶׁ֣ר אָמָ֑ר')
  })

  it('shows special reading aliyah indicator', () => {
    cy.visit('http://localhost:8000')

    cy.get('.app-toolbar').contains('בראשית').click()

    cy.contains('פסח ח׳').click()

    cy.contains('(פסח ח׳)')

    cy.get('[data-target-id="tikkun-book"]').scrollTo(0, 3000, { duration: 300 })
    cy.get('[data-target-id="tikkun-book"]').scrollTo(0, 10000, { duration: 300 })

    cy.wait(300)
    cy.get('[data-target-id="tikkun-book"]').scrollTo(0, 5000, { duration: 300 })

    cy.contains('ראשון (שלישי)')
  })
})
