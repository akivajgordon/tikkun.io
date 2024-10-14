import { LineType } from '../components/Page.ts'
import { Ref, RefWithScroll } from '../ref.ts'
import { LeiningGenerator } from '../calendar-model/generator.ts'
import {
  LeiningAliyah,
  LeiningRun,
  LeiningRunType,
} from '../calendar-model/model-types.ts'
import IntegerIterator from '../integer-iterator.ts'
import { getPageCount, physicalLocationFromRef } from '../location.ts'
import { HDate } from '@hebcal/core'
import { containsRef } from '../calendar-model/ref-utils.ts'
import { last, range } from '../calendar-model/utils.ts'
import { AliyahLabeller } from './aliyah-labeller.ts'

/** Information to render a single page from a scroll. */
export interface RenderedPageInfo {
  type: 'page'
  lines: RenderedLineInfo[]

  /**
   * The LeiningRun containing the first פסוק that begins in this page.
   * This is used to render the header UI as the user scrolls.
   * TODO(haftara): What about pages of נביא outside a הפטרה?
   * This will be unset for a תענית ציבור, which can contain an entire
   * page that is between runs.
   * TODO: This should probably be deleted.
   */
  run?: LeiningRun
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
   * The outer array has one entry per span in a שירה.
   * The inner array separates a פרשה סתומה.
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
   * May be null for the first lines on a page, if they are part of the
   * last פסוק from the previous page.
   * Will also be null for פסוקים that are outside the run (this cannot
   * happen when rendering all of  חומש).
   *
   * This is used to render the header UI as the user scrolls.
   */
  run?: LeiningRun
  /**
   * The עליות that contain this line.
   * This will be empty iff `run` is unset, following the same rules.
   * This can have multiple elements for מפטיר and חול המועד סוכות.
   */
  aliyot: LeiningAliyah[]
}

/** Tracks scrolling through a single "view" of a scroll, associated with one or more LeiningRuns. */
export abstract class ScrollViewModel {
  private readonly currentContentIndex: ReturnType<typeof IntegerIterator.new>
  readonly startingLocation: Promise<{
    page: RenderedEntry
    lineNumber: number
  }>
  protected constructor(
    readonly generator: LeiningGenerator,
    /** The "view" (set of runs and contained עליות) that the user can scroll through. */
    readonly relevantRuns: LeiningRun[],
    initialRef: RefWithScroll
  ) {
    // TODO(later): Load TOCs lazily.
    // This means converting currentPage to a promise and awaiting it everywhere.
    const { pageNumber, lineNumber } = physicalLocationFromRef(initialRef)

    const startingContentIndex = this.contentIndexFromPageNumber(pageNumber)
    this.currentContentIndex = IntegerIterator.new({
      startingAt: startingContentIndex,
    })
    this.startingLocation = this.fetchPage(startingContentIndex).then(
      (page) => {
        if (!page)
          throw new Error(`First page ${startingContentIndex} must exist`)
        return {
          page,
          lineNumber,
        }
      }
    )
  }

  /** Creates the appropriate `ScrollViewModel` subclass for a particular `LeiningRun` */
  static forId(
    generator: LeiningGenerator,
    runId: string
  ): ScrollViewModel | null {
    const run = generator.parseId(runId)
    if (!run) return null
    // Always render the full מגילה.
    if (run.type === LeiningRunType.Megillah)
      return new FullScrollViewModel(generator, run)
    // For the פרשה itself, render all of חומש.
    if (run.leining.isParsha && run.type === LeiningRunType.Main)
      return new FullScrollViewModel(generator, run)
    // For any part of יום טוב, special מפטיר, or הפתרה, only render relevant parts.
    return new HolidayViewModel(generator, run)
  }

  /** Creates the appropriate `ScrollViewModel` subclass for the first leining on or after a date. */
  static forDate(generator: LeiningGenerator, date: Date) {
    // Collect all main leinings in the year containing the date.
    const allDates = generator.aroundDate(date)
    const targetDate = allDates.find((d) => d.date >= date) ?? last(allDates)
    return ScrollViewModel.forId(generator, targetDate.leinings[0].runs[0].id)
  }

  /** Creates the appropriate `ScrollViewModel` subclass for the first leining containing a פסוק. */
  static forRef(generator: LeiningGenerator, ref: RefWithScroll) {
    // Use this year's calendar.
    const allRuns = generator
      .forHebrewYear(new HDate(new Date()).getFullYear())
      .flatMap((d) => d.leinings)
      .flatMap((i) => i.runs)
    const run =
      allRuns.find((r) => r.scroll === ref.scroll && containsRef(r, ref)) ??
      allRuns[0]

    return ScrollViewModel.forId(generator, run.id)
  }

  fetchPreviousPage(): Promise<RenderedEntry | null> {
    return this.fetchPage(this.currentContentIndex.previous())
  }

  fetchNextPage(): Promise<RenderedEntry | null> {
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
  protected abstract pageNumberFromContentIndex(
    contentIndex: number
  ): ContentPageEntry
  /** Returns the (contiguous) index at which the given page is rendered. */
  protected abstract contentIndexFromPageNumber(pageNumber: number): number

  private async fetchPage(contentIndex: number): Promise<RenderedEntry | null> {
    const pageNumber = this.pageNumberFromContentIndex(contentIndex)
    if (typeof pageNumber === 'object') return pageNumber
    if (!pageNumber || pageNumber <= 0) return null

    const page: LineType[] = (
      await import(
        `../data/pages/${this.relevantRuns[0].scroll}/${pageNumber}.json`
      )
    ).default

    let run: LeiningRun | undefined
    let aliyot: LeiningAliyah[] = []
    const labeller = new AliyahLabeller()
    const lines: RenderedLineInfo[] = page.map((rawLine) => {
      const verses = rawLine.verses.map(toRef)

      if (verses.length) [run, aliyot] = this.findContainingAliyot(verses, run)

      return {
        ...rawLine,
        verses,
        run,
        aliyot,
        labels: labeller.getLabelsForLine(run, verses),
      }
    })
    return { type: 'page', lines, run: lines.find((o) => o.run)?.run }
  }

  private findContainingAliyot(
    verses: Ref[],
    candidateRun?: LeiningRun
  ): [LeiningRun | undefined, LeiningAliyah[]] {
    if (candidateRun) {
      const aliyot = candidateRun.aliyot.filter((a) => containsRef(a, verses))
      if (aliyot.length) return [candidateRun, aliyot]
    }
    // TODO(later): Try the next run first?
    for (const run of this.relevantRuns) {
      const aliyot = run.aliyot.filter((a) => containsRef(a, verses))
      if (aliyot.length) return [run, aliyot]
    }
    return [undefined, []]
  }
}

/** A view that includes the entire scroll.  Used for regular פרשיות and any מגילה. */
class FullScrollViewModel extends ScrollViewModel {
  private readonly pageCount
  constructor(generator: LeiningGenerator, run: LeiningRun) {
    super(
      generator,
      FullScrollViewModel.calculateRuns(generator, run),
      run.aliyot[0].start
    )
    this.pageCount = getPageCount(run.scroll)
  }

  protected override pageNumberFromContentIndex(
    contentIndex: number
  ): ContentPageEntry {
    if (contentIndex + 1 > this.pageCount) return -1
    // Page numbers in the JSON are 1-based
    return contentIndex + 1
  }
  /** Returns the (contiguous) index at which the given page is rendered. */
  protected override contentIndexFromPageNumber(pageNumber: number): number {
    // Content indices are 0-based.
    return pageNumber - 1
  }

  private static calculateRuns(
    generator: LeiningGenerator,
    run: LeiningRun
  ): LeiningRun[] {
    // When used for a מגילה, just include this run.
    if (run.scroll !== 'torah') return [run]
    const hdate = new HDate(run.leining.date.date)
    return generator
      .forHebrewYear(hdate.getFullYear())
      .flatMap((d) => d.leinings)
      .filter((i) => i.isParsha)
      .flatMap((i) => i.runs)
      .filter((r) => r.scroll === run.scroll)
  }
}

/** The type passed from derived classes to `fetchPage()`. */
type ContentPageEntry = number | RenderedMessageInfo

/** A view that only renders pages containing the actual leinings.  Used for יום טוב. */
class HolidayViewModel extends ScrollViewModel {
  private pages?: ContentPageEntry[]
  private getPages(): ContentPageEntry[] {
    if (this.pages) return this.pages
    let lastEndPage = 0
    this.pages = this.relevantRuns.flatMap((r) => {
      const start = physicalLocationFromRef(r.aliyot[0].start)
      const end = physicalLocationFromRef(last(r.aliyot).end)

      const extraEntries: ContentPageEntry[] = []
      if (lastEndPage) {
        const skipCount = start.pageNumber - lastEndPage
        extraEntries.push({
          type: 'message',
          text: `✃ ${skipCount} ${skipCount === 1 ? 'עמוד' : 'עמודים'} ✁`,
        })
      }
      lastEndPage = end.pageNumber

      return extraEntries.concat(range(start.pageNumber, end.pageNumber))
    })
    return this.pages
  }

  constructor(generator: LeiningGenerator, run: LeiningRun) {
    // TODO(decide): Should this include the whole LeiningDate?
    super(
      generator,
      run.leining.runs.filter((r) => r.scroll === run.scroll),
      run.aliyot[0].start
    )
  }

  protected override pageNumberFromContentIndex(
    index: number
  ): ContentPageEntry {
    return this.getPages()[index]
  }
  protected override contentIndexFromPageNumber(pageNumber: number): number {
    return this.getPages().indexOf(pageNumber)
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
