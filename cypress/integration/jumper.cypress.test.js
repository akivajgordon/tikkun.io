/* eslint-env mocha */
/* global cy,expect */

describe('app', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000')
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

  it('jumps to the selected parsha', () => {
    cy.get('.app-toolbar').contains('בראשית')
      .click()

    cy.contains('שופטים').click()

    cy.contains('בראשית').should('not.exist')

    cy.contains('שֹׁפְטִ֣ים וְשֹֽׁטְרִ֗ים')

    cy.get('.app-toolbar').contains('ראה – שופטים')

    cy.contains('בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃').should('not.exist')
  })

  it('jumps to the center of the page', () => {
    const centerYOf = ({ y, height }) => y + (height / 2)

    cy.get('.app-toolbar').contains('בראשית')
      .click()

    cy.contains('נח').click()

    cy.get('[data-target-id="tikkun-book"]').then(($book) => {
      console.log($book)
      const bookRect = $book.get(0).getBoundingClientRect()

      cy.contains('אֵ֚לֶּה תּוֹלְדֹ֣ת נֹ֔חַ נֹ֗חַ אִ֥ישׁ צַדִּ֛יק תָּמִ֥ים הָיָ֖ה בְּדֹֽרֹתָ֑יו').should(($el) => {
        const rect = $el.get(0).getBoundingClientRect()
        expect(Math.abs(centerYOf(bookRect) - centerYOf(rect))).to.be.at.most(20)
      })
    })
  })

  it('opens the parsha picker when pressing "/"', () => {
    cy.get('body').type('/')

    cy.contains('נח')
    cy.contains('לך לך')
    cy.contains('וירא')
  })

  it('filters parshiyot', () => {
    cy.get('body').type('/')

    cy.contains(/vayishlach/i).should('not.be.visible') // shouldn't start by showing search results

    cy.focused()
      .should('match', '[placeholder*="search" i]')
      .type('shlch') // vayishlach, b'shalach, sh'lach

    cy.contains('נח').should('not.be.visible') // hides parsha list

    cy.contains('Vayishlach')
    cy.contains(`Beshalach`)
    cy.contains(`Sh'lach`)
  })
})
