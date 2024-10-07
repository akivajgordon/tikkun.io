import { LineType } from '../components/Page'
import { Ref } from '../ref'
import { LeiningGenerator } from './generator'
import { LeiningRun } from './model-types'
import IntegerIterator from '../integer-iterator.ts'
import { physicalLocationFromRef } from '../location.ts'
import { HDate } from '@hebcal/core'
import { containsRef, getLabels } from './display.ts'

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
        labels: getLabels(relevantRuns, verses),
      }
    })
    return { lines, run: lines.find((o) => o.run)!.run! }
  }
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
