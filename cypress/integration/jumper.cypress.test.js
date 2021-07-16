/* eslint-env mocha */
/* global cy,expect */

const openParshaPicker = () => {
  cy.get('.app-toolbar').contains('בראשית').click()
}

describe('jumper', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000')
  })

  it('opens the parsha picker when clicking on the current parsha', () => {
    openParshaPicker()

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
    openParshaPicker()

    cy.get('[data-test-id="annotations-toggle"]').should('not.be.visible')
    cy.get('a[href^="https://www.github.com"]').should('not.be.visible')
  })

  it('jumps to the selected parsha', () => {
    openParshaPicker()

    cy.contains('שופטים').click()

    cy.contains('בראשית').should('not.exist')

    cy.contains('שֹׁפְטִ֣ים וְשֹֽׁטְרִ֗ים')

    cy.get('.app-toolbar').contains(/^ראה\s–\sשופטים$/)

    cy.contains('בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃').should('not.exist')
  })

  it('jumps to the center of the page', () => {
    const centerYOf = ({ y, height }) => y + (height / 2)

    openParshaPicker()

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

  it('shows the hebrew name of the parsha for an english search', () => {
    cy.get('body').type('/')

    cy.focused()
      .type('vyr')

    cy.contains('נח').should('not.be.visible') // hides parsha list

    cy.contains('Vayera')
      .closest('[data-target-class="list-item"]')
      .contains('וירא')

    cy.contains(`Vayikra`)
      .closest('[data-target-class="list-item"]')
      .contains(`ויקרא`)
  })

  it('hides "Coming up" when searching', () => {
    cy.get('body').type('/')

    cy.focused()
      .type('v')

    cy.contains(/coming up/i).should('not.be.visible')

    cy.focused()
      .clear()

    cy.contains(/coming up/i).should('be.visible')
  })

  it('appropriately shows "No results" message', () => {
    cy.get('body').type('/')

    cy.focused()
      .type('xqqqvvvxxx7654321')

    cy.contains(/no.*results/i)
  })

  it('jumps to a parsha when tapping on search result', () => {
    cy.get('body').type('/')

    cy.focused()
      .type('noah')

    cy.contains('נח')
      .click()

    cy.contains('אֵ֚לֶּה תּוֹלְדֹ֣ת נֹ֔חַ נֹ֗חַ אִ֥ישׁ צַדִּ֛יק תָּמִ֥ים הָיָ֖ה בְּדֹֽרֹתָ֑יו')
      .should('be.visible')
  })

  it('can navigate search results with keyboard', () => {
    cy.get('body').type('/')

    cy.focused()
      .type('vy') // vayera, vayeitzei, vayishlach, etc.

    cy.get('[data-target-class="list-item"]')
      .not(':first-child')
      .each($result => {
        cy.wrap($result).should('not.have.attr', 'data-selected')
      })

    cy.get('[data-target-class="list-item"]')
      .first()
      .should('have.attr', 'data-selected')

    cy.focused()
      .type('{downarrow}{downarrow}{uparrow}')
      .type('{ctrl}n')
      .type('{ctrl}n')
      .type('{ctrl}p')

    cy.get('[data-target-class="list-item"]')
      .eq(2)
      .should('have.attr', 'data-selected')

    cy.get('[data-target-class="list-item"]')
      .first()
      .should('not.have.attr', 'data-selected')

    cy.get('[data-selected="true"] [data-target-class="result-hebrew"]')
      .then($hebrewElement => {
        cy.focused()
          .type('{enter}')

        cy.get('.app-toolbar').contains($hebrewElement.text().trim())
      })
  })

  it('updates hash with parsha name when clicking on a browsing parsha', () => {
    openParshaPicker()

    cy.url().should('not.include', '#/p/eikev')

    cy.contains('עקב').click()

    cy.url().should('include', '#/p/eikev')
  })

  it('updates hash with parsha name when selecting a search result', () => {
    openParshaPicker()

    cy.url().should('not.include', '#/p/lech-lecha')

    cy.focused().type('lechlec{enter}')

    cy.url().should('include', '#/p/lech-lecha')
  })
})
