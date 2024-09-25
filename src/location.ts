import tocJSON from './data/table-of-contents.json'
import estherToc from './data/table-of-contents-esther.json'
import holydaysToc from './data/table-of-contents-holydays.json'
import { RefWithScroll } from './ref.ts'

type AppleSauce = {
  p: number
  l: number
}

type TOC = Record<string, Record<string, Record<string, AppleSauce>>>

const toc: TOC = tocJSON

const tocFromScroll: Record<string, TOC> = {
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

export const physicalLocationFromRef = ({
  ref: { b: book, c: chapter, v: verse },
  scroll,
}: {
  ref: Omit<RefWithScroll, 'scroll'>
  scroll: keyof typeof tocFromScroll
}) => {
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
