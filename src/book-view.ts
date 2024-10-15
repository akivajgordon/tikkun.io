import { EventEmitter } from './event-emitter.ts'
import {
  RenderedLineInfo,
  RenderedPageInfo,
} from './view-model/scroll-view-model.ts'

interface ViewportRange {
  first: RenderedLineInfo | null
  center: RenderedLineInfo | null
  last: RenderedLineInfo | null
}

declare global {
  interface Element {
    tikkunPage?: RenderedPageInfo
  }
}

type BookViewEvents = {
  'viewport-updated': ViewportRange
}

export class BookView extends EventEmitter<BookViewEvents> {
  private book: HTMLElement
  private readonly lineTrackers: {
    first: ViewportTracker
    center: ViewportTracker
    last: ViewportTracker
  }

  constructor(book: HTMLElement) {
    super()

    this.book = book
    this.lineTrackers = {
      first: new ViewportTracker(book),
      center: new ViewportTracker(book),
      last: new ViewportTracker(book),
    }
    this.update()

    book.addEventListener(
      'scroll',
      throttle(() => {
        this.update()
      }, 300)
    )
  }

  private update() {
    let updated = false

    // We cannot use ||  because we always need to update all trackers.
    const height = document.documentElement.clientHeight
    if (this.lineTrackers.first.update(0)) updated = true
    if (this.lineTrackers.center.update(height / 2)) updated = true
    if (this.lineTrackers.last.update(height)) updated = true

    if (updated) {
      this.emit('viewport-updated', {
        first: this.lineTrackers.first.current,
        center: this.lineTrackers.center.current,
        last: this.lineTrackers.last.current,
      })
    }
  }

  private pageAtCenter(book: HTMLElement) {
    const bookBoundingRect = book.getBoundingClientRect()

    const centerOfBookRelativeToViewport = {
      x: bookBoundingRect.left + bookBoundingRect.width / 2,
      y: bookBoundingRect.top + bookBoundingRect.height / 2,
    }

    const pageAtCenter = [...book.querySelectorAll('.tikkun-page')].find(
      (page) => {
        const rect = page.getBoundingClientRect()

        return (
          rect.top < centerOfBookRelativeToViewport.y &&
          rect.bottom > centerOfBookRelativeToViewport.y
        )
      }
    )

    return pageAtCenter
  }
}

type KeysOfType<TObject, TType> = {
  [TKey in keyof TObject]: TObject[TKey] extends TType ? TKey : never
}[keyof TObject]

const ElementSearchDirection = {
  Down: { coordinate: 'top', nextElement: 'nextNode' },
  Up: { coordinate: 'bottom', nextElement: 'previousNode' },
} satisfies Record<
  string,
  {
    coordinate: keyof DOMRect
    nextElement: KeysOfType<TreeWalker, () => Node | null>
  }
>

/**
 * Efficiently locates the closest RenderedLineInfo to a point on the screen.
 * Updates as the user scrolls.
 */
class ViewportTracker {
  private readonly walker: TreeWalker
  constructor(root: Element) {
    this.walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_ELEMENT,
      (el) => {
        if (!(el instanceof HTMLElement)) return NodeFilter.FILTER_REJECT
        if (el.tagName === 'TD') return NodeFilter.FILTER_REJECT
        if (el.dataset.lineIndex) return NodeFilter.FILTER_ACCEPT
        return NodeFilter.FILTER_SKIP
      }
    )
  }

  get current() {
    return getLineInfo(this.walker.currentNode)
  }

  /** Updates the current element.  Returns false if it did not change. */
  update(targetY: number): boolean {
    // TODO: Actually locate, then track, walker.currentNode.
    return true
  }
}

function getLineInfo(el: Node) {
  if (!(el instanceof HTMLElement)) return null
  const pageNode = el.closest('.tikkun-page')
  return pageNode?.tikkunPage?.lines[Number(el.dataset.lineIndex)] ?? null
}

function throttle<TReturn, TArgs extends unknown[]>(
  func: (...args: TArgs) => TReturn,
  limit: number
): (...args: TArgs) => TReturn {
  let inThrottle: boolean
  let lastResult: TReturn

  return function (this: unknown, ...args): TReturn {
    if (!inThrottle) {
      inThrottle = true

      setTimeout(() => (inThrottle = false), limit)

      lastResult = func.apply(this, args)
    }

    return lastResult
  }
}
