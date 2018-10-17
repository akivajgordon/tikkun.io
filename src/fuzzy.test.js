import test from 'ava'

const fuzzy = require('./fuzzy')

const stringOnly = ({ string }) => string

test('only matches if all characters are present in order', t => {
  const haystack = ['matches', 'tam', 'nope', 'no chance', 'walmart', 'mta', 'amazing time', 'nothing']

  const results = fuzzy(haystack, 'mat')
  const matches = ['matches', 'walmart', 'amazing time']

  t.true(matches.every(match => results.map(stringOnly).includes(match)))
  t.is(results.length, matches.length)
})

test('prioritizes matches that are closer together (all same-length strings)', t => {
  const haystack = ['a_b_c', 'a_bc_', 'a__bc', 'abc__', 'ab_c_', 'ab__c']

  const results = fuzzy(haystack, 'abc')
  const matches = ['abc__', 'ab_c_', 'a_bc_', 'ab__c', 'a_b_c', 'a__bc']

  t.deepEqual(results.map(stringOnly), matches)
})

test('prioritizes matches that are closer to the start of the string', t => {
  const haystack = ['a_bc_', '_abc_', '__abc', '_ab_c_', 'abc__', 'a__bc']

  const results = fuzzy(haystack, 'abc')
  const matches = ['abc__', '_abc_', '__abc', '_ab_c_', 'a_bc_', 'a__bc']

  t.deepEqual(results.map(stringOnly), matches)
})

test('returns the match indexes', t => {
  const haystack = ['c_d_ef__', '__cd_ef']

  const results = fuzzy(haystack, 'cdef')

  t.deepEqual(results.map(({ indexes }) => indexes), [
    [2, 3, 5, 6],
    [0, 2, 4, 5]
  ])
})
