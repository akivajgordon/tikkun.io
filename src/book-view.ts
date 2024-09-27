import { EventEmitter } from './event-emitter.ts'

type BookViewEvents = {
  'page-updated': Page
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
      }, 300),
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
      },
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

type ThrottledFunction<T extends (...args: unknown[]) => unknown> = (
  ...args: Parameters<T>
) => ReturnType<T>

function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number,
): ThrottledFunction<T> {
  let inThrottle: boolean
  let lastResult: ReturnType<T>

  return function (this: unknown, ...args): ReturnType<T> {
    if (!inThrottle) {
      inThrottle = true

      setTimeout(() => (inThrottle = false), limit)

      lastResult = func.apply(this, args)
    }

    return lastResult
  }
}
