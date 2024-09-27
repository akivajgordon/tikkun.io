import test from 'ava'
import fuzzy from './fuzzy'

test('only matches if all characters are present in order', (t) => {
  const haystack = [
    'matches',
    'tam',
    'nope',
    'no chance',
    'walmart',
    'mta',
    'amazing time',
    'nothing',
  ]

  const results = fuzzy(haystack, 'mat')
  const matches = ['matches', 'walmart', 'amazing time']

  t.true(matches.every((match) => results.map((r) => r.item).includes(match)))
  t.is(results.length, matches.length)
})

test('prioritizes matches that are closer together (all same-length strings)', (t) => {
  const haystack = ['a_b_c', 'a_bc_', 'a__bc', 'abc__', 'ab_c_', 'ab__c']

  const results = fuzzy(haystack, 'abc')
  const matches = ['abc__', 'ab_c_', 'a_bc_', 'ab__c', 'a_b_c', 'a__bc']

  t.deepEqual(
    results.map((r) => r.item),
    matches,
  )
})

test('prioritizes matches that are closer to the start of the string', (t) => {
  const haystack = ['a_bc_', '_abc_', '__abc', '_ab_c_', 'abc__', 'a__bc']

  const results = fuzzy(haystack, 'abc')
  const matches = ['abc__', '_abc_', '__abc', '_ab_c_', 'a_bc_', 'a__bc']

  t.deepEqual(
    results.map((r) => r.item),
    matches,
  )
})

test('returns the match indexes', (t) => {
  const haystack = ['c_d_ef__', '__cd_ef']

  const results = fuzzy(haystack, 'cdef')

  t.deepEqual(
    results.map(({ match }) => match.indexes),
    [
      [2, 3, 5, 6],
      [0, 2, 4, 5],
    ],
  )
})

test('accepts an arbitrary item and a function for how to search it', (t) => {
  const haystack = [
    { lang: 'English', val: 'Hello' },
    { lang: 'Spanish', val: 'Hola' },
    { lang: 'French', val: 'Bonjour' },
  ]

  const results = fuzzy(haystack, 'en', (obj) => [obj.lang])

  t.deepEqual(
    results.map((r) => r.item),
    [
      { lang: 'English', val: 'Hello' },
      { lang: 'French', val: 'Bonjour' },
    ],
  )
})

test('searches case insensitively', (t) => {
  const haystack = ['Abcd', 'a_bcd']

  t.deepEqual(
    fuzzy(haystack, 'abc').map((r) => r.item),
    ['Abcd', 'a_bcd'],
  )
  t.deepEqual(
    fuzzy(haystack, 'ABc').map((r) => r.item),
    ['Abcd', 'a_bcd'],
  )
})

test('searches multiple acceptable forms and matches the best form', (t) => {
  const haystack = [
    { primary: 'color', alternative: 'colour' },
    { primary: 'escalator', alternative: 'lift' },
    { primary: 'if', alternative: 'perhaps' },
  ]

  const results = fuzzy(haystack, 'if', (obj) => [obj.primary, obj.alternative])

  t.deepEqual(
    results.map((r) => r.item),
    [
      { primary: 'if', alternative: 'perhaps' },
      { primary: 'escalator', alternative: 'lift' },
    ],
  )

  t.deepEqual(
    results.map((r) => r.match),
    [
      { index: 0, indexes: [0, 1] },
      { index: 1, indexes: [1, 2] },
    ],
  )
})
