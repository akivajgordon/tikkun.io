import toc from '../build/table-of-contents.json'
import estherToc from '../build/table-of-contents-esther.json'
import holydaysToc from '../build/table-of-contents-holydays.json'

const tocFromScroll = {
  torah: toc,
  esther: estherToc,
  ...holydaysToc,
}

export const defaultRef = () => {
  return { scroll: 'torah', b: 1, c: 1, v: 1 }
}

const convertToValidInt = (val, validValues) => {
  return val && val in validValues ? parseInt(val) : 1
}

export const physicalLocationFromRef = ({
  ref: { b: book, c: chapter, v: verse },
  scroll,
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
    scroll,
    ...ref,
  }
}
