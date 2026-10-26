import test from 'ava'
import { formatRef, pageVerseRange } from './verse-labels.ts'

test('formatRef uses book abbreviations', (t) => {
  t.is(formatRef('torah', { b: 5, c: 22, v: 1 }), 'Deut 22:1')
  t.is(formatRef('esther', { b: 1, c: 3, v: 4 }), 'Esth 3:4')
})

test('pageVerseRange spans the verses beginning on the page', (t) => {
  const line = (...verses: [number, number][]) => ({
    verses: verses.map(([c, v]) => ({ b: 1, c, v })),
  })
  t.deepEqual(
    pageVerseRange({
      lines: [line(), line([1, 3]), line([1, 4], [1, 5]), line()],
    } as never),
    { start: { b: 1, c: 1, v: 3 }, end: { b: 1, c: 1, v: 5 } }
  )
  t.is(pageVerseRange({ lines: [line()] } as never), null)
})
