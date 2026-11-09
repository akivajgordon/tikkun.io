import React, { createContext, useContext } from 'react';
import _parshiyot from './data/parshiyot.json';
import _holydays from './data/holydays.json';
import slugify from './slugify';
const parshiyot = _parshiyot;
const holydays = _holydays;
export const Browse2 = ({ jumpToRef }) => {
    const books = parshiyot.reduce((books, parsha, idx) => {
        const book = parsha.ref.b;
        books[book] = books[book] || [];
        books[book].push(Object.assign(Object.assign({}, parsha), { idx }));
        return books;
    }, []);
    return (React.createElement(BrowseProvider, { jumpToRef: jumpToRef },
        React.createElement("div", { className: "browse" },
            React.createElement("h2", { className: "section-heading" }, "\u05E4\u05E8\u05E9\u05EA \u05D4\u05E9\u05D1\u05D5\u05E2"),
            React.createElement("ol", { className: "parsha-books mod-emphasize-first-in-group" }, books.map((book) => (React.createElement(BookView, { book: book })))),
            React.createElement("h2", { className: "section-heading" }, "\u05D7\u05D2\u05D9\u05DD"),
            React.createElement("ol", { className: "parsha-books" }, holydaysLayout.map((col) => (React.createElement("li", { className: "parsha-book" },
                React.createElement("ol", { className: "parsha-list" }, col.map((holydayKey) => {
                    const holyday = holydays[holydayKey];
                    return (React.createElement(Parsha, { idx: holydayKey,
                        token: 'holydays',
                        he: holyday.he,
                        key: holydayKey }));
                })))))),
            React.createElement("h2", { className: "section-heading" }, "\u05DE\u05D2\u05D9\u05DC\u05D5\u05EA"),
            React.createElement("ol", { className: "parsha-books" },
                React.createElement("li", { className: "parsha-book" },
                    React.createElement("ol", { className: "parsha-list" },
                        React.createElement(Parsha, { idx: 'esther',
                            token: 'esther',
                            he: 'אסתר',
                            key: 'esther' })))))));
};
const BrowseContext = createContext({ jumpToRef: () => { } });
const BrowseProvider = ({ jumpToRef, children, }) => {
    return (React.createElement(BrowseContext.Provider, { value: { jumpToRef } }, children));
};
const BookView = ({ book }) => (React.createElement("li", { className: "parsha-book" },
    React.createElement("ol", { className: "parsha-list" }, book.map((p) => (React.createElement(Parsha, { idx: p.idx, token: 'torah', he: p.he, key: slugify(p.en) }))))));
const useJumpToParsha = () => {
    const context = useContext(BrowseContext);
    if (!context) {
        throw new Error('useJumpToParsha must be used within a BrowseProvider');
    }
    return (parsha) => {
        gtag('event', 'browse_selection', {
            event_category: 'navigation',
            event_label: parsha.he,
        });
        const { ref, key } = parshaInfo(parsha.token, parsha.idx);
        return context.jumpToRef({ ref, source: 'browse', key });
    };
};
const Parsha = (parsha) => {
    const jumpToParsha = useJumpToParsha();
    const { idx, token, he, key } = parsha;
    return (React.createElement("li", null,
        React.createElement("button", { className: "parsha", "data-idx": idx, "data-token": token, "data-target-id": "parsha", "data-key": key, onClick: () => jumpToParsha(parsha) }, he)));
};
const parshaInfo = (token, idx) => {
    const { ref, key } = {
        torah: (idx) => {
            const parsha = parshiyot[Number(idx)];
            return {
                ref: Object.assign(Object.assign({}, parsha.ref), { scroll: 'torah' }),
                key: slugify(parsha.en),
            };
        },
        holydays: (idx) => ({
            ref: Object.assign(Object.assign({}, holydays[idx].ref), { scroll: idx }),
            key: idx,
        }),
        esther: () => ({
            ref: { b: 1, c: 1, v: 1, scroll: 'esther' },
            key: 'esther',
        }),
    }[token](idx);
    return { ref, key };
};
const holydaysLayout = [
    [
        'rosh-1',
        'rosh-2',
        'yom-kippur',
        'rosh-chodesh',
        'taanit-tzibur',
        'tisha-bav',
        'shavuot-1',
        'shavuot-2',
    ],
    [
        'sukkot-1',
        'sukkot-2',
        'sukkot-3',
        'sukkot-4',
        'sukkot-5',
        'sukkot-6',
        'sukkot-7',
        'sukkot-shabbat-chol-hamoed',
        'shmini-atzeret',
        'simchat-torah',
    ],
    [
        'pesach-1',
        'pesach-2',
        'pesach-3',
        'pesach-4',
        'pesach-5',
        'pesach-6',
        'pesach-shabbat-chol-hamoed',
        'pesach-7',
        'pesach-8',
    ],
    [
        'purim',
        'chanukah-1',
        'chanukah-2',
        'chanukah-3',
        'chanukah-4',
        'chanukah-5',
        'chanukah-7',
        'chanukah-8',
    ],
];
//# sourceMappingURL=Browse.js.map