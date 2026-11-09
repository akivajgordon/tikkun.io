/* global gtag */
import _parshiyot from '../data/parshiyot.json';
import _holydays from '../data/holydays.json';
import fuzzy from '../fuzzy';
import slugify from '../slugify';
import utils from './utils';
import ParshaResult, { NoResults } from './ParshaResult';
import Search from './Search';
import EventEmitter from '../event-emitter';
import { createRoot } from 'react-dom/client';
import React from 'react';
import { ComingUp } from '../ComingUp';
import { Browse2 } from '../Browse';
const parshiyot = _parshiyot;
const holydays = _holydays;
const { htmlToElement } = utils;
const searchables = [
    ...parshiyot.map((p, index) => (Object.assign(Object.assign({ idx: index, token: 'torah' }, p), { key: slugify(p.en) }))),
    {
        idx: 'esther',
        token: 'esther',
        he: 'אסתר',
        en: 'Esther',
        key: 'esther',
    },
    ...Object.keys(holydays).map((holydayKey) => {
        const holyday = holydays[holydayKey];
        const { he, en } = holyday;
        return {
            idx: holydayKey,
            token: 'holydays',
            en,
            he,
            key: holydayKey,
        };
    }),
];
const searchResults = (query) => {
    return fuzzy(searchables, query, (parsha) => [parsha.he, parsha.en]);
};
const top = (n) => (_, i) => i < n;
const search = (query) => {
    const results = searchResults(query);
    if (!results.length)
        return [NoResults()];
    return results.filter(top(5)).map((result) => ParshaResult(result));
};
export default (jumpToRef) => {
    const searchEmitter = EventEmitter.new();
    const s = Search({ search, emitter: searchEmitter });
    const self = htmlToElement(`
    <div class="parsha-picker">
      <div class="stack xlarge">
        <div class="centerize">
          <div id="search" style="display: inline-block;"></div>
        </div>
        <section dir="ltr" id="coming-up" class="section mod-alternate mod-padding">
        </section>
        <section id="browse">
        </section>
      </div>
    </div>
  `);
    setTimeout(() => {
        const reactRoot = createRoot(document.querySelector('#coming-up'));
        const browseRoot = createRoot(document.querySelector('#browse'));
        reactRoot.render(React.createElement(ComingUp, { jumpToRef: jumpToRef }));
        browseRoot.render(React.createElement(Browse2, { jumpToRef: jumpToRef }));
    }, 0);
    searchEmitter.on('selection', (selected) => {
        gtag('event', 'search_selection', {
            event_category: 'navigation',
            event_label: selected
                .querySelector('[data-target-class="result-hebrew"]')
                .textContent.trim(),
        });
        const result = selected.querySelector('[data-target-class="parsha-result"]');
        const idx = result.getAttribute(`data-idx`);
        const token = result.getAttribute(`data-token`);
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
        jumpToRef({ ref, source: 'search', key });
    });
    searchEmitter.on('search', (query) => {
        self.querySelector('.browse').classList.add('u-hidden');
        self.querySelector('#coming-up').classList.add('u-hidden');
        gtag('event', 'search', {
            event_category: 'navigation',
            event_label: query,
        });
    });
    searchEmitter.on('clear', () => {
        self.querySelector('.browse').classList.remove('u-hidden');
        self.querySelector('#coming-up').classList.remove('u-hidden');
    });
    self
        .querySelector('#search')
        .parentNode.replaceChild(s.node, self.querySelector('#search'));
    [...self.querySelectorAll('[data-target-id="parsha"]')].forEach((parsha) => {
        parsha.addEventListener('click', (e) => {
            const target = e.target;
            gtag('event', 'browse_selection', {
                event_category: 'navigation',
                event_label: target.textContent.trim(),
            });
            const idx = target.getAttribute(`data-idx`);
            const token = target.getAttribute(`data-token`);
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
            jumpToRef({ ref, source: 'browse', key });
        });
    });
    return {
        node: self,
        onMount: () => {
            setTimeout(() => s.focus(), 0);
        },
    };
};
//# sourceMappingURL=ParshaPicker.js.map