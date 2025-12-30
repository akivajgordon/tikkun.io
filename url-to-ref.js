var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { defaultRef, resolveToValidRef } from './location';
import parshiyot from './data/parshiyot.json';
import holydays from './data/holydays.json';
const isURL = (url) => {
    try {
        new URL(url);
    }
    catch (e) {
        return false;
    }
    return true;
};
const hashOf = (url) => {
    if (!isURL(url))
        return '';
    return new URL(url).hash;
};
const RefRouter = {
    refFromPathParts: ({ pathParts }) => __awaiter(void 0, void 0, void 0, function* () {
        if (!pathParts || !pathParts[0].length)
            return defaultRef();
        const locationMatch = pathParts[0].match(/(\d+)\-(\d+)-(\d+)/);
        if (!locationMatch)
            return defaultRef();
        return resolveToValidRef({
            scroll: 'torah',
            book: locationMatch[1],
            chapter: locationMatch[2],
            verse: locationMatch[3],
        });
    }),
};
const ParshaRouter = {
    refFromPathParts: ({ pathParts }) => __awaiter(void 0, void 0, void 0, function* () {
        if (!pathParts || !pathParts[0].length)
            return defaultRef();
        const decoded = decodeURIComponent(pathParts[0]);
        const toLowercaseAlpha = (str) => str.toLowerCase().replace(/[^a-z]/g, '');
        const found = parshiyot.find(({ he, en }) => {
            return (he === decoded || toLowercaseAlpha(en) === toLowercaseAlpha(decoded));
        });
        if (!found)
            return defaultRef();
        const { b, c, v } = found.ref;
        return { scroll: 'torah', b, c, v };
    }),
};
const HolydayRouter = {
    refFromPathParts: ({ pathParts }) => __awaiter(void 0, void 0, void 0, function* () {
        const holyday = pathParts[0];
        const holydaysAndEsther = Object.assign(Object.assign({}, holydays), { esther: { ref: { b: 1, c: 1, v: 1 } } });
        const isRecognizedHolyday = (holyday) => Object.keys(holydaysAndEsther).includes(holyday);
        if (!isRecognizedHolyday(holyday))
            return defaultRef();
        return Object.assign({ scroll: holyday }, holydaysAndEsther[holyday].ref);
    }),
};
const NextRouter = {
    new: ({ scheduleFetcher }) => ({
        refFromPathParts: ({ asOfDate }) => __awaiter(void 0, void 0, void 0, function* () {
            const schedule = yield scheduleFetcher.fetch();
            const found = schedule.find(({ datetime }) => new Date(datetime) > new Date(asOfDate || Date.now()));
            if (!found)
                return defaultRef();
            const parsha = parshiyot.find(({ he }) => found.label.split('–')[0].trim() === he);
            const { b, c, v } = parsha.ref;
            return { scroll: 'torah', b, c, v };
        }),
    }),
};
const DefaultRouter = { refFromPathParts: () => defaultRef() };
const emptyScheduleFetcher = { fetch: () => __awaiter(void 0, void 0, void 0, function* () { return []; }) };
export default ({ url, asOfDate, scheduleFetcher = emptyScheduleFetcher, }) => __awaiter(void 0, void 0, void 0, function* () {
    const hashParts = hashOf(url).split('/').slice(1);
    const router = {
        r: RefRouter,
        p: ParshaRouter,
        h: HolydayRouter,
        next: NextRouter.new({ scheduleFetcher }),
    }[hashParts[0]] || DefaultRouter;
    return yield router.refFromPathParts({
        pathParts: hashParts.slice(1),
        asOfDate,
    });
});
//# sourceMappingURL=url-to-ref.js.map