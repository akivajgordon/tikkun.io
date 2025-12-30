import { EventEmitter } from './event-emitter';
export class BookView extends EventEmitter {
    constructor(book) {
        super();
        this.book = book;
        this.updateCurrentPage();
        book.addEventListener('scroll', throttle(() => {
            this.updateCurrentPage();
        }, 300));
    }
    updateCurrentPage() {
        const pageAtCenter = this.pageAtCenter(this.book);
        if (!pageAtCenter)
            return;
        const page = Page.from(pageAtCenter);
        if (!this.currentPage || !this.currentPage.isPage(page)) {
            this.emit('page-updated', page);
            this.currentPage = page;
        }
    }
    pageAtCenter(book) {
        const bookBoundingRect = book.getBoundingClientRect();
        const centerOfBookRelativeToViewport = {
            x: bookBoundingRect.left + bookBoundingRect.width / 2,
            y: bookBoundingRect.top + bookBoundingRect.height / 2,
        };
        const pageAtCenter = [...book.querySelectorAll('.tikkun-page')].find((page) => {
            const rect = page.getBoundingClientRect();
            return (rect.top < centerOfBookRelativeToViewport.y &&
                rect.bottom > centerOfBookRelativeToViewport.y);
        });
        return pageAtCenter;
    }
}
class Page {
    constructor({ id, title }) {
        this.id = id;
        this.title = title;
    }
    static from(p) {
        return new Page({
            id: p.getAttribute('data-page-number'),
            title: p.getAttribute('data-page-title'),
        });
    }
    isPage(other) {
        return this.id === other.id;
    }
}
function throttle(func, limit) {
    let inThrottle;
    let lastResult;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
            lastResult = func.apply(context, args);
        }
        return lastResult;
    };
}
//# sourceMappingURL=book-view.js.map