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
import { invert, fromISODateString, toISODateString, last } from './utils'
import { RefWithScroll } from '../ref'
import { physicalLocationFromRef } from '../location'

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
  generateCalendar(year: number): LeiningDate[] {
    const calendar = HebrewCalendar.calendar({
      sedrot: true,
      ashkenazi: this.settings.ashkenazi,
      il: this.settings.israel,
      noModern: !this.settings.includeModernHolidays,

      locale: 'he',
      isHebrewYear: true,
      numYears: 1,
      year,
      mask:
        flags.CHAG |
        flags.CHOL_HAMOED | // For שבת חול המועד
        flags.PARSHA_HASHAVUA,
    })
    return calendar.map((e) => this.createLeiningDate(e.date))
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
    // TODO: Delete after https://github.com/hebcal/hebcal-leyning/issues/430 is fixed.
    if (leinings[0].parsha) leinings.length = 1

    const resultDate: LeiningDate = {
      date: date.greg(),
      id: toISODateString(date.greg()),
      title: 'TODO',
      leinings: [],
    }
    resultDate.leinings = leinings.flatMap((o) => {
      const results: LeiningInstance[] = []
      if (!isFullLeining(o)) return results
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

/** Returns true if the next עלייה is far enough away to need a second ספר תורה. */
function isSameRun(existing: LeiningAliyah, next: LeiningAliyah) {
  // TODO: Ignore תרי עשר
  if (existing.end.b !== next.start.b) return false
  // If they're in the same פרק, they're definitely close.
  if (existing.end.c === next.start.c) return true

  const existingLocation = physicalLocationFromRef(existing.end)
  const nextLocation = physicalLocationFromRef(next.start)

  return Math.abs(nextLocation.pageNumber - existingLocation.pageNumber) < 3
}

function toAliyahIndex(key: string): LeiningAliyah['index'] {
  if (key === 'M') return 'Maftir'
  return parseInt(key)
}

function isFullLeining(o: LeyningBase): o is LeyningShabbatHoliday {
  return 'fullkriyah' in o
}

// TODO(later): Change the JSON to use these names and get rid of this array.
const bookNames = [
  '',
  'Genesis',
  'Exodus',
  'Leviticus',
  'Numbers',
  'Deuteronomy',
]
function toLeiningAliyah(
  a: Aliyah,
  index?: LeiningAliyah['index']
): LeiningAliyah {
  return {
    start: toRef(a.b),
    end: toRef(a.e),
    index,
  }

  function toRef(verse: string): RefWithScroll {
    const [c, v] = verse.split(':')
    const torahIndex = bookNames.indexOf(a.k)
    return {
      // TODO(later): Expand this once we add more scrolls.
      scroll: torahIndex ? 'torah' : 'esther',
      b: torahIndex,
      c: parseInt(c),
      v: parseInt(v),
    }
  }
}
