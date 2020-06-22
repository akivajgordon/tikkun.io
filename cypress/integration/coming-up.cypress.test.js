describe('coming up', () => {
  it('displays in the jumper', () => {
    cy.visit('/')
    cy.get('body').type('/')

    cy.contains(/coming up/i)
  })

  it('shows three upcoming readings in the "coming up" section', () => {
    cy.clock(new Date('2020-04-16').getTime())

    cy.visit('/')
    cy.get('body').type('/')
    const expectedComingUp = [
      { label: 'שמיני', date: 'Apr 18' },
      { label: 'תזריע – מצורע', date: 'Apr 25' },
      { label: 'אחרי מות – קדושים', date: 'May 2' }
    ]

    cy.get('#coming-up li')
      .should('have.length', 3)
      .each(($el, index) => {
        const { label, date } = expectedComingUp[index]
        cy.wrap($el)
          .contains(label)

        cy.wrap($el)
          .contains(date)
      })
  })

  it('can jump to the parsha', () => {
    cy.clock(new Date('2020-06-12').getTime())

    cy.visit('/')
    cy.get('body').type('/')

    cy.get('#coming-up li')
      .eq(1)
      .contains('שלח')
      .click()

    cy.contains('וַיְדַבֵּ֥ר יְהוָ֖ה אֶל־מֹשֶׁ֥ה לֵּאמֹֽר׃ שְׁלַח־לְךָ֣ אֲנָשִׁ֗ים')
  })

  it('can jump to a double parsha', () => {
    cy.clock(new Date('2020-04-16').getTime())

    cy.visit('/')
    cy.get('body').type('/')

    cy.get('#coming-up li')
      .eq(1)
      .contains('תזריע – מצורע')
      .click()

    cy.contains('לֵאמֹ֔ר אִשָּׁה֙ כִּ֣י תַזְרִ֔יעַ וְיָלְדָ֖ה זָכָ֑ר וְטָֽמְאָה֙ שִׁבְעַ֣ת')
  })
})
