import Page from '../components/Page.ts'
import { loadPage } from '../location.ts'
import type { ScrollName } from '../ref.ts'
import type { RenderedPageInfo } from '../view-model/scroll-view-model.ts'

export async function loadPageInfo(
  scroll: ScrollName,
  pageNumber: number
): Promise<RenderedPageInfo> {
  const { default: rawLines } = await loadPage(scroll, pageNumber)
  return {
    type: 'page',
    scroll,
    pageNumber,
    lines: rawLines.map((line) => ({
      ...line,
      verses: line.verses.map((v) => ({ b: v.book, c: v.chapter, v: v.verse })),
      labels: [],
      aliyot: [],
    })),
  }
}

/** One printed sheet: plain text on the left, vowels and trop on the right. */
export const sheetHtml = (page: RenderedPageInfo) => `
  <section class="print-sheet">
    <div class="print-pane mod-annotations-off"><div class="tikkun-page">${Page(page)}</div></div>
    <div class="print-pane mod-annotations-on"><div class="tikkun-page">${Page(page)}</div></div>
  </section>`

/**
 * Prints each column as one sheet.  `print.css` hides the rest of the app
 * while printing.
 */
export async function printColumns(scroll: ScrollName, pageNumbers: number[]) {
  const pages = await Promise.all(
    pageNumbers.map((n) => loadPageInfo(scroll, n))
  )

  const root = document.createElement('div')
  root.className = 'print-root'
  root.innerHTML = pages.map(sheetHtml).join('')
  document.body.appendChild(root)
  // Print renders with whatever is loaded now; don't fall back to system fonts.
  await document.fonts.load('1em ShlomosemiStam')

  const cleanup = () => {
    root.remove()
    window.removeEventListener('afterprint', cleanup)
  }
  window.addEventListener('afterprint', cleanup)
  window.print()
}
