import test from 'ava'
import urlToRef from './url-to-ref'

const BEREISHIT_1 = { scroll: 'torah', b: 1, c: 1, v: 1 }

const url = afterHost => `https://tikkun.io${afterHost}`

test('non-URL input', t => {
  t.deepEqual(urlToRef('hello world'), BEREISHIT_1)
})

test('URL with no hash part', t => {
  t.deepEqual(urlToRef(url('/foo/bar?baz=quux')), BEREISHIT_1)
})

test('URL with nothing after the hash', t => {
  t.deepEqual(urlToRef(url('/#')), BEREISHIT_1)
})

test('Only /r supported', t => {
  t.deepEqual(urlToRef(url('/#/kav/tzav')), BEREISHIT_1)
})

test('Invalid location reference: Not numbers', t => {
  t.deepEqual(urlToRef(url('/#/r/foo-bar-baz')), BEREISHIT_1)
})

test('Invalid location reference: incomplete', t => {
  t.deepEqual(urlToRef(url('/#/r/5-22')), BEREISHIT_1)
})

test('Valid location reference', t => {
  t.deepEqual(urlToRef(url('/#/r/4-13-1')), { scroll: 'torah', b: 4, c: 13, v: 1 })
})

test('Trailing slash okay', t => {
  t.deepEqual(urlToRef(url('/#/r/4-13-1/')), { scroll: 'torah', b: 4, c: 13, v: 1 })
})

test('Location references default to 1 if out of bounds', t => {
  t.deepEqual(urlToRef(url('/#/r/4-999-99/')), { scroll: 'torah', b: 4, c: 1, v: 1 })
})

test('accepts parsha input with hebrew name', t => {
  t.deepEqual(urlToRef(url('/#/p/נשא')), { scroll: 'torah', b: 4, c: 4, v: 21 })
})

test('accepts parsha input with lowercase english name', t => {
  t.deepEqual(urlToRef(url('/#/p/emor')), { scroll: 'torah', b: 3, c: 21, v: 1 })
})

test(`accepts parsha input ignoring non-alphanumeric characters in english (to allow, e.g. shlach for the parsha "Sh'lach")`, t => {
  t.deepEqual(urlToRef(url('/#/p/shlach')), { scroll: 'torah', b: 4, c: 13, v: 1 })
})

test(`accepts parsha input without spaces in english (to allow, e.g. ki-tavo for the parsha "Ki Tavo")`, t => {
  t.deepEqual(urlToRef(url('/#/p/ki-tavo')), { scroll: 'torah', b: 5, c: 26, v: 1 })
})

test('returns default ref for non-existant parsha (hebrew)', t => {
  t.deepEqual(urlToRef(url('/#/p/לא-פרשה')), BEREISHIT_1)
})

test('returns default ref for non-existant parsha (english)', t => {
  t.deepEqual(urlToRef(url('/#/p/not-a-parsha')), BEREISHIT_1)
})
