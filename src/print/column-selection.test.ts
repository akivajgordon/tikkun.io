import test from 'ava'
import { selectEdge } from './column-selection.ts'

test('clicking beyond an edge extends that side', (t) => {
  t.deepEqual(selectEdge({ first: 5, last: 6 }, 5, 9), { first: 5, last: 9 })
  t.deepEqual(selectEdge({ first: 5, last: 6 }, 6, 3), { first: 3, last: 6 })
})

test('clicking inside an edge shrinks that side to the click', (t) => {
  t.deepEqual(selectEdge({ first: 3, last: 10 }, 6, 4), { first: 4, last: 10 })
  t.deepEqual(selectEdge({ first: 3, last: 10 }, 6, 8), { first: 3, last: 8 })
  t.deepEqual(selectEdge({ first: 3, last: 10 }, 6, 7), { first: 3, last: 7 })
})

test('clicking the anchor resets to just the anchor', (t) => {
  t.deepEqual(selectEdge({ first: 3, last: 10 }, 6, 6), { first: 6, last: 6 })
})
