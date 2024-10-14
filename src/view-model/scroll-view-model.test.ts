import test from 'ava'
import { LeiningGenerator } from '../calendar-model/generator.ts'
import { UserSettings } from '../calendar-model/user-settings.ts'
import { RenderedEntry, ScrollViewModel } from './scroll-view-model.ts'
import { renderLine } from './test-utils.ts'

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

/** Renders enough properties of a scroll to make `deepEqual()` work with useful failures. */
async function renderScroll(model: ScrollViewModel | null) {
  if (!model) return model
  const pages: RenderedEntry[] = [(await model.startingLocation).page]

  // Render 5 pages on each side of the start.
  for (let i = 0; i < 5; i++) {
    const previousPage = await model.fetchPreviousPage()
    if (previousPage) pages.unshift(previousPage)
    const nextPage = await model.fetchNextPage()
    if (nextPage) pages.push(nextPage)
  }

  return pages.map((e) => {
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
