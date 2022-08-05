import test from 'ava'
import hebrewNumeralFromInteger from './hebrew-numeral'

test('exact value returns the letter', (t) => {
  t.is(hebrewNumeralFromInteger(4), 'ד')
})

test('exact value returns the letter (again)', (t) => {
  t.is(hebrewNumeralFromInteger(30), 'ל')
})

test('two character numbers', (t) => {
  t.is(hebrewNumeralFromInteger(42), 'מב')
})

test('טו gets special treatment', (t) => {
  t.is(hebrewNumeralFromInteger(15), 'טו')
})

test('טז gets special treatment', (t) => {
  t.is(hebrewNumeralFromInteger(16), 'טז')
})

test('three character numbers', (t) => {
  t.is(hebrewNumeralFromInteger(421), 'תכא')
})
