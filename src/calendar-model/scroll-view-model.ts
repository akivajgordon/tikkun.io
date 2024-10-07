import { LineType } from '../components/Page'
import { Ref } from '../ref'
import { LeiningGenerator } from './generator'
import { LeiningAliyah, LeiningRun } from './model-types'
import IntegerIterator from '../integer-iterator.ts'
import { physicalLocationFromRef } from '../location.ts'
import { HDate } from '@hebcal/core'
import { numVersesBetween } from './hebcal-conversions.ts'

/** The current state exposed by the view model. */
export interface ViewModelState {
  readonly currentRun: LeiningRun
  readonly prevRun: LeiningRun
  readonly nextRun: LeiningRun
}

export interface RenderedPageInfo {
  lines: RenderedLineInfo[]

  /**
   * The LeiningRun containing the first פסוק that begins in this page.
   * This is used to render the header UI as the user scrolls.
   * TODO(haftara): What about pages of נביא outside a הפטרה?
   */
  run: LeiningRun
}

/**
 * Information to render a single line in the UI.
 * Most of these properties come from the JSON files in pages/.
 */
export interface RenderedLineInfo {
  /**
   * Whitespace-separated spans of text.
   * This will have multiple entries at a פרשה סתומה and in a שירה.
   */
  text: string[][]
  /** The פסוקים that begin in this line, if any. */
  verses: Ref[]
  /** True if this line should not be justified. */
  isPetucha: boolean
  /**
   * Labels that apply to פסוקים that begin in this line, for the current leining.
   * This includes beginnings of עליות (which can include both שביעי and מפטיר).
   * It can also include the end of an עלייה if no other עלייה begins.
   * This is computed dynamically based on the current leining.
   */
  labels: string[]
  /**
   * The LeiningRun containing the first פסוק that begins in this line.
   * May be null for lines that are entirely contained within a פסוק.
   * This is used to render the header UI as the user scrolls.
   */
  run?: LeiningRun
}

export class ScrollViewModel {
  private currentPage: ReturnType<typeof IntegerIterator.new>
  /** All runs rendered in this view and scroll. */
  private allRuns: LeiningRun[] = []

  constructor(private readonly generator: LeiningGenerator) {}

  async goToId(
    runId: string
  ): Promise<{ page: RenderedPageInfo; lineNumber: number } | null> {
    const run = this.generator.parseId(runId)
    if (!run) return null
    this.allRuns = this.calculateRuns(run)
    const { pageNumber, lineNumber } = physicalLocationFromRef(
      run.aliyot[0].start
    )
    this.currentPage = IntegerIterator.new({ startingAt: pageNumber })
    const page = await this.fetchPage(pageNumber)
    return { page, lineNumber }
  }

  fetchPreviousPage(): Promise<RenderedPageInfo> {
    return this.fetchPage(this.currentPage.previous())
  }

  fetchNextPage(): Promise<RenderedPageInfo> {
    return this.fetchPage(this.currentPage.next())
  }

  /** Calculates the "view" (set of runs and contained עליות) that the user can scroll through. */
  private calculateRuns(run: LeiningRun): LeiningRun[] {
    let relatedRuns: LeiningRun[]
    if (!run.leining.isParsha) {
      // TODO(decide): Should this include the whole LeiningDate?
      relatedRuns = run.leining.runs
    } else {
      const hdate = new HDate(run.leining.date.date)
      relatedRuns = this.generator
        .generateCalendar(hdate.getFullYear())
        .flatMap((d) => d.leinings)
        .filter((i) => i.isParsha)
        .flatMap((i) => i.runs)
    }
    return relatedRuns.filter((r) => r.scroll === run.scroll)
  }

  private async fetchPage(index: number): Promise<RenderedPageInfo> {
    const page: LineType[] = (
      await import(`../data/pages/${this.allRuns[0].scroll}/${index}.json`)
    ).default
    let run: LeiningRun | undefined
    let relevantRuns: LeiningRun[] = []
    const lines: RenderedLineInfo[] = page.map((rawLine) => {
      const verses = rawLine.verses.map(toRef)

      // TODO(later): Optimize this slow search?
      if ((verses.length && !run) || !containsRef(run, verses[0])) {
        const runIndex = this.allRuns.findIndex((run) =>
          containsRef(run, verses[0])
        )
        run = this.allRuns[runIndex]
        relevantRuns = [run, this.allRuns[runIndex + 1]].filter(Boolean)
      }

      return {
        ...rawLine,
        verses,
        run,
        labels: this.getLabels(relevantRuns, verses),
      }
    })
    return { lines, run: lines.find((o) => o.run)!.run! }
  }

  /**
   * Computes the set of עלייה labels to display for a line:
   *  - If one or (for מפטיר and שביעי) more עליות begin in this line, return them.
   *  - If an עלייה ends at this line, but a new עלייה or פרשה begins in the next פסוק, return nothing.
   *  - If an עלייה ends at this line, and a new עלייה does not begin in the vicinity, return `סוף`.
   * @param runs The run containing the פסוקים, as well as the next run in the scroll.
   * @param verses The פסוקים that begin in this line, if any.
   */
  private getLabels(runs: LeiningRun[], verses: Ref[]): string[] {
    if (!runs.length || !verses.length) return []
    const labels: string[] = []
    const allAliyot = runs.flatMap((r) => r.aliyot)
    for (const v of verses) {
      const myAliyot = runs[0].aliyot
      // First, look for an עלייה in the containing run.
      const starts = myAliyot.filter((a) => a.index && refEquals(a.start, v))
      labels.push(...starts.map((a) => aliyahName(a.index, runs[0])))
      // If we already have labels, we're done.
      if (starts.length) continue

      const ends = myAliyot.filter((a) => refEquals(a.end, v))
      // If no עלייה ends here, there is nothing to label.
      if (!ends.length) continue

      const followUpStarts = allAliyot.some(
        (a) => numVersesBetween(v, a.start) === 1
      )
      // If another עלייה (in this run or another run) starts in the next פסוק,
      // we don't need to label the end.
      if (followUpStarts) continue
      labels.push(`סוף ${aliyahName(ends[0].index, runs[0])}`)
    }
    return labels
  }
}

const aliyahStrings = [
  'ראשון',
  'שני',
  'שלישי',
  'רביעי',
  'חמישי',
  'ששי',
  'שביעי',
]

function aliyahName(index: LeiningAliyah['index'], run: LeiningRun) {
  if (index === 'Maftir') return 'מפטיר'
  if (index < 1 || index > aliyahStrings.length) return null

  if (index === 1) return run.leining.date.title
  if (run.leining.date.title === 'שמחת תורה') {
    if (index === 6) return `חתן תורה`
    if (index === 7) return `חתן בראשית`
  }
  return aliyahStrings[index - 1]
}

function containsRef(o: LeiningAliyah | LeiningRun, ref: Ref): boolean {
  if (isRun(o)) return o.aliyot.some((a) => containsRef(a, ref))
  return compareRefs(o.start, ref) <= 0 && compareRefs(o.end, ref) >= 0
}

function compareRefs(a: Ref, b: Ref): -1 | 0 | 1 {
  if (a.b != b.b) return compare(a.b, b.b)
  if (a.c != b.c) return compare(a.c, b.c)
  return compare(a.v, b.v)
}

function refEquals(a: Ref, b: Ref): boolean {
  return compareRefs(a, b) === 0
}

function compare(a: number, b: number): -1 | 0 | 1 {
  if (a === b) return 0
  return a < b ? -1 : 1
}

function isRun(o: object): o is LeiningRun {
  return 'aliyot' in o
}

// TODO(#130): Delete this function & type once we unify these types.
function toRef(verse: VerseFromJson): Ref {
  return {
    b: verse.book,
    c: verse.chapter,
    v: verse.verse,
  }
}
type VerseFromJson = {
  book: number
  chapter: number
  verse: number
}
