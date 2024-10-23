import {
  CalOptions,
  flags,
  HDate,
  HebrewCalendar,
  Locale,
  months,
} from '@hebcal/core'
import {
  LeiningAliyah,
  LeiningDate,
  LeiningInstance,
  LeiningInstanceId,
  LeiningRun,
  LeiningRunType,
} from './model-types.ts'
import { UserSettings } from './user-settings.ts'
import {
  Aliyah,
  AliyotMap,
  getLeyningOnDate,
  LeyningBase,
  LeyningParshaHaShavua,
  LeyningShabbatHoliday,
} from '@hebcal/leyning'
import {
  invert,
  fromISODateString,
  toISODateString,
  last,
  arrayEquals,
} from './utils.ts'
import { toLeiningAliyah, toAliyahIndex } from './hebcal-conversions.ts'
import { isSameRun } from './ref-utils.ts'

export function isSameLeiningDate(a: LeiningDate, b: LeiningDate) {
  return arrayEquals(a.leinings, b.leinings, isSameLeiningInstance)
}
export function isSameLeiningInstance(a: LeiningInstance, b: LeiningInstance) {
  return arrayEquals(a.runs, b.runs, isSameLeiningRun)
}
export function isSameLeiningRun(a: LeiningRun, b: LeiningRun) {
  return arrayEquals(
    a.aliyot,
    b.aliyot,
    (a, b) => JSON.stringify(a) === JSON.stringify(b)
  )
}

type PartialLeiningRun = Omit<LeiningRun, 'id' | 'scroll' | 'leining'>

const instanceIdtoUrlParam: Record<LeiningInstanceId, string> = {
  [LeiningInstanceId.Megillah]: 'megillah',
  [LeiningInstanceId.Shacharis]: 'shacharis',
  [LeiningInstanceId.Mincha]: 'mincha',
  [LeiningInstanceId.Maariv]: 'maariv',
}
const runTypetoUrlParam: Record<LeiningRunType, string> = {
  [LeiningRunType.Main]: 'main',
  [LeiningRunType.LastAliyah]: 'last-aliyah',
  [LeiningRunType.Maftir]: 'maftir',
  [LeiningRunType.Haftarah]: 'haftara',
  [LeiningRunType.Megillah]: 'megillah',
}

const urlParamToInstanceId = invert(instanceIdtoUrlParam)
const urlParamToRunType = invert(runTypetoUrlParam)

export class LeiningGenerator {
  constructor(readonly settings: UserSettings) {}

  /** Parses the `id` from a `LeiningRun` (eg, from a URL) into the `LeiningRun` that generated it. */
  parseId(id: string): LeiningRun | null {
    const [, date, rawInstanceId, rawRunType] =
      /^([-\d]+):(\w+),([\w-]+)$/.exec(id) ?? []
    const instanceId = urlParamToInstanceId[rawInstanceId as LeiningInstanceId]
    const runType = urlParamToRunType[rawRunType as LeiningRunType]
    if (!date || !instanceId || !runType) return null

    const leiningDate = this.createLeiningDate(
      new HDate(fromISODateString(date))
    )
    if (!leiningDate) return null

    const instance = leiningDate.leinings.find((i) => i.id === instanceId)
    return instance?.runs.find((r) => r.type === runType) ?? null
  }

  /** Creates all leinings in a Hebrew year. */
  forHebrewYear(year: number): LeiningDate[] {
    return this.generateCalendar({ year, isHebrewYear: true, numYears: 1 })
  }

  /** Creates all leinings, from בראשית until שמחת תורה, containing a date. */
  forEntireChumash(containing: HDate): LeiningDate[] {
    const endDay = this.settings.israel ? 22 : 23
    let end = new HDate(endDay, months.TISHREI, containing.getFullYear())

    // If the user's date is after שמחת תורה, add one year.
    if (end.greg() <= containing.greg())
      end = new HDate(endDay, months.TISHREI, 1 + containing.getFullYear())

    // Get בראשית from the previous year.
    const parshaFinder = HebrewCalendar.getSedra(
      end.getFullYear() - 1,
      this.settings.israel
    )
    return this.generateCalendar({
      start: parshaFinder.find('Bereshit')!,
      end,
    })
  }

  /**
   * Returns at least one LeiningDate before and after the specified date.
   * Use this to generate previous and next links.
   */
  aroundDate(date: Date): LeiningDate[] {
    return this.generateCalendar({
      start: new Date(+date - 8 * 24 * 60 * 60 * 1000),
      end: new Date(+date + 8 * 24 * 60 * 60 * 1000),
    })
  }

  private generateCalendar(opts: Partial<CalOptions>): LeiningDate[] {
    const calendar = HebrewCalendar.calendar({
      ...opts,
      sedrot: true,
      ashkenazi: this.settings.ashkenazi,
      il: this.settings.israel,
      noModern: !this.settings.includeModernHolidays,

      locale: 'he',
      mask:
        flags.CHAG |
        flags.MINOR_FAST |
        flags.MAJOR_FAST |
        flags.MINOR_HOLIDAY |
        flags.ROSH_CHODESH |
        flags.CHOL_HAMOED |
        flags.PARSHA_HASHAVUA,
    })
    // calendar() can return multiple Events on the same date for שבת ראש חודש.
    // Filter out duplicates.
    const foundDates = new Set<string>()
    return calendar
      .filter((e) => {
        const str = e.date.toString()
        if (foundDates.has(str)) return false
        foundDates.add(str)
        return true
      })
      .map((e) => this.createLeiningDate(e.date))
      .filter((d): d is LeiningDate => !!d)
  }

  createLeiningDate(date: HDate): LeiningDate | null {
    let leinings = getLeyningOnDate(
      date,
      this.settings.israel,
      /* wantarray */ true
    )
    if (!Array.isArray(leinings)) return null
    leinings = leinings.filter((o) => !o.weekday)
    if (!leinings.length) return null

    const resultDate: LeiningDate = {
      date: date.greg(),
      id: toISODateString(date.greg()),
      title: Locale.hebrewStripNikkud(leinings[0].name.he ?? 'TODO: unknown'),
      leinings: [],
    }
    if (leinings[0].parsha) resultDate.title = `פרשת ${resultDate.title}`
    resultDate.leinings = leinings.flatMap((o) => {
      const results: LeiningInstance[] = []
      if (!isNotPlainWeekday(o)) return results
      if (o.megillah)
        results.push(this.instanceFromMegillah(o.megillah, resultDate))

      const mainLeining = this.instanceFromMainLeining(resultDate, o)
      results.push(mainLeining)

      const haftara = this.settings.ashkenazi ? o.haft : o.seph
      if (haftara)
        mainLeining.runs.push(this.runFromHaftara(haftara, mainLeining))
      return results
    })
    return resultDate
  }

  private instanceFromMainLeining(
    resultDate: LeiningDate,
    o: LeyningShabbatHoliday & LeyningParshaHaShavua
  ) {
    let id = LeiningInstanceId.Shacharis
    if (o.name.en.includes('Mincha')) id = LeiningInstanceId.Mincha
    // Used for Erev Simchat Torah only.
    // Also used for Erev Purim and Erev Tish'a B'Av, but those have no main leinings.
    if (o.name.en.includes('Erev')) id = LeiningInstanceId.Maariv
    return this.createInstance({
      date: resultDate,
      isParsha: !!o.parsha,
      id,
      runs: this.runFromAliyot(o.fullkriyah),
    })
  }

  private runFromHaftara(
    haftara: Aliyah | Aliyah[],
    leining: LeiningInstance
  ): LeiningRun {
    return this.createRun({
      // Do not pass an index here.
      aliyot: [haftara].flat().map((a) => toLeiningAliyah(a)),
      leining,
      type: LeiningRunType.Haftarah,
    })
  }

  private instanceFromMegillah(
    megillah: AliyotMap,
    date: LeiningDate
  ): LeiningInstance {
    // hebcal declares a separate Aliyah for each chapter.
    // I see no reason for this; merge them.
    const aliyot = Object.values(megillah)
    return this.createInstance({
      date,
      isParsha: false,
      id: LeiningInstanceId.Megillah,
      runs: [
        {
          aliyot: [toLeiningAliyah({ ...aliyot[0], e: last(aliyot).e })],
          type: LeiningRunType.Megillah,
        },
      ],
    })
  }

  private runFromAliyot(aliyot: AliyotMap): PartialLeiningRun[] {
    const results: PartialLeiningRun[] = []
    let currentRun: PartialLeiningRun | undefined
    for (const key in aliyot) {
      if (!Object.prototype.hasOwnProperty.call(aliyot, key)) continue
      const aliyah: LeiningAliyah = toLeiningAliyah(
        aliyot[key],
        toAliyahIndex(key)
      )

      if (currentRun && isSameRun(last(currentRun.aliyot), aliyah)) {
        currentRun.aliyot.push(aliyah)
        continue
      }
      let type = LeiningRunType.Main
      // If we're adding a new run after the first Aliyah, mark it as separate.
      if (key !== '1') type = LeiningRunType.LastAliyah
      if (key === 'M') type = LeiningRunType.Maftir
      currentRun = {
        type,
        aliyot: [aliyah],
      }
      results.push(currentRun)
    }
    return results
  }

  /** Fills in the self-referential `instance` property of `runs`. */
  private createInstance(
    parialInstance: Omit<LeiningInstance, 'runs'> & {
      runs: PartialLeiningRun[]
    }
  ): LeiningInstance {
    const leining: LeiningInstance = { ...parialInstance, runs: [] }
    leining.runs = parialInstance.runs.map((r) =>
      this.createRun({ ...r, leining })
    )
    return leining
  }

  /** Fills in inferrable properties of a `LeiningRun`. */
  private createRun(run: Omit<LeiningRun, 'id' | 'scroll'>): LeiningRun {
    return {
      ...run,
      id: `${run.leining.date.id}:${instanceIdtoUrlParam[run.leining.id]},${
        runTypetoUrlParam[run.type]
      }`,
      scroll: run.aliyot[0].start.scroll,
    }
  }
}

function isNotPlainWeekday(o: LeyningBase): o is LeyningShabbatHoliday {
  return 'fullkriyah' in o || 'megillah' in o
}
