import { LeiningGenerator } from '../calendar-model/generator'
import type { UserSettings } from '../calendar-model/user-settings'
import { last } from '../calendar-model/utils'
import { ScrollViewModel } from '../view-model/scroll-view-model'
import { ScrollDisplay } from './ScrollDisplay'
import '/css/master.css'

import { afterEach, beforeEach, expect, test } from 'vitest'

const testSettings: UserSettings = {
  ashkenazi: true,
  includeModernHolidays: false,
  israel: false,
}

const generator = new LeiningGenerator(testSettings)

// TODO(later): Consider extracting this to a shared helper
let root: HTMLDivElement
let vm: ScrollViewModel

beforeEach(() => {
  root = document.createElement('div')
  root.className = 'tikkun-book mod-annotations-off'
  document.body.appendChild(root)
})
afterEach(() => {
  document.body.removeChild(root)
  vm = null
})

for (const testCase of [
  {
    name: 'at the top of the page',
    label: 'פרשת שלח־לך',
    runId: '2025-06-21:shacharis,main',
  },
  {
    name: 'near the top of the page',
    label: 'פרשת ויקהל',
    runId: '2025-03-22:shacharis,main',
  },
  {
    name: 'at the center of the page',
    label: 'פרשת נצבים',
    runId: '2025-09-20:shacharis,main',
  },
  {
    name: 'near the bottom of the page',
    label: 'פרשת תצוה',
    runId: '2025-03-08:shacharis,main',
  },
  {
    name: 'for the very first page',
    label: 'פרשת בראשית',
    runId: '2024-10-26:shacharis,main',
    // This label should appear at the top of the screen.
    expectedCoordinates: [document.body.clientWidth / 2, 48],
  },
] as const) {
  test(`centers the first line for ${testCase.label} ${testCase.name}`, async () => {
    await renderRun(testCase.runId)

    const elementAtCenter = document
      .elementFromPoint(
        ...(testCase.expectedCoordinates ??
          ([root.clientWidth / 2, root.clientHeight / 2] as const))
      )
      .closest('tr')

    expect(getAliyahLabel(elementAtCenter)).toBe(testCase.label)
  })
}

test('renders the next page', async () => {
  // פרשת ויקהל is near the bottom of the page, so we
  // will fetch the previous page, not the next page.
  const sd = await renderRun('2025-03-22:shacharis,main')

  expect(textFromLine(last(root.querySelectorAll('tr')))).toBe(
    'אשר נשא לבן אתנה בחכמה טוו את העזים'
  )
  await sd.renderNext(await vm.fetchNextPage())
  expect(textFromLine(last(root.querySelectorAll('tr')))).toBe(
    'השנית חמשים ללאת עשה ביריעה האחת'
  )
})

test('renders the previous page', async () => {
  // פרשת תצוה is near the bottom of the page, so we
  // will fetch the next page, not the previous page.
  const sd = await renderRun('2025-03-08:shacharis,main')

  expect(textFromLine(root.querySelector('tr'))).toBe(
    'ובין קדש הקדשים ונתת את הכפרת על ארון'
  )
  await sd.renderPrevious(await vm.fetchPreviousPage())
  expect(textFromLine(root.querySelector('tr'))).toBe(
    'ואת שש היריעת לבד וכפלת את היריעה'
  )
})

test('renders message entries', async () => {
  // ראש חודש חנוכה has a page, then a message, then one more page.
  const sd = await renderRun('2025-01-01:shacharis,main')

  expect(getAliyahLabel(root.firstElementChild.querySelector('tr'))).toBe(
    'חנוכה יום ז׳ (ראש חודש)'
  )
  await sd.renderNext(await vm.fetchNextPage())
  expect(root.lastElementChild?.textContent).toBe('✃ -29 עמודים ✁')
})

test('renders just one page', async () => {
  await renderRun('2024-11-01:shacharis,main')

  expect(getAliyahLabel(root.firstElementChild.querySelector('tr'))).toBe(
    'ראש חודש חשון'
  )
  expect(textFromLine(last(root.querySelectorAll('tr')))).toBe(
    'קדש יהיה לכם כל מלאכת עבדה לא תעשו'
  )
})

async function renderRun(runId: string) {
  vm = ScrollViewModel.forId(generator, runId)
  if (!vm) throw new Error(`ID ${runId} not found`)
  const sd = new ScrollDisplay(vm, root)
  await sd.scrolled
  return sd
}

function getAliyahLabel(lineEl: HTMLTableRowElement) {
  return lineEl.querySelector('[data-target-id="aliyot-range"]')?.textContent
}

function textFromLine(lineEl: HTMLTableRowElement) {
  return [...lineEl.querySelectorAll('.mod-annotations-off')]
    .map((e) => e.textContent)
    .join('\t')
}