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

type ViewportTrackerEvents = {
  'viewport-updated': ViewportRange
}

export class ViewportTracker extends EventEmitter<ViewportTrackerEvents> {
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
      throttle(() => this.update(), 300)
    )
  }

  private update() {
    let updated = false

    // We cannot use ||  because we always need to update all trackers.
    const height = document.documentElement.clientHeight
    // TODO: Get actual height of new top bar.
    if (this.lineTrackers.first.update(64)) updated = true
    if (this.lineTrackers.center.update(height / 2)) updated = true
    if (this.lineTrackers.last.update(height - 1)) updated = true

    if (updated) {
      this.emit('viewport-updated', {
        first: this.lineTrackers.first.current,
        center: this.lineTrackers.center.current,
        last: this.lineTrackers.last.current,
      })
    }
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

const IterateDirection = {
  // If current < target, move up
  [-1]: ElementSearchDirection.Up,
  // If current > target, move down
  1: ElementSearchDirection.Down,
}

const sign = Math.sign as (arg: number) => -1 | 0 | 1

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
        document.documentElement.clientWidth / 2,
        targetY
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
    if (!this.walker.currentNode.isConnected) this.resetWalker(targetY)

    if (!(this.walker.currentNode instanceof Element))
      throw new Error('Not an element?')

    let isFirstIteration = true
    let iterateDir = sign(0)
    while (true) {
      const bounds = this.walker.currentNode.getBoundingClientRect()

      const delta = targetY - bounds[this.direction.coordinate]
      if (Math.abs(delta) < 0.5 * this.walker.currentNode.clientHeight) break

      // On the first iteration only, if we're too far, reset the search.
      if (isFirstIteration && Math.abs(delta) > 100) {
        this.resetWalker(targetY)
        isFirstIteration = false
        continue
      }
      isFirstIteration = false

      // If we overshot, stop immediately.
      if (iterateDir && iterateDir !== sign(delta)) break
      iterateDir = sign(delta)
      if (!iterateDir) break

      const prev: Element = this.walker.currentNode
      this.walker[IterateDirection[iterateDir].nextElement]()
      // If we ran out of nodes, stop.
      if (this.walker.currentNode === prev) break
    }

    let attemptCount = 0
    // If the line we found has no עלייה, search for a nearby one that does.
    // But don't look too far.
    // TODO: Move this to a separately cached layer for performance.
    while (
      !getLineInfo(this.walker.currentNode)?.aliyot.length &&
      ++attemptCount < 40
    ) {
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
