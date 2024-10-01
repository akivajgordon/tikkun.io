import { flags, HDate, HebrewCalendar } from '@hebcal/core'
import {
  LeiningAliyah,
  LeiningDate,
  LeiningInstance,
  LeiningInstanceId,
  LeiningRun,
  LeiningRunType,
} from './model-types'
import { UserSettings } from './user-settings'
import {
  Aliyah,
  AliyotMap,
  getLeyningOnDate,
  LeyningBase,
  LeyningParshaHaShavua,
  LeyningShabbatHoliday,
} from '@hebcal/leyning'

type PartialLeiningRun = Omit<LeiningRun, 'id' | 'scroll' | 'leining'>

export class LeiningGenerator {
  constructor(readonly settings: UserSettings) {}

  /** Parses the `id` from a `LeiningRun` (eg, from a URL) into the `LeiningRun` that generated it. */
  parseId(id: string): LeiningRun | null {
    const [date, instanceId, runType] = /^([-\d]+):(\w+),(\w)+$/.exec(id) ?? []
    if (!date || !instanceId || !runType) return null

    const leiningDate = this.createLeiningDate(new HDate(new Date(date)))
    if (!leiningDate) return null

    const instance = leiningDate.leinings.find(
      (i) => i.id.localeCompare(instanceId) === 0
    )
    return (
      instance?.runs.find((r) => r.type.localeCompare(runType) === 0) ?? null
    )
  }

  /** Creates all leinings in a year. */
  generateCalendar(year: number): LeiningDate[] {
    const calendar = HebrewCalendar.calendar({
      sedrot: true,
      ashkenazi: this.settings.ashkenazi,
      il: this.settings.israel,
      noModern: !this.settings.includeModernHolidays,

      locale: 'he',
      numYears: 1,
      year,
      mask:
        flags.CHAG |
        flags.CHOL_HAMOED | // For שבת חול המועד
        flags.PARSHA_HASHAVUA,
    })
    return calendar.map((e) => this.createLeiningDate(e.date))
  }

  private createLeiningDate(date: HDate): LeiningDate | null {
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
      title: 'TODO',
      leinings: leinings.flatMap((o) => {
        const results: LeiningInstance[] = []
        if (!isShabbos(o)) return results
        if (o.megillah)
          results.push(this.instanceFromMegillah(o.megillah, resultDate))

        const mainLeining = this.instanceFromMainLeining(resultDate, o)
        results.push(mainLeining)

        const haftara = this.settings.ashkenazi ? o.haft : o.seph
        if (haftara)
          mainLeining.runs.push(this.runFromHaftara(haftara, mainLeining))
        return results
      }),
    }
    return resultDate
  }

  private instanceFromMainLeining(
    resultDate: LeiningDate,
    o: LeyningShabbatHoliday & LeyningParshaHaShavua
  ) {
    return this.createInstance({
      date: resultDate,
      isParsha: !!o.parsha,
      id: LeiningInstanceId.Shacharis, // TODO
      runs: this.runFromAliyot(o.fullkriyah),
    })
  }

  private runFromHaftara(
    haftara: Aliyah | Aliyah[],
    leining: LeiningInstance
  ): LeiningRun {
    return this.createRun({
      aliyot: [haftara].flat(),
      leining,
      type: LeiningRunType.Haftarah,
    })
  }

  private instanceFromMegillah(
    megillah: AliyotMap,
    date: LeiningDate
  ): LeiningInstance {
    const aliyot = Object.values(megillah)
    if (aliyot.length > 1)
      throw new Error(
        `${date.date}: Megillah ${JSON.stringify(
          megillah
        )} should have exactly 1 aliyah.`
      )
    return this.createInstance({
      date,
      isParsha: false,
      id: LeiningInstanceId.Megillah,
      runs: [{ aliyot, type: LeiningRunType.Megillah }],
    })
  }

  private runFromAliyot(aliyot: AliyotMap): PartialLeiningRun[] {
    const results: PartialLeiningRun[] = []
    let currentRun: PartialLeiningRun | undefined
    for (const key in aliyot) {
      if (!Object.prototype.hasOwnProperty.call(aliyot, key)) continue
      const aliyah: LeiningAliyah = {
        ...aliyot[key],
        index: toAliyahIndex(key),
      }
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
      id: `${
        run.leining.date.id
      }:${run.leining.id.toLowerCase()},${run.type.toLowerCase()}`,
      scroll: run.aliyot[0].k,
    }
  }
}

function chapter(b: string) {
  return b.substring(0, b.indexOf(':'))
}

function isSameRun(existing: Aliyah, next: Aliyah) {
  // TODO: Ignore תרי עשר
  if (existing.k !== next.k) return false
  if (chapter(existing.b) === chapter(next.b)) return true
  // TODO: Check proximity
  return false
}

function toAliyahIndex(key: string): LeiningAliyah['index'] {
  if (key === 'M') return 'Maftir'
  return parseInt(key)
}

function isShabbos(o: LeyningBase): o is LeyningShabbatHoliday {
  return 'haftara' in o && 'fullkriyah' in o
}

function toISODateString(date: Date) {
  const minutesOffset = date.getTimezoneOffset()
  const millisecondsOffset = minutesOffset * 60 * 1000
  const local = new Date(+date - millisecondsOffset)
  return local.toISOString().substring(0, 10)
}

function last<T>(array: T[]) {
  return array[array.length - 1]
}
