import test from 'ava'
import { UserSettings } from './user-settings.ts'
import { LeiningGenerator } from './generator.ts'
import { HDate, months } from '@hebcal/core'
const testSettings: UserSettings = {
  ashkenazi: true,
  includeModernHolidays: false,
  israel: false,
}

const generator = new LeiningGenerator(testSettings)

for (let year = 5783; year < 5784; year++) {
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
  t.snapshot(generator.createLeiningDate(new HDate(10, months.TISHREI, 5784)))
})

test('generates שמחת תורה', (t) => {
  t.snapshot(generator.createLeiningDate(new HDate(23, months.TISHREI, 5784)))
})

test('generates פורים', (t) => {
  t.snapshot(generator.createLeiningDate(new HDate(14, months.ADAR_II, 5784)))
})

test('generates תשעה באב', (t) => {
  t.snapshot(generator.createLeiningDate(new HDate(9, months.AV, 5784)))
})
