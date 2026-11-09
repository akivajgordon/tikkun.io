export class RevealGesture {
    listen(book) {
        const PULL_THRESHOLD = 30; // px
        const PULL_MAXIMUM = 100;
        const endTouch = () => {
            book.classList.add('mod-pull-releasing');
            book.style.setProperty('--pull-translation', `0`);
        };
        let startX = 0;
        book.addEventListener('touchstart', (e) => {
            book.classList.remove('mod-pull-releasing');
            startX = e.changedTouches[0].screenX;
        });
        book.addEventListener('touchmove', (e) => {
            const touchX = e.changedTouches[0].screenX;
            const pullDistance = -Math.max(touchX - startX, -PULL_MAXIMUM);
            if (pullDistance < PULL_THRESHOLD)
                return;
            book.style.setProperty('--pull-translation', `${PULL_THRESHOLD - pullDistance}px`);
        });
        book.addEventListener('touchend', endTouch);
        book.addEventListener('touchcancel', endTouch);
    }
}
//# sourceMappingURL=reveal-gesture.js.map