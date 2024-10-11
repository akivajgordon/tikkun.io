import tocJSON from './data/table-of-contents.json'
import estherToc from './data/table-of-contents-esther.json'
import holydaysToc from './data/table-of-contents-holydays.json'
import { RefWithScroll, ScrollName } from './ref.ts'

type AppleSauce = {
  p: number
  l: number
}

type TOC = Record<string, Record<string, Record<string, AppleSauce>>>

const toc: TOC = tocJSON

const tocFromScroll: Record<ScrollName, TOC> = {
  torah: toc,
  esther: estherToc,
  ...holydaysToc,
}

export const defaultRef = (): RefWithScroll => {
  return { scroll: 'torah', b: 1, c: 1, v: 1 }
}

const convertToValidInt = (val: string, validValues: object) => {
  return val && val in validValues ? parseInt(val) : 1
}

export function getPageCount(scroll: ScrollName) {
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
  const { p: pageNumber, l: lineNumber } =
    tocFromScroll[scroll][book][chapter][verse]
  return { pageNumber, lineNumber }
}

export const resolveToValidRef = ({
  scroll = 'torah',
  book,
  chapter,
  verse,
}: {
  scroll: string
  book: string
  chapter: string
  verse: string
}) => {
  const ref = defaultRef()
  if (scroll !== 'torah') {
    return ref
  }

  const toc = tocFromScroll.torah

  ref.b = convertToValidInt(book, toc)
  ref.c = convertToValidInt(chapter, toc[ref.b])
  ref.v = convertToValidInt(verse, toc[ref.b][ref.c])

  return {
    ...ref,
  }
}
