import { loadScroll } from '../location.ts'
import type { ScrollName } from '../ref.ts'
import type { RenderedPageInfo } from '../view-model/scroll-view-model.ts'
import { selectEdge, type ColumnSelection } from './column-selection.ts'
import { loadPageInfo, sheetHtml } from './print-columns.ts'
import { formatRef, pageVerseRange } from './verse-labels.ts'

/**
 * Shows every column of the scroll as a shaded sheet in a scrollable strip.
 * Clicking a sheet adds it to (or trims it from) the printed selection.
 * Resolves with the selected page numbers, or null if cancelled.
 */
export async function previewPrint(
  scroll: ScrollName,
  currentPage: number,
): Promise<number[] | null> {
  const pageCount = (await loadScroll(scroll)).getPageCount()

  const root = document.createElement('div')
  root.className = 'print-preview'
  root.innerHTML = `
    <header class="print-preview-header">
      <div>
        <h2 class="print-preview-heading"></h2>
        <p class="print-preview-hint">The blue-outlined column is where you were reading. Click any column to make it the first or last one printed.</p>
      </div>
      <div class="print-preview-actions">
        <button data-action="cancel">Cancel</button>
        <button data-action="print" class="mod-primary">Print</button>
      </div>
    </header>
    <div class="print-preview-carousel">
      ${Array.from(
        { length: pageCount },
        (_, i) => `
        <button class="preview-slot" data-page="${i + 1}">
          <div class="preview-sheet-holder"></div>
          <span class="preview-label">Column ${i + 1}</span>
        </button>`,
      ).join('')}
    </div>`
  document.body.appendChild(root)

  const heading = root.querySelector('.print-preview-heading')!
  const carousel = root.querySelector<HTMLElement>('.print-preview-carousel')!
  const slots = [...root.querySelectorAll<HTMLElement>('.preview-slot')]
  slots[currentPage - 1].dataset.anchor = 'true'

  const infos = new Map<number, Promise<RenderedPageInfo>>()
  const info = (n: number) => {
    if (!infos.has(n)) infos.set(n, loadPageInfo(scroll, n))
    return infos.get(n)!
  }

  let selection: ColumnSelection = { first: currentPage, last: currentPage }
  let headingToken = 0
  const update = async () => {
    slots.forEach((slot, i) => {
      const n = i + 1
      slot.dataset.selected = String(
        n >= selection.first && n <= selection.last,
      )
    })
    const token = ++headingToken
    const [firstPage, lastPage] = await Promise.all([
      info(selection.first),
      info(selection.last),
    ])
    if (token !== headingToken) return
    const start = pageVerseRange(firstPage)?.start
    const end = pageVerseRange(lastPage)?.end
    const count = selection.last - selection.first + 1
    heading.textContent =
      `Printing ${count} column${count === 1 ? '' : 's'}` +
      (start && end
        ? ` (${formatRef(scroll, start)} to ${formatRef(scroll, end)})`
        : '')
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const slot = entry.target as HTMLElement
        observer.unobserve(slot)
        void fill(slot)
      }
    },
    { root: carousel, rootMargin: '0px 100%' },
  )
  const fill = async (slot: HTMLElement) => {
    const page = await info(Number(slot.dataset.page))
    slot.querySelector('.preview-sheet-holder')!.innerHTML = sheetHtml(page)
    const range = pageVerseRange(page)
    if (range)
      slot.querySelector('.preview-label')!.textContent = `${formatRef(
        scroll,
        range.start,
      )} – ${formatRef(scroll, range.end)}`
  }

  // Shrink the sheets until a whole sheet and its label fit the strip's height.
  const LABEL_ALLOWANCE_PX = 40
  const fitSheets = () => {
    const holder = slots[0].querySelector<HTMLElement>('.preview-sheet-holder')!
    const baseZoom = 0.6
    root.style.setProperty('--z', String(baseZoom))
    const sheetPx = holder.offsetHeight / baseZoom
    const style = getComputedStyle(carousel)
    const available =
      carousel.clientHeight -
      parseFloat(style.paddingTop) -
      parseFloat(style.paddingBottom) -
      LABEL_ALLOWANCE_PX
    root.style.setProperty(
      '--z',
      String(Math.min(baseZoom, available / sheetPx)),
    )
  }

  return new Promise((resolve) => {
    const finish = (result: number[] | null) => {
      observer.disconnect()
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', fitSheets)
      root.remove()
      resolve(result)
    }
    const confirmSelection = () =>
      finish(
        Array.from(
          { length: selection.last - selection.first + 1 },
          (_, i) => selection.first + i,
        ),
      )
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish(null)
      // Slots stay focused after a click, so Enter there prints rather than re-clicks.
      if (
        e.key === 'Enter' &&
        !(e.target as Element).closest('[data-action]')
      ) {
        e.preventDefault()
        confirmSelection()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault()
        confirmSelection()
      }
    }
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', fitSheets)
    fitSheets()

    root.addEventListener('click', (e) => {
      const target = e.target as Element
      const action =
        target.closest<HTMLElement>('[data-action]')?.dataset.action
      if (action === 'cancel') return finish(null)
      if (action === 'print') return confirmSelection()
      const slot = target.closest<HTMLElement>('.preview-slot')
      if (!slot) return
      selection = selectEdge(selection, currentPage, Number(slot.dataset.page))
      void update()
    })

    slots[currentPage - 1].scrollIntoView({
      inline: 'center',
      block: 'nearest',
    })
    slots.forEach((slot) => observer.observe(slot))
    void update()
  })
}
