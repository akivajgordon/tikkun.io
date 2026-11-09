import Page from './components/Page';
import utils from './components/utils';
import { insertAfter, insertBefore } from './dom';
const { htmlToElement } = utils;
const makePageNode = ({ title, pageNumber, }) => {
    const node = document.createElement('div');
    node.classList.add('tikkun-page');
    node.setAttribute('data-page-title', title);
    node.setAttribute('data-page-number', pageNumber.toString(10));
    return node;
};
const renderTitle = ({ title }) => {
    document.querySelector('[data-target-id="parsha-title"]').innerHTML = title;
};
const updatePageTitle = () => {
    const bookBoundingRect = document
        .querySelector('.tikkun-book')
        .getBoundingClientRect();
    const centerOfBookRelativeToViewport = {
        x: bookBoundingRect.left + bookBoundingRect.width / 2,
        y: bookBoundingRect.top + bookBoundingRect.height / 2,
    };
    const pageAtCenter = [
        ...document.elementsFromPoint(centerOfBookRelativeToViewport.x, centerOfBookRelativeToViewport.y),
    ].find((el) => el.className.includes('tikkun-page'));
    if (!pageAtCenter)
        return;
    renderTitle({ title: pageAtCenter.getAttribute('data-page-title') });
};
const renderPage = ({ insertStrategy: insert, }) => ({ content, title, pageNumber, getScroll, }) => {
    const node = makePageNode({ title, pageNumber });
    insert(document.querySelector('[data-target-id="tikkun-book"]'), node);
    const el = htmlToElement(Page({ scroll: getScroll(), lines: content }));
    const firstChild = node.firstChild;
    if (firstChild) {
        node.replaceChild(el, firstChild);
    }
    else {
        node.appendChild(el);
    }
    setTimeout(updatePageTitle, 0);
    debug(`Rendering ${pageNumber}`);
    return node;
};
export const renderPrevious = renderPage({ insertStrategy: insertBefore });
export const renderNext = renderPage({ insertStrategy: insertAfter });
const debug = (str) => {
    const container = document.querySelector('#debug');
    container.innerHTML = str;
};
//# sourceMappingURL=page-render.js.map