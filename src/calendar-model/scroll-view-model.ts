import { LineType } from '../components/Page'
import { Ref, RefWithScroll } from '../ref'
import { LeiningGenerator } from './generator'
import { LeiningRun, LeiningRunType } from './model-types'
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

/** Information to render a single page from a scroll. */
export interface RenderedPageInfo {
  type: 'page'
  lines: RenderedLineInfo[]

  /**
   * The LeiningRun containing the first פסוק that begins in this page.
   * This is used to render the header UI as the user scrolls.
   * TODO(haftara): What about pages of נביא outside a הפטרה?
   */
  run: LeiningRun
}

/** Information to render a message between `RenderedPageInfo`s. */
export interface RenderedMessageInfo {
  type: 'message'
  text: string
}

/** A single entry rendered as the user scrolls. */
export type RenderedEntry = RenderedPageInfo | RenderedMessageInfo

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

/** Tracks scrolling through a single "view" of a scroll, associated with one or more LeiningRuns. */
export class ScrollViewModel {
  private readonly currentContentIndex: ReturnType<typeof IntegerIterator.new>
  readonly startingLocation: Promise<{
    page: RenderedEntry
    lineNumber: number
  }>
  protected constructor(
    /** The "view" (set of runs and contained עליות) that the user can scroll through. */
    private readonly allRuns: LeiningRun[],
    initialRef: RefWithScroll
  ) {
    // TODO(later): Load TOCs lazily.
    // This means converting currentPage to a promise and awaiting it everywhere.
    const { pageNumber, lineNumber } = physicalLocationFromRef(initialRef)

    this.currentContentIndex = IntegerIterator.new({
      startingAt: this.contentIndexFromPageNumber(pageNumber),
    })
    this.startingLocation = this.fetchPage(pageNumber).then((page) => ({
      page,
      lineNumber,
    }))
  }

  static forId(
    generator: LeiningGenerator,
    runId: string
  ): ScrollViewModel | null {
    const run = generator.parseId(runId)
    if (!run) return null
    if (run.leining.isParsha || run.type === LeiningRunType.Megillah)
      return new FullScrollViewModel(generator, run)
    return new HolidayViewModel(generator, run)
  }

  fetchPreviousPage(): Promise<RenderedEntry> {
    return this.fetchPage(this.currentContentIndex.previous())
  }

  fetchNextPage(): Promise<RenderedEntry> {
    return this.fetchPage(this.currentContentIndex.next())
  }

  /**
   * Calculates the page number (within the scroll) to fetch, or
   * a fixed string, to render for the given (contiguous) index.
   *
   * This is overridden to render only a subset of pages.
   *
   * See the Readme for more background.
   */
  protected pageNumberFromContentIndex(
    contentIndex: number
  ): number | RenderedMessageInfo {
    // Page numbers in the JSON are 1-based
    return contentIndex + 1
  }
  /** Returns the (contiguous) index at which the given page is rendered. */
  protected contentIndexFromPageNumber(pageNumber: number): number {
    // Content indices are 0-based.
    return pageNumber - 1
  }

  private async fetchPage(contentIndex: number): Promise<RenderedEntry> {
    const pageNumber = this.pageNumberFromContentIndex(contentIndex)
    if (typeof pageNumber === 'object') return pageNumber

    const page: LineType[] = (
      await import(`../data/pages/${this.allRuns[0].scroll}/${pageNumber}.json`)
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
    return { type: 'page', lines, run: lines.find((o) => o.run)!.run! }
  }
}

/** A view that includes the entire scroll.  Used for regular פרשיות and any מגילה. */
class FullScrollViewModel extends ScrollViewModel {
  constructor(generator: LeiningGenerator, run: LeiningRun) {
    super(
      FullScrollViewModel.calculateRuns(generator, run),
      run.aliyot[0].start
    )
  }

  private static calculateRuns(
    generator: LeiningGenerator,
    run: LeiningRun
  ): LeiningRun[] {
    const hdate = new HDate(run.leining.date.date)
    return generator
      .generateCalendar(hdate.getFullYear())
      .flatMap((d) => d.leinings)
      .filter((i) => i.isParsha)
      .flatMap((i) => i.runs)
      .filter((r) => r.scroll === run.scroll)
  }
}

/** A view that only renders pages containing the actual leinings.  Used for יום טוב. */
class HolidayViewModel extends ScrollViewModel {
  private readonly pages: Array<number | RenderedMessageInfo>
  constructor(generator: LeiningGenerator, run: LeiningRun) {
    // TODO(decide): Should this include the whole LeiningDate?
    super(run.leining.runs, run.aliyot[0].start)

    // TODO: Populate pages from the scroll.
  }

  protected override pageNumberFromContentIndex(
    index: number
  ): number | RenderedMessageInfo {
    return this.pages[index]
  }
  protected override contentIndexFromPageNumber(pageNumber: number): number {
    return this.pages.indexOf(pageNumber)
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
