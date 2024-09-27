import { BookView } from './book-view.ts'

export class PageDisplay {
  element: HTMLElement

  constructor(element: HTMLElement, bookView: BookView) {
    this.element = element

    bookView.on('page-updated', (page) => {
      this.setTitle(page.title)
    })
  }

  setTitle(title: string) {
    this.element.innerHTML = title
  }
}
