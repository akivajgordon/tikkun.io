import tocJSON from './data/tables-of-contents/torah.json'
import estherToc from './data/tables-of-contents/esther.json'
import { RefWithScroll, ScrollName } from './ref.ts'

// TODO: Rewrite this to lazily load TOC files.

type AppleSauce = {
  p: number
  l: number
}

type TOC = Record<string, Record<string, Record<string, AppleSauce>>>

const toc: TOC = tocJSON

const tocFromScroll: Record<ScrollName, TOC> = {
  torah: toc,
  esther: estherToc,
}

export function getPageCount(scroll: ScrollName) {
  // TODO(#134): Delete this workaround once table-of-contents-esther.json is accurate.
  if (scroll === 'esther') return 17
  const toc = tocFromScroll[scroll]
  const b = Math.max(...Object.keys(toc).map(Number))
  const c = Math.max(...Object.keys(toc[b]).map(Number))
  const v = Math.max(...Object.keys(toc[b][c]).map(Number))
  return toc[b][c][v].p
}

export const physicalLocationFromRef = ({
  b: book,
  c: chapter,
  v: verse,
  scroll,
}: RefWithScroll) => {
  if (!tocFromScroll[scroll]?.[book])
    throw new Error(`Unknown book ${scroll} #${book}`)
  const { p: pageNumber, l: lineNumber } =
    tocFromScroll[scroll][book][chapter][verse]
  return { pageNumber, lineNumber }
}
