/* eslint-env mocha */
/* global cy */

describe('app', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000')
  })

  it('starts displaying text from בראשית', () => {
    cy.contains('בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃')
  })

  it('loads in the next page when scrolling down', () => {
    cy.get('[data-target-id="tikkun-book"]').scrollTo(0, 3000)

    cy.contains('וְאֵ֛ת כָּל־רֶ֥מֶשׂ הָֽאֲדָמָ֖ה לְמִינֵ֑הוּ וַיַּ֥רְא אֱלֹהִ֖ים כִּי־טֽוֹב׃')
  })

  it('toggles annotations when clicking on the toggle', () => {
    cy.get('[data-test-id="annotations-toggle"]').as('toggle').click()

    cy.contains('בראשית ברא אלהים את השמים ואת הארץ')

    cy.get('@toggle').click()

    cy.contains('בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃')
  })

  it('opens the parsha picker when clicking on the current parsha', () => {
    cy.get('.app-toolbar').contains('בראשית').click()

    cy.contains('בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃').should('not.be.visible')

    cy.contains('נח')
    cy.contains('לך לך')
    cy.contains('וירא')
  })

  it('honors annotations toggle when dismissing the parsha picker', () => {
    cy.get('.app-toolbar').contains('בראשית')
      .click() // open parsha-picker
      .click() // and close it again

    cy.get('[data-test-id="annotations-toggle"]').click()

    cy.contains('בראשית ברא אלהים את השמים ואת הארץ')
  })

  it('hides annotations toggle and repo link when showing parsha picker', () => {
    cy.get('.app-toolbar').contains('בראשית')
      .click()

    cy.get('[data-test-id="annotations-toggle"]').should('not.be.visible')
    cy.get('a[href^="https://www.github.com"]').should('not.be.visible')
  })
})
