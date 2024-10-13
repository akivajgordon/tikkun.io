/** @fileoverview This file tests both Aliyah labelling and run calculation in HolidayViewModel. */

import test from 'ava'
import { LeiningGenerator } from './generator.ts'
import { UserSettings } from './user-settings.ts'
import { RenderedEntry, ScrollViewModel } from './scroll-view-model.ts'
import { renderLine } from './test-utils.ts'

const testSettings: UserSettings = {
  ashkenazi: true,
  includeModernHolidays: false,
  israel: false,
}

const generator = new LeiningGenerator(testSettings)

test(`יום כיפור on שבת`, async (t) => {
  t.snapshot(await dumpAliyot('2024-10-12:shacharis,main'))
})

test(`חול המוד סוכות`, async (t) => {
  t.snapshot(await dumpAliyot('2024-10-20:shacharis,main'))
})

test(`שמחת תורה`, async (t) => {
  t.snapshot(await dumpAliyot('2024-10-25:shacharis,main'))
})

test(`תענית ציבור`, async (t) => {
  t.snapshot(await dumpAliyot('2025-03-13:mincha,main'))
})

test(`פרשת האזינו`, async (t) => {
  t.snapshot(await dumpAliyot('2024-10-05:shacharis,main'))
})

test(`חנוכה`, async (t) => {
  t.snapshot(await dumpAliyot('2024-12-26:shacharis,main'))
})

test(`ראש חודש חנוכה`, async (t) => {
  t.snapshot(await dumpAliyot('2024-12-31:shacharis,main'))
})

test(`שקלים / ראש חודש as פרשה`, async (t) => {
  // Fetch the main run so that we get a FullScrollViewModel
  t.snapshot(await dumpAliyot('2025-03-01:shacharis,main'))
})

test(`Weekday ראש חודש`, async (t) => {
  t.snapshot(await dumpAliyot('2025-02-28:shacharis,main'))
})

test(`אסתר`, async (t) => {
  t.snapshot(await dumpAliyot('2025-03-14:megillah,megillah'))
})

test(`שקלים / ראש חודש as מפטיר`, async (t) => {
  // Fetch a non-main run so that we get a HolidayViewModel
  t.snapshot(await dumpAliyot('2025-03-01:shacharis,maftir'))
})

/** Formats the עלייה-labelled lines from a ScrollViewModel to read in the snapshot. */
async function dumpAliyot(runId: string) {
  const model = ScrollViewModel.forId(generator, runId)
  if (!model) throw new Error(`ID ${runId} not found`)

  const pages: RenderedEntry[] = [(await model.startingLocation).page]
  const targetDate = generator.parseId(runId)!.leining.date

  // If this is a HolidayViewModel, fetch the previous runs as well.
  if (model.relevantRuns.length < 10) {
    while (true) {
      const previousPage = await model.fetchPreviousPage()
      if (!previousPage) break
      pages.unshift(previousPage)
    }
  }

  while (true) {
    const nextPage = await model.fetchNextPage()
    if (!nextPage) break

    if (nextPage.type === 'page') {
      // If a page does not have a run, keep going
      // (pass over the skipped page for תענית ציבור).
      const nextPageRun = nextPage.run?.leining.date ?? targetDate
      if (nextPageRun.date > targetDate.date) break
    }
    pages.push(nextPage)
  }

  return pages.flatMap((e) => {
    if (e.type === 'message') return [e.text]
    return e.lines.filter((line) => line.labels.length).map(renderLine)
  })
}
