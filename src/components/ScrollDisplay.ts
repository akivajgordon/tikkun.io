import {
  RenderedEntry,
  RenderedMessageInfo,
  RenderedPageInfo,
  ScrollViewModel,
} from '../view-model/scroll-view-model'
import Page from './Page'
import utils from './utils'

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

  // TODO(later): Remove after rewriting picker?
  readonly rendered: Promise<void>

  constructor(readonly viewModel: ScrollViewModel, readonly root: HTMLElement) {
    purgeNode(root)

    this.rendered = viewModel.startingLocation.then(
      async ({ page, lineNumber }) => {
        const pageNode = await this.renderNext(page)
        const lines = [...pageNode.querySelectorAll<HTMLElement>('.line')]
        const lineIndex = lineNumber - 1

        const line = lines[lineIndex]
        // Wait for parsha picker to close so that we become measurable.
        requestAnimationFrame(() => {
          this.scrollTo({
            element: line,
          })
        })
      }
    )
  }

  private scrollTo({ element }: { element: HTMLElement }) {
    this.root.scrollTop =
      element.offsetTop + element.offsetHeight / 2 - this.root.offsetHeight / 2
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
