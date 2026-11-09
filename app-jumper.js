import { renderNext } from './page-render';
import scrollsByKey from './scrolls-by-key';
import utils from './components/utils';
const { purgeNode } = utils;
export class AppJumper {
    constructor(onJump) {
        this.onJump = onJump;
    }
    getScroll() {
        return this.scroll;
    }
    jumpTo({ ref }) {
        this.scroll = this.scrollFor(ref);
        this.clearBook();
        this.doJump();
    }
    doJump() {
        this.getScroll()
            .fetchNext()
            .then(({ content, title, pageNumber, }) => renderNext({
            content,
            title,
            pageNumber,
            getScroll: () => {
                return this.getScroll();
            },
        }))
            .then((pageNode) => {
            const lines = [...pageNode.querySelectorAll('.line')];
            const lineIndex = this.scroll.startingLineNumber - 1;
            const line = lines[lineIndex];
            this.scrollTo({
                element: line,
            });
        })
            .then(() => {
            this.onJump();
        });
    }
    scrollTo({ element }) {
        const book = document.querySelector('.tikkun-book');
        book.scrollTop =
            element.offsetTop + element.offsetHeight / 2 - book.offsetHeight / 2;
    }
    clearBook() {
        purgeNode(document.querySelector('[data-target-id="tikkun-book"]'));
    }
    scrollFor(ref) {
        return scrollsByKey[ref.scroll].new({ startingAtRef: ref });
    }
}
//# sourceMappingURL=app-jumper.js.map