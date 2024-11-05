import { HDate, HebrewCalendar, Locale, months } from '@hebcal/core'
import type {
  LeiningAliyah,
  LeiningDate,
  LeiningInstance,
  LeiningRun,
} from './model-types.ts'
import { LeiningInstanceId, LeiningRunType } from './model-types.ts'
import type { UserSettings } from './user-settings.ts'
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
    return this.generateCalendar({
      start: new HDate(1, months.TISHREI, year),
      until: new HDate(1, months.TISHREI, year + 1),
    })
  }

  /** Creates all leinings, from בראשית until שמחת תורה, containing a date. */
  forEntireChumash(containing: HDate): LeiningDate[] {
    // Select one day after שמחת תורה
    const untilDay = this.settings.israel ? 23 : 24
    let until = new HDate(untilDay, months.TISHREI, containing.getFullYear())

    // If the user's date is after שמחת תורה, add one year.
    if (until.greg() <= containing.greg())
      until = new HDate(untilDay, months.TISHREI, 1 + containing.getFullYear())

    // Get בראשית from the previous year.
    const parshaFinder = HebrewCalendar.getSedra(
      until.getFullYear() - 1,
      this.settings.israel
    )
    return this.generateCalendar({
      start: parshaFinder.find('Bereshit')!,
      until,
    })
  }

  /**
   * Returns at least one LeiningDate before and after the specified date.
   * Use this to generate previous and next links.
   */
  aroundDate(date: Date): LeiningDate[] {
    const hdate = new HDate(date)
    return this.generateCalendar({
      start: hdate.subtract(8, 'day'),
      until: hdate.add(9, 'day'),
    })
  }

  private generateCalendar({
    start,
    until,
  }: {
    start: HDate
    until: HDate
  }): LeiningDate[] {
    const result: LeiningDate[] = []
    for (
      let date = start;
      date.abs() < until.abs();
      date = date.add(1, 'day')
    ) {
      const leining = this.createLeiningDate(date)
      if (leining) result.push(leining)
    }
    return result
  }

  createLeiningDate(date: HDate): LeiningDate | null {
    let leinings = getLeyningOnDate(
      date,
      this.settings.israel,
      /* wantarray */ true
    )
    leinings = leinings.filter((o) => !o.weekday)
    if (!leinings.length) return null

    const resultDate: LeiningDate = {
      date: date.greg(),
      id: toISODateString(date.greg()),
      title: {
        en: leinings[0].name.en ?? 'TODO: unknown',
        he: Locale.hebrewStripNikkud(leinings[0].name.he ?? 'TODO: unknown'),
      },
      leinings: [],
    }
    if (leinings[0].parsha)
      resultDate.title = {
        en: `Parshat ${resultDate.title.en}`,
        he: `פרשת ${resultDate.title.he}`,
      }
    resultDate.leinings = leinings.flatMap((o) => {
      const results: LeiningInstance[] = []
      if (!isNotPlainWeekday(o)) return results
      // Skip the first instance of אסתר, since it's
      // immediately followed by the second instance.
      if (o.megillah && o.name.en !== 'Erev Purim')
        results.push(this.instanceFromMegillah(o.megillah, resultDate))

      // When מעריב only has מגילה, this will be empty.
      const mainLeining = this.instanceFromMainLeining(resultDate, o)
      if (mainLeining.runs.length) results.push(mainLeining)

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
