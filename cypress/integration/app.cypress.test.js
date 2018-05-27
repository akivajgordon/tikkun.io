/* eslint-env mocha */
/* global cy */

describe('app', () => {
  it('starts displaying text from בראשית', () => {
    cy.visit('http://localhost:8000')

    cy.contains('בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃')
  })
})
