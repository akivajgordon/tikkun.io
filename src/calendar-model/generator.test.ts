import test from 'ava'
import { UserSettings } from './user-settings.ts'
import { LeiningGenerator } from './generator.ts'
import { flags, HDate, HebrewCalendar, Locale, months } from '@hebcal/core'
import { LeiningAliyah, LeiningDate, LeiningRun } from './model-types.ts'
import hebrewNumeralFromInteger from '../hebrew-numeral.ts'
import { Ref } from '../ref.ts'
import { getBookName } from './hebcal-conversions.ts'
import { last, toISODateString } from './utils.ts'

const testSettings: UserSettings = {
  ashkenazi: true,
  includeModernHolidays: false,
  israel: false,
}

const generator = new LeiningGenerator(testSettings)

for (let year = 5780; year < 5790; year++) {
  test(`runs round-trip via ID for ${year}`, (t) => {
    const calendar = generator.forHebrewYear(year)
    calendar
      .flatMap((d) => d.leinings)
      .flatMap((o) => o.runs)
      .forEach((run) => {
        const parsed = generator.parseId(run.id)

        // Only compare the full objects if they summary is equal.
        // This gives better error messages.
        t.deepEqual(
          dumpLeiningRun(parsed),
          dumpLeiningRun(run),
          `Parsed ${run.id}`
        )
        t.deepEqual(parsed, run, `Parsed ${run.id}`)
      })
  })
}

const fourParshaDescriptions = [
  'Shabbat Shekalim',
  'Shabbat Zachor',
  'Shabbat Parah',
  'Shabbat HaChodesh',
]
test('4 פרשיות always get separate runs', (t) => {
  for (const d of HebrewCalendar.calendar({
    year: 5785,
    numYears: 20,
    isHebrewYear: true,
    mask: flags.SPECIAL_SHABBAT,
  })) {
    if (!fourParshaDescriptions.includes(d.desc)) continue
    const isRoshChodesh = [1, 30].includes(d.date.getDate())
    const run = generator.parseId(
      `${toISODateString(d.date.greg())}:shacharis,maftir`
    )
    t.true(run?.leining.isParsha)
    t.is(run?.leining.runs.length, isRoshChodesh ? 4 : 3, run?.id)
  }
})

const testForEntireChumash = test.macro({
  async exec(t, date: HDate) {
    const dates = generator.forEntireChumash(date)
    t.is(dates[0].title, 'פרשת בראשית')
    t.is(last(dates).title, 'שמחת תורה')
    t.true(
      dates.some((d) => d.date.toDateString() === date.greg().toDateString())
    )
  },
  title(providedTitle, date) {
    return `forEntireChumash returns everything from בראשית to שמחת תורה ${providedTitle} on ${date}`
  },
})

test('before סוכות', testForEntireChumash, new HDate(1, months.TISHREI, 5785))
test(
  'on פרשת בראשית',
  testForEntireChumash,
  new HDate(24, months.TISHREI, 5785)
)
test(
  'after פרשת בראשית',
  testForEntireChumash,
  new HDate(30, months.TISHREI, 5785)
)

test('generates יום כיפור', (t) => {
  t.snapshot(
    dumpLeiningDate(new HDate(10, months.TISHREI, 5784)),
    'These tests verify the returned information, in easily readable format'
  )
})

test('generates שמחת תורה', (t) => {
  t.snapshot(dumpLeiningDate(new HDate(23, months.TISHREI, 5784)))
})

test('generates תענית אסתר', (t) => {
  t.snapshot(dumpLeiningDate(new HDate(13, months.ADAR_II, 5785)))
})

test('generates פורים', (t) => {
  t.snapshot(dumpLeiningDate(new HDate(14, months.ADAR_II, 5784)))
})

test('generates ערב תשעה באב', (t) => {
  t.snapshot(dumpLeiningDate(new HDate(8, months.AV, 5784)))
})

test('generates תשעה באב', (t) => {
  t.snapshot(dumpLeiningDate(new HDate(9, months.AV, 5784)))
})

test('generates שבת ראש חודש חנוכה', (t) => {
  t.snapshot(dumpLeiningDate(new HDate(30, months.KISLEV, 5782)))
})

test('generates ראש חודש חנוכה', (t) => {
  t.snapshot(dumpLeiningDate(new HDate(30, months.KISLEV, 5787)))
})

test('generates leinings surrounding פרשת וירא', (t) => {
  const results = generator.aroundDate(new Date(2024, 10, 16))
  t.snapshot(results.map((ld) => `${ld.id}: ${ld.title}`))
})

test('generates leinings surrounding שבת שובה', (t) => {
  const results = generator.aroundDate(new Date(2024, 9, 5))
  t.snapshot(results.map((ld) => `${ld.id}: ${ld.title}`))
})

/** Prints the information in a `LeiningDate`, to be easily readable in the Markdown snapshot. */
function dumpLeiningDate(date: HDate) {
  const ld = generator.createLeiningDate(date)
  if (!ld) return null
  if (new Set(ld.leinings.map((o) => o.id)).size !== ld.leinings.length)
    throw new Error(`${ld.id} (${ld.title}) has duplicate leinings!`)
  return {
    date: ld.id,
    title: ld.title,
    leinings: ld.leinings.map((o) => ({
      isParsha: o.isParsha,
      runs: o.runs.map(dumpLeiningRun),
    })),
  }
}
function dumpLeiningRun(r: LeiningRun | null) {
  if (!r) return r
  return {
    id: r.id,
    type: r.type,
    scroll: r.scroll,
    aliyot: r.aliyot.map(
      (a) =>
        `${a.index}: ${bookName(a)} ${dumpRef(a.start)} - ${dumpRef(a.end)}`
    ),
  }
}

function bookName(a: LeiningAliyah) {
  return Locale.gettext(getBookName(a.start), 'he-x-nonikud')
}

function dumpRef(ref: Ref) {
  return `${hebrewNumeralFromInteger(ref.c)}:${hebrewNumeralFromInteger(ref.v)}`
}

test('generates the full LeiningDate object for יום כיפור', (t) => {
  t.snapshot(
    stripDate(generator.createLeiningDate(new HDate(10, months.TISHREI, 5784))),
    'This test verified the full structure of the LeiningDate interface'
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
