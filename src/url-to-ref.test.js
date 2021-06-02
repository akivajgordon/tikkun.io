import test from 'ava'
import urlToRef from './url-to-ref'

const BEREISHIT_1 = { b: 1, c: 1, v: 1 }

test('non-URL input', t => {
  t.deepEqual(urlToRef('https://not-an-url.org/#/r/5-6-7'), BEREISHIT_1)
})

test('URL with no hash part', t => {
  t.deepEqual(urlToRef(new URL('https://tikkun.io/foo/bar?baz=quux')), BEREISHIT_1)
})

test('URL with nothing after the hash', t => {
  t.deepEqual(urlToRef(new URL('https://tikkun.io/#')), BEREISHIT_1)
})

test('Only /r supported', t => {
  t.deepEqual(urlToRef(new URL('https://tikkun.io/#/kav/tzav')), BEREISHIT_1)
})

test('Invalid location reference: Not numbers', t => {
  t.deepEqual(urlToRef(new URL('https://tikkun.io/#/r/foo-bar-baz')), BEREISHIT_1)
})

test('Invalid location reference: incomplete', t => {
  t.deepEqual(urlToRef(new URL('https://tikkun.io/#/r/5-22')), BEREISHIT_1)
})

test('Valid location reference', t => {
  t.deepEqual(urlToRef(new URL('https://tikkun.io/#/r/4-13-1')), { b: 4, c: 13, v: 1 })
})

test('Trailing slash okay', t => {
  t.deepEqual(urlToRef(new URL('https://tikkun.io/#/r/4-13-1/')), { b: 4, c: 13, v: 1 })
})

test('Location references default to 1 if out of bounds', t => {
  t.deepEqual(urlToRef(new URL('https://tikkun.io/#/r/4-999-99/')), { b: 4, c: 1, v: 1 })
})
