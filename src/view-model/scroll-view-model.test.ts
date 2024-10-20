import test, { ExecutionContext } from 'ava'
import { LeiningGenerator } from '../calendar-model/generator.ts'
import { UserSettings } from '../calendar-model/user-settings.ts'
import {
  RenderedEntry,
  RenderedLineInfo,
  ScrollViewModel,
} from './scroll-view-model.ts'
import { last } from '../calendar-model/utils.ts'
import { renderLine } from './test-utils.ts'
import { containsRef } from '../calendar-model/ref-utils.ts'

const testSettings: UserSettings = {
  ashkenazi: true,
  includeModernHolidays: false,
  israel: false,
}

const generator = new LeiningGenerator(testSettings)

// Note: We cover the runs included in HolidayViewModel in aliyah-labeller.test.ts
// This also includes fetchPreviousPage() and fetchNextPage()

test('selects first line of ראש השנה', async (t) => {
  t.snapshot(await renderFirstLine('2024-10-04:shacharis,main'))
})
test('selects first line of פרשת האזינו', async (t) => {
  t.snapshot(await renderFirstLine('2024-10-05:shacharis,main'))
})
test('selects first line of פרשת בראשית', async (t) => {
  t.snapshot(await renderFirstLine('2024-10-26:shacharis,main'))
})
test('selects first line of פרשת ויחי', async (t) => {
  t.snapshot(await renderFirstLine('2025-01-11:shacharis,main'))
})

test('forDate on שבת', async (t) => {
  t.deepEqual(
    await renderScroll(
      ScrollViewModel.forId(generator, '2025-01-11:shacharis,main')
    ),
    await renderScroll(
      ScrollViewModel.forDate(generator, new Date(2025, 0, 11))
    )
  )
})
test('forDate before שבת', async (t) => {
  t.deepEqual(
    await renderScroll(
      ScrollViewModel.forId(generator, '2025-01-18:shacharis,main')
    ),
    await renderScroll(
      ScrollViewModel.forDate(generator, new Date(2025, 0, 14))
    )
  )
})

test('forDate on צום גדליה', async (t) => {
  t.deepEqual(
    await renderScroll(
      ScrollViewModel.forId(generator, '2024-10-06:shacharis,main')
    ),
    await renderScroll(ScrollViewModel.forDate(generator, new Date(2024, 9, 6)))
  )
})

// TODO(haftara): Enable after this can read איכה.
test.skip('forDate before תשעה באב', async (t) => {
  t.deepEqual(
    await renderScroll(
      ScrollViewModel.forId(generator, '2024-8-13:shacharis,main')
    ),
    await renderScroll(
      ScrollViewModel.forDate(generator, new Date(2024, 7, 11))
    )
  )
})

test('forDate on סוכות', async (t) => {
  t.deepEqual(
    await renderScroll(
      ScrollViewModel.forId(generator, '2024-10-17:shacharis,main')
    ),
    await renderScroll(
      ScrollViewModel.forDate(generator, new Date(2024, 9, 17))
    )
  )
})
test('forDate before סוכות', async (t) => {
  t.deepEqual(
    await renderScroll(
      ScrollViewModel.forId(generator, '2024-10-17:shacharis,main')
    ),
    await renderScroll(
      ScrollViewModel.forDate(generator, new Date(2024, 9, 13))
    )
  )
})

test('assigns a run and aliyah to every verse in full torah', async (t) => {
  // Start from a random regular פרשה, in a Hebrew calendar year that does
  // not contain וילך.
  const model = ScrollViewModel.forId(generator, '2025-05-24:shacharis,main')

  const pages = await fetchPages(model, {
    fetchPreviousPages: false,
    count: 500,
  })

  for (const page of pages) {
    if (page.type !== 'page')
      throw new Error(`Unexpected message "${page.text}" in plain חומש`)
    for (const line of page.lines) {
      // Lines that continue the previous page's פסוק are unlabelled.
      // This is fine.
      if (!line.verses.length) continue
      const message = renderLine(line)
      t.truthy(line.run, message)
      t.notDeepEqual(line.aliyot, [], message)
      t.truthy(
        line.aliyot.every((a) => containsRef(a, line.verses)),
        `Aliyot ${dumpAliyot(line)} don't match line ${message}`
      )
      t.truthy(line.aliyot.every((a) => line.run?.aliyot.includes(a)))
    }
  }
})

test('includes context in בראשית', async (t) => {
  const runId = '2024-10-26:shacharis,main'
  const model = ScrollViewModel.forId(generator, runId)
  // This is rendering src/data/pages/torah/1.json.
  const pages = await fetchPages(model, { fetchPreviousPages: false, count: 6 })
  if (pages?.[0].type !== 'page') throw new Error('First page should be a page')

  // First line begins a פסוק and עלייה.
  t.deepEqual(dumpContext(t, pages[0].lines[0]), runId)
  t.deepEqual(dumpAliyot(pages[0].lines[0]), [1])
  // Second line begins a פסוק but not an עלייה.
  t.deepEqual(dumpContext(t, pages[0].lines[1]), runId)
  t.deepEqual(dumpAliyot(pages[0].lines[1]), [1])

  // This line is entirely within a פסוק.
  t.deepEqual(pages[0].lines[5].verses, [])
  t.deepEqual(dumpContext(t, pages[0].lines[5]), runId)
  t.deepEqual(dumpAliyot(pages[0].lines[5]), [1])

  // This is rendering src/data/pages/torah/6.json.
  const maftir = pages[5]
  for (const line of getLinesInRange(maftir, { first: '5:25', until: '6:5' })) {
    t.deepEqual(dumpContext(t, line), runId, renderLine(line))
    t.deepEqual(dumpAliyot(line), [7], renderLine(line))
  }
  for (const line of getLinesInRange(maftir, { first: '6:5', until: '6:9' })) {
    t.deepEqual(dumpContext(t, line), runId, renderLine(line))
    t.deepEqual(dumpAliyot(line), [7, 'Maftir'], renderLine(line))
  }
})

test('includes context in ראש השנה', async (t) => {
  let runId = '2024-10-03:shacharis,main'
  const model = ScrollViewModel.forId(generator, runId)

  // This is rendering src/data/pages/torah/20.json.
  const pages = await fetchPages(model, { fetchPreviousPages: false, count: 9 })

  getLinesInRange(pages[0], {
    first: null,
    until: '21:1',
  }).forEach(assertNoRun)
  getLinesInRange(pages[0], {
    first: '21:1',
    until: null,
  }).forEach(assertLineInRun)

  if (pages[1].type !== 'page') throw new Error('Second page should be a page')
  pages[1].lines.forEach(assertLineInRun)

  getLinesInRange(pages[2], {
    first: null,
    until: '22:1',
  }).forEach(assertLineInRun)
  getLinesInRange(pages[2], {
    first: '22:1',
    until: null,
  }).forEach(assertNoRun)

  // Set the variable used by assertLineInRun().
  runId = '2024-10-03:shacharis,maftir'
  const maftirPage = last(pages)

  getLinesInRange(maftirPage, {
    first: null,
    until: '29:1',
  }).forEach(assertNoRun)
  getLinesInRange(maftirPage, {
    first: '29:1',
    until: '29:7',
  }).forEach(assertLineInRun)
  getLinesInRange(maftirPage, {
    first: '29:7',
    until: null,
  }).forEach(assertNoRun)

  function assertLineInRun(line: RenderedLineInfo) {
    t.deepEqual(dumpContext(t, line), runId, renderLine(line))
  }
  function assertNoRun(line: RenderedLineInfo) {
    t.falsy(line.run, renderLine(line))
  }
})

test('includes context in תענית ציבור', async (t) => {
  const runId = '2024-10-06:shacharis,main'
  const model = ScrollViewModel.forId(generator, runId)

  // This is rendering src/data/pages/torah/99.json.
  const pages = await fetchPages(model, { fetchPreviousPages: false, count: 9 })
  t.is(pages.length, 3)

  getLinesInRange(pages[0], {
    first: null,
    until: '32:11',
  }).forEach(assertNoRun)
  getLinesInRange(pages[0], {
    first: '32:11',
    until: '32:15',
  }).forEach(assertLineInRun)
  getLinesInRange(pages[0], {
    first: '32:15',
    until: null,
  }).forEach(assertNoRun)

  if (pages[1].type !== 'page') throw new Error('Second page should be a page')
  pages[1].lines.forEach(assertNoRun)

  getLinesInRange(pages[2], {
    first: null,
    until: '34:1',
  }).forEach(assertNoRun)
  getLinesInRange(pages[2], {
    first: '34:1',
    until: null, // The last עלייה ends at the end of the page.
  }).forEach(assertLineInRun)

  function assertLineInRun(line: RenderedLineInfo) {
    t.deepEqual(dumpContext(t, line), runId, renderLine(line))
  }
  function assertNoRun(line: RenderedLineInfo) {
    t.falsy(line.run, renderLine(line))
  }
})

function dumpAliyot(line: RenderedLineInfo) {
  return line.aliyot.map((a) => a.index)
}

function dumpContext(t: ExecutionContext, line: RenderedLineInfo) {
  if (!line.run) return null
  if (line.verses.length) {
    t.true(
      line.verses.some((v) => containsRef(line.run!, v)),
      `Line "${renderLine(line)} is not in run "${line.run!.id}"`
    )
    t.notDeepEqual(line.aliyot, [])
    t.true(line.aliyot.every((a) => containsRef(a, line.verses)))
  }

  return line.run.id
}

/**
 * Gets all lines between the line at which the first פסוק begins
 * and the line at which the last פסוק begins.  This includes the
 * line that begins the first פסוק, and will NOT include the line
 * that begins the `until` פסוק.
 *
 * Pass null to include all lines from/until the top/bottom of the
 * page.
 */
function getLinesInRange(
  page: RenderedEntry,
  range: { first: string | null; until: string | null }
): RenderedLineInfo[] {
  if (page.type !== 'page')
    throw new Error(`Cannot get lines from message ${page.text}`)
  const first = range.first?.split(':').map(Number)
  const until = range.until?.split(':').map(Number)
  if (!first && !until) throw new Error('Please pass a range')

  const results: RenderedLineInfo[] = []
  let foundFirst = !first
  for (const line of page.lines) {
    if (!foundFirst && lineContains(line, first)) foundFirst = true

    if (!foundFirst) continue

    if (lineContains(line, until)) break
    results.push(line)
  }
  if (!results.length) throw new Error('Found no lines')
  return results
}

function lineContains(line: RenderedLineInfo, range: number[] | undefined) {
  if (!range) return false
  return line.verses.some(({ c, v }) => c === range[0] && v === range[1])
}

async function fetchPages(
  model: ScrollViewModel | null,
  { count, fetchPreviousPages }: { count: number; fetchPreviousPages: boolean }
): Promise<RenderedEntry[]> {
  if (!model) throw new Error('No model')
  const pages: RenderedEntry[] = [(await model.startingLocation).page]

  if (fetchPreviousPages) count /= 2
  for (let i = 0; i < count; i++) {
    const previousPage = await model.fetchPreviousPage()
    if (previousPage) pages.unshift(previousPage)
    const nextPage = await model.fetchNextPage()
    if (nextPage) pages.push(nextPage)
  }
  return pages
}

/** Renders enough properties of a scroll to make `deepEqual()` work with useful failures. */
async function renderScroll(model: ScrollViewModel | null) {
  return (
    await fetchPages(model, { count: 10, fetchPreviousPages: true })
  )?.map((e) => {
    if (e.type === 'message') return e.text
    return renderLine(e.lines[0])
  })
}

async function renderFirstLine(runId: string) {
  const model = ScrollViewModel.forId(generator, runId)
  if (!model) throw new Error(`ID ${runId} not found`)

  const { page, lineNumber } = await model.startingLocation
  if (page.type !== 'page') throw new Error('First page should be a page')
  return renderLine(page.lines[lineNumber - 1])
}
