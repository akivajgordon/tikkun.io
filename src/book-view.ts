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
    first: LineViewportTracker
    center: LineViewportTracker
    last: LineViewportTracker
  }

  constructor(book: HTMLElement) {
    super()

    this.book = book
    this.lineTrackers = {
      first: new LineViewportTracker(ElementSearchDirection.Down, book),
      center: new LineViewportTracker(ElementSearchDirection.Down, book),
      last: new LineViewportTracker(ElementSearchDirection.Up, book),
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

interface ElementSearchDirection {
  coordinate: KeysOfType<DOMRect, number>
  /** The direction to walk to find a line that contains an עלייה. */
  nextElement: KeysOfType<TreeWalker, () => Node | null>
}

const ElementSearchDirection = {
  Down: { coordinate: 'top', nextElement: 'nextNode' },
  Up: { coordinate: 'bottom', nextElement: 'previousNode' },
} satisfies Record<string, ElementSearchDirection>

/**
 * Efficiently locates the closest RenderedLineInfo to a point on the screen.
 * Updates as the user scrolls.
 */
class LineViewportTracker {
  private readonly walker: TreeWalker
  constructor(
    private readonly direction: ElementSearchDirection,
    private readonly root: Element
  ) {
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

  /** Moves the current node to a nearby element. */
  private resetWalker(targetY: number) {
    this.walker.currentNode =
      document.elementFromPoint(
        targetY,
        document.documentElement.clientWidth / 2
      ) ?? this.root
  }

  /** Updates the current element.  Returns false if it did not change. */
  update(targetY: number): boolean {
    const current = this.current
    this.maybeUpdate(targetY)
    return current !== this.current
  }
  private maybeUpdate(targetY: number) {
    if (this.walker.currentNode === this.root) this.resetWalker(targetY)

    if (!(this.walker.currentNode instanceof Element))
      throw new Error('Not an element?')

    while (true) {
      const bounds = this.walker.currentNode.getBoundingClientRect()
      if (
        Math.abs(bounds[this.direction.coordinate] - targetY) <
        1.5 * this.walker.currentNode.clientHeight
      )
        break
      if (bounds[this.direction.coordinate] < targetY) this.walker.nextNode()
      else this.walker.previousNode()
    }

    let attemptCount = 0
    while (!getLineInfo(this.walker.currentNode) && ++attemptCount < 10) {
      this.walker[this.direction.nextElement]()
    }
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
