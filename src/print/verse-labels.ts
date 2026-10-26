import type { Ref, ScrollName } from '../ref.ts'
import type { RenderedPageInfo } from '../view-model/scroll-view-model.ts'

const BOOK_ABBREVIATIONS: Record<ScrollName, string[]> = {
  torah: ['Gen', 'Exod', 'Lev', 'Num', 'Deut'],
  esther: ['Esth'],
}

export function formatRef(scroll: ScrollName, { b, c, v }: Ref) {
  return `${BOOK_ABBREVIATIONS[scroll][b - 1] ?? b} ${c}:${v}`
}

/** The first and last פסוק that begin on a page, or null if none do. */
export function pageVerseRange(
  page: Pick<RenderedPageInfo, 'lines'>
): { start: Ref; end: Ref } | null {
  const verses = page.lines.flatMap((line) => line.verses)
  if (!verses.length) return null
  return { start: verses[0], end: verses[verses.length - 1] }
}
