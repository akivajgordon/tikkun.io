import '/css/master.css'

import { page } from '@vitest/browser/context'
import {
  afterEach,
  beforeAll,
  beforeEach,
  expect,
  Mock,
  test,
  vi,
} from 'vitest'
import { LeiningGenerator } from './calendar-model/generator'
import { UserSettings } from './calendar-model/user-settings'
import { ScrollViewModel } from './view-model/scroll-view-model'
import { ScrollDisplay } from './components/ScrollDisplay'
import { ViewportTracker } from './viewport-tracker'
import { renderLine } from './view-model/test-utils'

const testSettings: UserSettings = {
  ashkenazi: true,
  includeModernHolidays: false,
  israel: false,
}

const generator = new LeiningGenerator(testSettings)

let root: HTMLDivElement
let vm: ScrollViewModel | null
let tracker: ViewportTracker | null
let eventHandler: Mock
let lastReportedRange: {
  first: string | null
  center: string | null
  last: string | null
}

let lineHeight: number

beforeAll(async () => {
  createRoot()
  await renderRun('2024-10-26:shacharis,main')
  const line = root.querySelector('tr')!
  lineHeight =
    line.nextElementSibling!.getBoundingClientRect().y -
    line.getBoundingClientRect().y
  root.remove()
})

beforeEach(() => {
  createRoot()
  vi.useFakeTimers()
  tracker = new ViewportTracker(root)
  tracker.on(
    'viewport-updated',
    (eventHandler = vi.fn((r) => {
      lastReportedRange = {
        first: renderLine(r.first),
        center: renderLine(r.center),
        last: renderLine(r.last),
      }
    }))
  )
})
afterEach(() => {
  document.body.removeChild(root)
  vm = null
  tracker = null
})

test('reports the initial viewport', async () => {
  // Render 2 lines around the center.
  await resize(5)
  await renderRun('2025-03-01:shacharis,main')
  expect(lastReportedRange).toEqual({
    first:
      ': וַיָּבֹ֥א מֹשֶׁ֛ה בְּת֥וֹךְ הֶעָנָ֖ן וַיַּ֣עַל אֶל־הָהָ֑ר וַיְהִ֤י מֹשֶׁה֙',
    center:
      'פרשת תרומה: וַיְדַבֵּ֥ר יְהֹוָ֖ה אֶל־מֹשֶׁ֥ה לֵּאמֹֽר׃ דַּבֵּר֙ אֶל־בְּנֵ֣י יִשְׂרָאֵ֔ל',
    last: ': תִּקְח֖וּ אֶת־תְּרוּמָתִֽי׃ וְזֹאת֙ הַתְּרוּמָ֔ה אֲשֶׁ֥ר תִּקְח֖וּ מֵאִתָּ֑ם',
  })
})

test('updates when scrolling down', async () => {
  // Render 2 lines around the center.
  await resize(5)
  await renderRun('2025-03-01:shacharis,main')

  await scrollRootBy(lineHeight)

  expect(lastReportedRange).toEqual({
    first: ': בָּהָ֔ר אַרְבָּעִ֣ים י֔וֹם וְאַרְבָּעִ֖ים לָֽיְלָה׃#(פ)',
    center:
      ': וְיִקְחוּ־לִ֖י תְּרוּמָ֑ה מֵאֵ֤ת כׇּל־אִישׁ֙ אֲשֶׁ֣ר יִדְּבֶ֣נּוּ לִבּ֔וֹ',
    last: ': זָהָ֥ב וָכֶ֖סֶף וּנְחֹֽשֶׁת׃ וּתְכֵ֧לֶת וְאַרְגָּמָ֛ן וְתוֹלַ֥עַת שָׁנִ֖י',
  })
})

test('sends no event when scrolling by partial lines', async () => {
  // Render 1.5 lines around the center.
  await resize(4)
  await renderRun('2025-03-01:shacharis,main')
  eventHandler.mockClear()

  await scrollRootBy(lineHeight / 2)
  expect(eventHandler).not.toBeCalled()
  await scrollRootBy(lineHeight / 2)
  expect(eventHandler).toBeCalled()
})

test('only reports fully-visible lines', async () => {
  // Render 1.5 lines around the center.
  await resize(4)
  await renderRun('2025-03-01:shacharis,main')
  expect(lastReportedRange).toEqual({
    first: ': בָּהָ֔ר אַרְבָּעִ֣ים י֔וֹם וְאַרְבָּעִ֖ים לָֽיְלָה׃#(פ)',
    center:
      'פרשת תרומה: וַיְדַבֵּ֥ר יְהֹוָ֖ה אֶל־מֹשֶׁ֥ה לֵּאמֹֽר׃ דַּבֵּר֙ אֶל־בְּנֵ֣י יִשְׂרָאֵ֔ל',
    last: ': וְיִקְחוּ־לִ֖י תְּרוּמָ֑ה מֵאֵ֤ת כׇּל־אִישׁ֙ אֲשֶׁ֣ר יִדְּבֶ֣נּוּ לִבּ֔וֹ',
  })
})

async function scrollRootBy(deltaY: number) {
  await vi.advanceTimersByTimeAsync(600) // Wait for the throttle
  root.scrollBy(0, deltaY)
  root.dispatchEvent(new Event('scroll'))
}

function createRoot() {
  root = document.createElement('div')
  root.className = 'tikkun-book mod-annotations-off'
  document.body.appendChild(root)
}

async function resize(lineCount: number) {
  await page.viewport(window.innerWidth, lineCount * lineHeight)
}

async function renderRun(runId: string) {
  vm = ScrollViewModel.forId(generator, runId)
  if (!vm) throw new Error(`ID ${runId} not found`)
  const sd = new ScrollDisplay(vm, root)
  await sd.scrolled
  return sd
}

