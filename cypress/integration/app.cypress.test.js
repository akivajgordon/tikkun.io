/* eslint-env mocha */
/* global cy,expect */

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

  it('scrolling after jumping to another parsha should show the right content', () => {
    cy.get('.app-toolbar').contains('בראשית')
      .click()

    cy.contains('שופטים').click()

    cy.get('[data-target-id="tikkun-book"]').scrollTo(0, 3000)

    cy.contains('הָעֹמֵ֞ד לְשָׁ֤רֶת שָׁם֙ אֶת־יְהוָ֣ה אֱלֹהֶ֔יךָ א֖וֹ אֶל־הַשֹּׁפֵ֑ט')
  })

  it('scrolling updates the current title', () => {
    cy.get('.app-toolbar').contains('בראשית')
      .click()

    cy.contains('שופטים').click()

    cy.get('.app-toolbar').contains('ראה – שופטים')

    cy.get('[data-target-id="tikkun-book"]').scrollTo(0, 3000)

    cy.get('.app-toolbar').contains('שופטים')
  })

  it('displays the aliyot markers', () => {
    cy.contains('א:א').should('be.visible')

    cy.get('[data-test-id="annotations-toggle"]').as('toggle').click()

    cy.contains('א:א').should('be.hidden')
  })

  it('toggles annotations when the SHIFT key is pressed', () => {
    cy.get('body').as('book')

    cy.contains('בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃')

    cy.get('@book').type('{shift}', { release: false })

    cy.contains('בראשית ברא אלהים את השמים ואת הארץ')

    cy.get('@book').type('{shift}', { release: true })

    cy.contains('בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃')

    cy.get('[data-test-id="annotations-toggle"]').as('toggle').click()

    cy.get('@book').type('{shift}', { release: false })

    cy.contains('בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃')

    cy.get('@book').type('{shift}', { release: true })

    cy.contains('בראשית ברא אלהים את השמים ואת הארץ')
  })

  it('shows a tooltip to press the "Shift" key to toggle quickly') // can't test this because cypress does not have `cy.get('...').hover` – see https://docs.cypress.io/api/commands/hover.html#

  it('shows the parsha name in place of the ראשון marker', () => {
    cy.get('.app-toolbar').contains('בראשית')
      .click()

    cy.contains('וישב').click()

    cy
      .get('[data-target-id="aliyot-range"]')
      .invoke('text')
      .should('not.include', 'ראשון')

    cy
      .get('[data-target-id="aliyot-range"]')
      .invoke('text')
      .should('include', 'וישב')
  })
})
