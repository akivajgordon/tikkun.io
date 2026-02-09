import type { LineType } from '../components/Page.ts'
import type { Ref, RefWithScroll } from '../ref.ts'
import { LeiningGenerator } from '../calendar-model/generator.ts'
import type {
  LeiningAliyah,
  LeiningRun,
} from '../calendar-model/model-types.ts'
import {
  LeiningInstanceId,
  LeiningRunType,
} from '../calendar-model/model-types.ts'
import IntegerIterator from '../integer-iterator.ts'
import { HDate } from '@hebcal/hdate'
import { compareRefs, containsRef } from '../calendar-model/ref-utils.ts'
import {
  fromISODateString,
  last,
  range,
  toISODateString,
} from '../calendar-model/utils.ts'
import { AliyahLabeller } from './aliyah-labeller.ts'
import { loadScroll, ScrollResolver } from '../location.ts'

/** Information to render a single page from a scroll. */
export interface RenderedPageInfo {
  type: 'page'
  lines: RenderedLineInfo[]
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
  private readonly currentContentIndex: Promise<
    ReturnType<typeof IntegerIterator.new>
  >
  readonly startingLocation: Promise<{
    page: RenderedEntry
    lineNumber: number
  }>
  readonly resolver: Promise<ScrollResolver>

  protected constructor(
    readonly generator: LeiningGenerator,
    /** The "view" (set of runs and contained עליות) that the user can scroll through. */
    readonly relevantRuns: LeiningRun[],
    initialRef: RefWithScroll
  ) {
    this.resolver = loadScroll(initialRef.scroll)
    const startingInfo = this.loadAndConsumeScroll(initialRef)
    this.currentContentIndex = startingInfo.then(
      ({ currentIndex }) => currentIndex
    )
    this.startingLocation = startingInfo.then(({ location }) => location)
  }
  private async loadAndConsumeScroll(initialRef: RefWithScroll) {
    const scrollResolver = await this.resolver
    const { pageNumber, lineNumber } =
      await scrollResolver.physicalLocationFromRef(initialRef)

    const startingContentIndex = await this.contentIndexFromPageNumber(
      pageNumber
    )
    const page = await this.fetchPage(startingContentIndex)
    if (!page) throw new Error(`First page ${startingContentIndex} must exist`)
    return {
      location: {
        page,
        lineNumber,
      },
      currentIndex: IntegerIterator.new({
        startingAt: startingContentIndex,
      }),
    }
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

    // Strip the time component so we can find today's leining.
    date = fromISODateString(toISODateString(date))
    const targetDate = allDates.find((d) => d.date >= date) ?? last(allDates)
    return ScrollViewModel.forId(generator, targetDate.leinings[0].runs[0].id)!
  }

  /** Creates the appropriate `ScrollViewModel` subclass for the first leining containing a פסוק. */
  static forRef(generator: LeiningGenerator, ref: RefWithScroll) {
    // Use this year's calendar.

    let allRuns
    if (ref.scroll === 'torah') {
      allRuns = getParshaRuns(generator, new Date())
    } else {
      allRuns = generator
        .forEntireChumash(new HDate(new Date()))
        .flatMap((d) => d.leinings)
        .flatMap((i) => i.runs)
    }
    const run =
      allRuns.find((r) => r.scroll === ref.scroll && containsRef(r, ref)) ??
      allRuns[0]

    return ScrollViewModel.forId(generator, run.id)
  }

  async fetchPreviousPage(): Promise<RenderedEntry | null> {
    return this.fetchPage((await this.currentContentIndex).previous())
  }

  async fetchNextPage(): Promise<RenderedEntry | null> {
    return this.fetchPage((await this.currentContentIndex).next())
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
  ): Promise<ContentPageEntry>
  /** Returns the (contiguous) index at which the given page is rendered. */
  protected abstract contentIndexFromPageNumber(
    pageNumber: number
  ): Promise<number>

  private async fetchPage(contentIndex: number): Promise<RenderedEntry | null> {
    const pageNumber = await this.pageNumberFromContentIndex(contentIndex)
    if (typeof pageNumber === 'object') return pageNumber
    if (!pageNumber || pageNumber <= 0) return null


    let page: { default: LineType[] }
    if (import.meta.env?.MODE)
      // Vite dynamic imports doesn't support the second parameter
      page = await import(
        `../data/pages/${this.relevantRuns[0].scroll}/${pageNumber}.json`
      )
    else
      page = await import(
        `../data/pages/${this.relevantRuns[0].scroll}/${pageNumber}.json`,
        // Node.js requires the second parameter.
        { with: { type: 'json' } }
      )

    let run: LeiningRun | undefined
    let aliyot: LeiningAliyah[] = []
    const labeller = new AliyahLabeller()
    const lines: RenderedLineInfo[] = page.default.map((rawLine) => {
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
    return { type: 'page', lines }
  }

  private findContainingAliyot(
    verses: Ref[],
    candidateRun?: LeiningRun
  ): [LeiningRun | undefined, LeiningAliyah[]] {
    if (candidateRun) {
      const aliyot = candidateRun.aliyot.filter((a) => containsRef(a, verses))
      if (aliyot.length) return [candidateRun, aliyot]
    }
    // Search runs in Torah order, not calendar order.
    // This ensures we match the parsha that comes first in the actual scroll,
    // rather than a holiday reading that appears earlier in the calendar year
    // but later in the Torah text.
    const runsByTorahOrder = this.relevantRuns.slice().sort((a, b) => {
      return compareRefs(a.aliyot[0].start, b.aliyot[0].start)
    })
    for (const run of runsByTorahOrder) {
      const aliyot = run.aliyot.filter((a) => containsRef(a, verses))
      if (aliyot.length) return [run, aliyot]
    }
    return [undefined, []]
  }
}

/** A view that includes the entire scroll.  Used for regular פרשיות and any מגילה. */
class FullScrollViewModel extends ScrollViewModel {
  private readonly pageCount: Promise<number>
  constructor(generator: LeiningGenerator, run: LeiningRun) {
    super(
      generator,
      FullScrollViewModel.calculateRuns(generator, run),
      run.aliyot[0].start
    )
    this.pageCount = this.resolver.then((r) => r.getPageCount())
  }

  protected override async pageNumberFromContentIndex(
    contentIndex: number
  ): Promise<ContentPageEntry> {
    if (contentIndex + 1 > (await this.pageCount)) return -1
    // Page numbers in the JSON are 1-based
    return contentIndex + 1
  }
  /** Returns the (contiguous) index at which the given page is rendered. */
  protected override async contentIndexFromPageNumber(
    pageNumber: number
  ): Promise<number> {
    // Content indices are 0-based.
    return pageNumber - 1
  }

  private static calculateRuns(
    generator: LeiningGenerator,
    run: LeiningRun
  ): LeiningRun[] {
    // When used for a מגילה, just include this run.
    if (run.scroll !== 'torah') return [run]
    return getParshaRuns(generator, run.leining.date.date)
  }
}

/** Gets all LeiningRuns that should appear in the חומש-only view. */
function getParshaRuns(generator: LeiningGenerator, hdate: Date) {
  // Ignore separate מפטיר runs so that we don't label them as מפטיר out of context.
  return generator
    .forEntireChumash(new HDate(hdate))
    .flatMap((d) => d.leinings)
    .filter((i) => i.isParsha || i.runs.some(isVezosHabracha))
    .map((i) => i.runs[0])
}

export function isVezosHabracha(r: LeiningRun): boolean {
  return (
    r.leining.id === LeiningInstanceId.Shacharis &&
    r.aliyot[0]?.start.b === 5 &&
    r.aliyot[0]?.start.c === 33
  )
}

/** The type passed from derived classes to `fetchPage()`. */
type ContentPageEntry = number | RenderedMessageInfo

/** A view that only renders pages containing the actual leinings.  Used for יום טוב. */
class HolidayViewModel extends ScrollViewModel {
  private readonly pages: Promise<ContentPageEntry[]>

  constructor(generator: LeiningGenerator, run: LeiningRun) {
    // TODO(decide): Should this include the whole LeiningDate?
    super(
      generator,
      run.leining.runs.filter((r) => r.scroll === run.scroll),
      run.aliyot[0].start
    )
    this.pages = this.fetchPages()
  }

  private async fetchPages(): Promise<ContentPageEntry[]> {
    let lastEndPage = 0
    const resolver = await this.resolver
    return this.relevantRuns.flatMap((r) => {
      const start = resolver.physicalLocationFromRef(r.aliyot[0].start)
      const end = resolver.physicalLocationFromRef(last(r.aliyot).end)

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
  }

  protected override async pageNumberFromContentIndex(
    index: number
  ): Promise<ContentPageEntry> {
    return (await this.pages)[index]
  }
  protected override async contentIndexFromPageNumber(
    pageNumber: number
  ): Promise<number> {
    return (await this.pages).indexOf(pageNumber)
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
