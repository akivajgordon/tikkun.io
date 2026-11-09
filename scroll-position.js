export class ScrollPosition {
    constructor() {
        this.lastScrolledPosition = 0;
        this.pageAtTop = null;
    }
    listen() {
        this.scrollView.addEventListener('scroll', this.debounce(() => {
            this.recall();
        }, 1000));
        window.addEventListener('resize', () => {
            this.resume();
        });
    }
    get scrollView() {
        return document.querySelector('.tikkun-book');
    }
    resume() {
        if (!this.pageAtTop)
            return;
        const pageRect = this.pageAtTop.getBoundingClientRect();
        this.scrollView.scrollTop =
            this.pageAtTop.offsetTop + this.lastScrolledPosition * pageRect.height;
    }
    recall() {
        const scrollView = this.scrollView;
        const scrollViewBoundingRect = scrollView.getBoundingClientRect();
        const topOfScrollViewRelativeToViewport = {
            x: scrollViewBoundingRect.left + scrollViewBoundingRect.width / 2,
            y: scrollViewBoundingRect.top,
        };
        const pageAtTop = [
            ...document.elementsFromPoint(topOfScrollViewRelativeToViewport.x, topOfScrollViewRelativeToViewport.y),
        ].find((el) => el.className.includes('tikkun-page'));
        if (!pageAtTop)
            return;
        this.pageAtTop = pageAtTop;
        this.lastScrolledPosition =
            (scrollView.scrollTop - pageAtTop.offsetTop) / pageAtTop.clientHeight;
    }
    debounce(callback, delay) {
        let timeout;
        return () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                callback();
            }, delay);
        };
    }
}
//# sourceMappingURL=scroll-position.js.map