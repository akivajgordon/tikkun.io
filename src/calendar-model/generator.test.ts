import test from 'ava'
import { UserSettings } from './user-settings.ts'
import { LeiningGenerator } from './generator.ts'
import { HDate, months } from '@hebcal/core'
import { LeiningDate } from './model-types.ts'

const testSettings: UserSettings = {
  ashkenazi: true,
  includeModernHolidays: false,
  israel: false,
}

const generator = new LeiningGenerator(testSettings)

for (let year = 5780; year < 5800; year++) {
  test(`runs round-trip via ID for ${year}`, (t) => {
    const calendar = generator.generateCalendar(year)
    calendar
      .flatMap((d) => d.leinings)
      .flatMap((o) => o.runs)
      .forEach((run) => {
        t.deepEqual(generator.parseId(run.id), run, `Parsed ${run.id}`)
      })
  })
}

test('generates יום כיפור', (t) => {
  t.snapshot(
    stripDate(generator.createLeiningDate(new HDate(10, months.TISHREI, 5784)))
  )
})

test('generates שמחת תורה', (t) => {
  t.snapshot(
    stripDate(generator.createLeiningDate(new HDate(23, months.TISHREI, 5784)))
  )
})

test('generates תענית אסתר', (t) => {
  t.snapshot(
    stripDate(generator.createLeiningDate(new HDate(13, months.ADAR_II, 5785)))
  )
})

test('generates פורים', (t) => {
  t.snapshot(
    stripDate(generator.createLeiningDate(new HDate(14, months.ADAR_II, 5784)))
  )
})

test('generates ערב תשעה באב', (t) => {
  t.snapshot(
    stripDate(generator.createLeiningDate(new HDate(8, months.AV, 5784)))
  )
})

test('generates תשעה באב', (t) => {
  t.snapshot(
    stripDate(generator.createLeiningDate(new HDate(9, months.AV, 5784)))
  )
})

test('generates שבת ראש חודש חנוכה', (t) => {
  t.snapshot(
    stripDate(generator.createLeiningDate(new HDate(30, months.KISLEV, 5782)))
  )
})

/**
 * Removes the `date` property, which is time-zone dependent.
 * This makes the recorded snapshot consistent across timezones.
 * You can see the date from the `id` property.
 */
function stripDate(
  o: (Omit<LeiningDate, 'date'> & { date?: Date }) | null
): unknown {
  if (!o) return o
  delete o.date
  return o
}
