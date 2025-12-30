export class PageDisplay {
    constructor(element, bookView) {
        this.element = element;
        bookView.on('page-updated', (page) => {
            this.setTitle(page.title);
        });
    }
    setTitle(title) {
        this.element.innerHTML = title;
    }
}
//# sourceMappingURL=page-display.js.map