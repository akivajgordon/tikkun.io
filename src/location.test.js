import test from 'ava'
import physicalLocationFromRef from './location'

test('Bereshit 1:1 starts on { page 1, line 1 }', t => {
  t.deepEqual(physicalLocationFromRef({ ref: { b: 1, c: 1, v: 1 }, scroll: 'torah' }), { pageNumber: 1, lineNumber: 1 })
})

test('Noach starts on { page 6, line 32 }', t => {
  t.deepEqual(physicalLocationFromRef({ ref: { b: 1, c: 6, v: 9 }, scroll: 'torah' }), { pageNumber: 6, lineNumber: 32 })
})
