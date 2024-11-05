import {
  RenderedEntry,
  RenderedMessageInfo,
  RenderedPageInfo,
  ScrollViewModel,
} from '../view-model/scroll-view-model'
import Page from './Page.ts'
import utils from './utils.ts'

const { htmlToElement, purgeNode } = utils

/**
 * Renders pages of a ScrollViewModel into a root element.
 * This is used by index.ts to render the main UI, and by
 * unit tests to test code that interact with the scroll.
 */
export class ScrollDisplay {
  /** Renders an entry (from the view model) to the top of the scroll. */
  readonly renderPrevious = this.generateRender('afterbegin')
  /** Renders an entry (from the view model) to the bottom of the scroll. */
  readonly renderNext = this.generateRender('beforeend')

  /** Resolves to the starting line after all initial pages have been rendered on the root. */
  readonly rendered: Promise<HTMLElement>
  /** Resolves after we scroll to the starting line. */
  readonly scrolled: Promise<void>

  constructor(readonly viewModel: ScrollViewModel, readonly root: HTMLElement) {
    purgeNode(root)

    this.rendered = viewModel.startingLocation.then(
      async ({ page, lineNumber }) => {
        const pageNode = await this.renderNext(page)
        const lines = [...pageNode.querySelectorAll<HTMLElement>('.line')]
        const lineIndex = lineNumber - 1

        // If the target is in the top half of the page, render the previous page
        // so that we can scroll down to center the target.
        if (lineIndex < lines.length / 2) {
          const previousPage = await viewModel.fetchPreviousPage()
          if (previousPage) await this.renderPrevious(previousPage)
        } else {
          const nextPage = await viewModel.fetchNextPage()
          if (nextPage) await this.renderNext(nextPage)
        }

        return lines[lineIndex]
      }
    )
    this.scrolled = this.rendered.then(async (line) => {
      // Wait for parsha picker to close (from `this.rendered`)
      // so that we become measurable.
      await new Promise(requestAnimationFrame)
      this.scrollTo({ element: line })
    })
  }

  private scrollTo({ element }: { element: HTMLElement }) {
    // offsetTop is the <table>.  If we just rendered
    // the previous page, we must add its top.
    const relativeTop =
      element.offsetTop + (element.offsetParent as HTMLElement).offsetTop
    this.root.scrollTop =
      relativeTop + element.offsetHeight / 2 - this.root.offsetHeight / 2
    // Raise an event so that the title updates.
    this.root.dispatchEvent(new Event('scroll'))
  }

  private generateRender(insertPosition: InsertPosition) {
    return (entry: RenderedEntry) => {
      let node: Element
      if (entry.type === 'message') {
        node = renderMessageNode(entry)
      } else {
        node = renderPageNode(entry)
      }
      this.root.insertAdjacentElement(insertPosition, node)

      return node
    }
  }
}

function renderPageNode(page: RenderedPageInfo) {
  const node = document.createElement('div')
  node.classList.add('tikkun-page')
  node.tikkunPage = page

  node.appendChild(htmlToElement(Page(page)))

  return node
}

function renderMessageNode(entry: RenderedMessageInfo) {
  const node = document.createElement('div')
  node.classList.add('tikkun-message')

  const span = document.createElement('span')
  span.classList.add('tikkun-message-text')
  span.textContent = entry.text

  node.appendChild(span)
  return node
}
