/* global describe, cy, it, */

describe('special readings', () => {
  it('can jump to megilat esther', () => {
    cy.visit('http://localhost:8000')

    cy.get('.app-toolbar').contains('בראשית').click()

    cy.contains('אסתר').click()

    cy.contains('וַיְהִ֖י בִּימֵ֣י אֲחַשְׁוֵר֑וֹשׁ')
  })

  it('shows "אסתר" in toolbar after jumping to esther', () => {
    cy.visit('http://localhost:8000')

    cy.get('.app-toolbar').contains('בראשית').click()

    cy.contains('אסתר').click()

    cy.get('.app-toolbar').contains('אסתר')
  })

  it('can search for esther', () => {
    cy.visit('http://localhost:8000')

    cy.get('.app-toolbar').contains('בראשית').click()

    cy.focused()
      .type('esther')

    cy.contains('אסתר')
      .click()

    cy.contains('וַיְהִ֖י בִּימֵ֣י אֲחַשְׁוֵר֑וֹשׁ')
  })
})
