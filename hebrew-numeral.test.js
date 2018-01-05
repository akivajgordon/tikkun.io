import test from 'ava'
const hebrewNumeralFromInteger = require('./hebrew-numeral')

test('exact value returns the letter', t => {
  t.is(hebrewNumeralFromInteger(4), 'ד')
})

test('exact value returns the letter (again)', t => {
  t.is(hebrewNumeralFromInteger(30), 'ל')
})
