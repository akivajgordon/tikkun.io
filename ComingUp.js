var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useEffect, useState } from 'react';
import scheduleFetcher from './schedule';
import _parshiyot from './data/parshiyot.json';
import _holydays from './data/holydays.json';
import slugify from './slugify';
const parshiyot = _parshiyot;
const holydays = _holydays;
export const ComingUp = ({ jumpToRef }) => {
    const { comingUp } = useComingUpReadings();
    return (React.createElement("div", { className: "stack medium" },
        React.createElement("label", { className: "section-label" }, "Coming up"),
        React.createElement("div", { style: { overflowX: 'auto' } },
            React.createElement("ol", { id: "coming-up-readings-list", className: "cluster", style: {
                    listStyle: 'none',
                    display: 'table',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    whiteSpace: 'nowrap',
                } }, comingUp.map((r, i) => (React.createElement(ComingUpReading, { key: r.key, reading: r, index: i, onClick: () => {
                    gtag('event', 'coming_up_selection', {
                        event_category: 'navigation',
                        event_label: ['due up', 'on deck', 'in the hole'][i],
                    });
                    jumpToRef({ ref: r.ref, source: 'comingUp', key: r.key });
                } })))))));
};
const useComingUpReadings = () => {
    const [schedule, setSchedule] = useState([]);
    useEffect(() => {
        const doIt = () => __awaiter(void 0, void 0, void 0, function* () {
            const schedule = yield scheduleFetcher.fetch();
            setSchedule(schedule);
        });
        doIt();
    }, []);
    const comingUp = schedule
        .filter((reading) => new Date(reading.datetime) > new Date())
        .slice(0, 3)
        .map((r, idx) => {
        const token = 'torah';
        const { ref, key } = {
            torah: (idx) => {
                const label = r.label;
                const parsha = parshaFromLabel({ label });
                return {
                    ref: Object.assign(Object.assign({}, parsha.ref), { scroll: 'torah' }),
                    key: idx === 0 ? 'next' : slugify(parsha.en),
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
        return Object.assign(Object.assign({}, r), { ref,
            key });
    });
    return { comingUp };
};
const ComingUpReading = ({ reading, index, onClick, }) => {
    const { label, date, datetime } = reading;
    const parsha = parshaFromLabel({ label });
    return (React.createElement("li", { style: {
            display: 'table-cell',
            width: 'calc(100% / 3)',
            padding: '0 0.5em',
        } },
        React.createElement("div", { className: "stack small", style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            } },
            React.createElement("button", { "data-target-class": "coming-up-reading", "data-idx": index, "data-key": index === 0 ? 'next' : slugify(parsha.en), className: "coming-up-button", onClick: () => onClick(reading) }, label),
            React.createElement("time", { className: "coming-up-date", dateTime: datetime }, date))));
};
const parshaFromLabel = ({ label }) => parshiyot.find(({ he }) => label.startsWith(he));
//# sourceMappingURL=ComingUp.js.map