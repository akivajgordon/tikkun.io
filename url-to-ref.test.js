var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import test from 'ava';
import urlToRef from './url-to-ref';
const BEREISHIT_1 = { scroll: 'torah', b: 1, c: 1, v: 1 };
const url = (afterHost) => `https://tikkun.io${afterHost}`;
test('non-URL input', (t) => __awaiter(void 0, void 0, void 0, function* () {
    t.deepEqual(yield urlToRef({ url: 'hello world' }), BEREISHIT_1);
}));
test('URL with no hash part', (t) => __awaiter(void 0, void 0, void 0, function* () {
    t.deepEqual(yield urlToRef({ url: url('/foo/bar?baz=quux') }), BEREISHIT_1);
}));
test('URL with nothing after the hash', (t) => __awaiter(void 0, void 0, void 0, function* () {
    t.deepEqual(yield urlToRef({ url: url('/#') }), BEREISHIT_1);
}));
test('Only /r supported', (t) => __awaiter(void 0, void 0, void 0, function* () {
    t.deepEqual(yield urlToRef({ url: url('/#/kav/tzav') }), BEREISHIT_1);
}));
test('Invalid location reference: Not numbers', (t) => __awaiter(void 0, void 0, void 0, function* () {
    t.deepEqual(yield urlToRef({ url: url('/#/r/foo-bar-baz') }), BEREISHIT_1);
}));
test('Invalid location reference: incomplete', (t) => __awaiter(void 0, void 0, void 0, function* () {
    t.deepEqual(yield urlToRef({ url: url('/#/r/5-22') }), BEREISHIT_1);
}));
test('Valid location reference', (t) => __awaiter(void 0, void 0, void 0, function* () {
    t.deepEqual(yield urlToRef({ url: url('/#/r/4-13-1') }), {
        scroll: 'torah',
        b: 4,
        c: 13,
        v: 1,
    });
}));
test('Trailing slash okay', (t) => __awaiter(void 0, void 0, void 0, function* () {
    t.deepEqual(yield urlToRef({ url: url('/#/r/4-13-1/') }), {
        scroll: 'torah',
        b: 4,
        c: 13,
        v: 1,
    });
}));
test('Location references default to 1 if out of bounds', (t) => __awaiter(void 0, void 0, void 0, function* () {
    t.deepEqual(yield urlToRef({ url: url('/#/r/4-999-99/') }), {
        scroll: 'torah',
        b: 4,
        c: 1,
        v: 1,
    });
}));
test('accepts parsha input with hebrew name', (t) => __awaiter(void 0, void 0, void 0, function* () {
    t.deepEqual(yield urlToRef({ url: url('/#/p/נשא') }), {
        scroll: 'torah',
        b: 4,
        c: 4,
        v: 21,
    });
}));
test('accepts parsha input with lowercase english name', (t) => __awaiter(void 0, void 0, void 0, function* () {
    t.deepEqual(yield urlToRef({ url: url('/#/p/emor') }), {
        scroll: 'torah',
        b: 3,
        c: 21,
        v: 1,
    });
}));
test(`accepts parsha input ignoring non-alphanumeric characters in english (to allow, e.g. shlach for the parsha "Sh'lach")`, (t) => __awaiter(void 0, void 0, void 0, function* () {
    t.deepEqual(yield urlToRef({ url: url('/#/p/shlach') }), {
        scroll: 'torah',
        b: 4,
        c: 13,
        v: 1,
    });
}));
test(`accepts parsha input without spaces in english (to allow, e.g. ki-tavo for the parsha "Ki Tavo")`, (t) => __awaiter(void 0, void 0, void 0, function* () {
    t.deepEqual(yield urlToRef({ url: url('/#/p/ki-tavo') }), {
        scroll: 'torah',
        b: 5,
        c: 26,
        v: 1,
    });
}));
test('returns default ref for non-existant parsha (hebrew)', (t) => __awaiter(void 0, void 0, void 0, function* () {
    t.deepEqual(yield urlToRef({ url: url('/#/p/לא-פרשה') }), BEREISHIT_1);
}));
test('returns default ref for non-existant parsha (english)', (t) => __awaiter(void 0, void 0, void 0, function* () {
    t.deepEqual(yield urlToRef({ url: url('/#/p/not-a-parsha') }), BEREISHIT_1);
}));
test('returns next parsha given specified date', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const BEFORE_KORACH_5781 = '2021-06-10';
    t.deepEqual(yield urlToRef({
        url: url('/#/next'),
        asOfDate: BEFORE_KORACH_5781,
        scheduleFetcher: {
            fetch: () => [
                {
                    label: 'שלח',
                    datetime: '2021-06-05',
                    date: 'Jun 5',
                },
                {
                    label: 'קרח',
                    datetime: '2021-06-12',
                    date: 'Jun 12',
                },
                {
                    label: 'חקת',
                    datetime: '2021-06-19',
                    date: 'Jun 19',
                },
            ],
        },
    }), { scroll: 'torah', b: 4, c: 16, v: 1 });
}));
test('returns default ref for non-existant holyday reading', (t) => __awaiter(void 0, void 0, void 0, function* () {
    t.deepEqual(yield urlToRef({ url: url('/#/h/not-a-special-reading') }), BEREISHIT_1);
}));
test('returns esther ref for esther as a holyday reading', (t) => __awaiter(void 0, void 0, void 0, function* () {
    t.deepEqual(yield urlToRef({ url: url('/#/h/esther') }), {
        scroll: 'esther',
        b: 1,
        c: 1,
        v: 1,
    });
}));
//# sourceMappingURL=url-to-ref.test.js.map