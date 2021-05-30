import test from 'ava'
import { physicalLocationFromRef, resolveToValidRef } from './location'

test('Bereshit 1:1 starts on { page 1, line 1 }', t => {
  t.deepEqual(physicalLocationFromRef({ ref: { b: 1, c: 1, v: 1 }, scroll: 'torah' }), { pageNumber: 1, lineNumber: 1 })
})

test('Noach starts on { page 6, line 32 }', t => {
  t.deepEqual(physicalLocationFromRef({ ref: { b: 1, c: 6, v: 9 }, scroll: 'torah' }), { pageNumber: 6, lineNumber: 32 })
})

test('No params starts at Bereishit 1', t => {
  t.deepEqual(resolveToValidRef({}), { b: 1, c: 1, v: 1 })
})

test('Valid start location accepted', t => {
  t.deepEqual(resolveToValidRef({ book: '2', chapter: '20', verse: '2' }), { b: 2, c: 20, v: 2 })
})

test('Start location; no verse defaults to 1', t => {
  t.deepEqual(resolveToValidRef({ book: '2', chapter: '20' }), { b: 2, c: 20, v: 1 })
})

test('Start location; no chapter defaults to 1', t => {
  t.deepEqual(resolveToValidRef({ book: '2', verse: '5' }), { b: 2, c: 1, v: 5 })
})

test('Invalid book defaults to Bereishit', t => {
  t.deepEqual(resolveToValidRef({ book: 'Habakkuk' }), { b: 1, c: 1, v: 1 })
})

test('Invalid book number defaults to Bereishit', t => {
  t.deepEqual(resolveToValidRef({ book: '6' }), { b: 1, c: 1, v: 1 })
})

test('Invalid chapter defaults to 1', t => {
  t.deepEqual(resolveToValidRef({ book: '4', chapter: '999', verse: '5' }), { b: 4, c: 1, v: 5 })
})

test('Invalid verse defaults to 1', t => {
  t.deepEqual(resolveToValidRef({ book: '4', chapter: '10', verse: '999' }), { b: 4, c: 10, v: 1 })
})

test('Location selection unsupported yet for Esther', t => {
  t.deepEqual(resolveToValidRef({ scroll: 'esther', chapter: '11', verse: '2' }), { b: 1, c: 1, v: 1 })
})
