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
    cy.get('#js-app').scrollTo(0, 1000)

    cy.contains('וְאֵ֛ת כָּל־רֶ֥מֶשׂ הָֽאֲדָמָ֖ה לְמִינֵ֑הוּ וַיַּ֥רְא אֱלֹהִ֖ים כִּי־טֽוֹב׃')
  })
})
