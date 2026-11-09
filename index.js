/* global gtag */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React from 'react';
import { createRoot } from 'react-dom/client';
import InfiniteScroller from './infinite-scroller';
import urlToRef from './url-to-ref';
import scheduleFetcher from './schedule';
import { BookView } from './book-view';
import { PageDisplay } from './page-display';
import { App, Annotations, Debug } from './App.jsx';
import { renderNext, renderPrevious } from './page-render';
import { hideParshaPicker } from './picker-toggle';
import { AppJumper } from './app-jumper';
import { ScrollPosition } from './scroll-position';
import { RevealGesture } from './reveal-gesture';
const appJumper = new AppJumper(hideParshaPicker);
const root = createRoot(document.getElementById('react-root'));
const root2 = createRoot(document.getElementById('react-root-2'));
root.render(React.createElement(App, { app: appJumper }));
root2.render(React.createElement(React.Fragment, null,
    React.createElement(Annotations, null),
    React.createElement(Debug, null)));
const setAppHeight = () => {
    // This prevents double-scroll bars from the inner "book" scrolling
    // when on browsers that have browser "chrome" (like the tab bar),
    // especially on mobile browsers
    document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
};
document.addEventListener('resize', setAppHeight);
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    const parshaTitle = document.querySelector('[data-target-id="parsha-title"]');
    const book = document.querySelector('[data-target-id="tikkun-book"]');
    const bookView = new BookView(book);
    new PageDisplay(parshaTitle, bookView);
    book.addEventListener('mouseover', (e) => {
        const line = document
            .elementsFromPoint(e.x, e.y)
            .find((e) => e.className.includes('line'));
        console.log(line);
    });
    InfiniteScroller.new({
        container: book,
        fetchPreviousContent: {
            fetch: () => appJumper.getScroll().fetchPrevious(),
            render: ({ content, title, pageNumber, }) => renderPrevious({
                content,
                title,
                pageNumber,
                getScroll: () => appJumper.getScroll(),
            }),
        },
        fetchNextContent: {
            fetch: () => appJumper.getScroll().fetchNext(),
            render: ({ content, title, pageNumber, }) => renderNext({
                content,
                title,
                pageNumber,
                getScroll: () => appJumper.getScroll(),
            }),
        },
    }).attach();
    new ScrollPosition().listen();
    new RevealGesture().listen(book);
    // watchForHighlighting()
    setAppHeight();
    const startingRef = yield urlToRef({
        url: window.location.href,
        scheduleFetcher,
    });
    appJumper.jumpTo({ ref: startingRef });
}));
//# sourceMappingURL=index.js.map