/// <reference types="vite/client" />
import { addVerses } from '@hebcal/leyning'
import type { RefWithScroll, ScrollName } from './ref.ts'
import { getBookName } from './calendar-model/hebcal-conversions.ts'


type AppleSauce = {
  p: number
  l: number
}

type TOC = Record<string, Record<string, Record<string, AppleSauce>>>

export async function loadScroll(name: ScrollName) {
  // TODO(https://github.com/vitejs/vite/issues/18582): Delete this workaround.
  let toc
  if (import.meta.env?.MODE)
    // Vite dynamic imports doesn't support the second parameter
    toc = await import(`./data/tables-of-contents/${name}.json`)
  else
    toc = await import(`./data/tables-of-contents/${name}.json`, {
      // Node.js requires the second parameter.
      with: { type: 'json' },
    })
  return new ScrollResolver(name, toc.default)
}

export class ScrollResolver {
  constructor(readonly scroll: string, private readonly toc: TOC) {}

  getPageCount() {
    const b = Math.max(...Object.keys(this.toc).map(Number))
    const c = Math.max(...Object.keys(this.toc[b]).map(Number))
    const v = Math.max(...Object.keys(this.toc[b][c]).map(Number))
    return this.toc[b][c][v].p
  }

  physicalLocationFromRef({
    b: book,
    c: chapter,
    v: verse,
    scroll,
  }: RefWithScroll) {
    if (scroll !== this.scroll)
      throw new Error(
        `Cannot read scroll ${scroll} from resolver for ${this.scroll}`
      )
    if (!this.toc[book]) throw new Error(`Unknown book ${scroll} #${book}`)
    const { p: pageNumber, l: lineNumber } = this.toc[book][chapter][verse]
    return { pageNumber, lineNumber }
  }

  /** Returns the location in this scroll that contains the _end_ of a verse. */
  physicalLocationAfterRef(ref: RefWithScroll) {
    const loc = `${ref.c}:${ref.v}`
    // This returns null if we were passed the last verse of the book.
    // In that case, use the original verse.
    const nextVerse = addVerses(getBookName(ref), loc, 1) || loc
    const [c, v] = nextVerse.split(':')
    return this.physicalLocationFromRef({
      ...ref,
      c: parseInt(c),
      v: parseInt(v),
    })
  }
}
