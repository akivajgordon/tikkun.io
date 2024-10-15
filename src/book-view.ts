import { EventEmitter } from './event-emitter.ts'
import { RenderedLineInfo } from './view-model/scroll-view-model.ts'

type BookViewEvents = {
  'viewport-updated': RenderedLineInfo[]
}

export class BookView extends EventEmitter<BookViewEvents> {
  private currentPage: Page
  private book: HTMLElement

  constructor(book: HTMLElement) {
    super()

    this.book = book
    this.updateCurrentPage()

    book.addEventListener(
      'scroll',
      throttle(() => {
        this.updateCurrentPage()
      }, 300)
    )
  }

  private updateCurrentPage() {
    const pageAtCenter = this.pageAtCenter(this.book)

    if (!pageAtCenter) return

    const page = Page.from(pageAtCenter)

    if (!this.currentPage || !this.currentPage.isPage(page)) {
      this.emit('page-updated', page)
      this.currentPage = page
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

class Page {
  private id: string
  title: string

  constructor({ id, title }: { id: string; title: string }) {
    this.id = id
    this.title = title
  }

  static from(p: Element): Page {
    return new Page({
      id: p.getAttribute('data-page-number'),
      title: p.getAttribute('data-page-title'),
    })
  }

  isPage(other: Page): boolean {
    return this.id === other.id
  }
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
