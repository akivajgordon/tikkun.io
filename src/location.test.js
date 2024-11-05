import test from 'ava'
import { loadScroll } from './location.ts'

test('page count for torah', async (t) => {
  const resolver = await loadScroll('torah')
  t.is(resolver.getPageCount(), 245)
})

test('Bereshit 1:1 starts on { page 1, line 1 }', async (t) => {
  const resolver = await loadScroll('torah')
  t.deepEqual(
    resolver.physicalLocationFromRef({ b: 1, c: 1, v: 1, scroll: 'torah' }),
    {
      pageNumber: 1,
      lineNumber: 1,
    }
  )
})

test('Noach starts on { page 6, line 32 }', async (t) => {
  const resolver = await loadScroll('torah')
  t.deepEqual(
    resolver.physicalLocationFromRef({ b: 1, c: 6, v: 9, scroll: 'torah' }),
    {
      pageNumber: 6,
      lineNumber: 32,
    }
  )
})
