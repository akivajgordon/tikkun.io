import IntegerIterator from './integer-iterator'
import { physicalLocationFromRef } from './location'
import getTitle from './title'
import pageTitles from './data/page-titles.json'
import _holydays from './data/holydays.json'
import parshiyot from './data/parshiyot.json'
import _aliyotJSON from './data/aliyot.json'
import { Ref } from './ref'

const holydays: Record<string, { en: string; he: string; ref: Ref }> = _holydays
const aliyotJSON: Record<
  string,
  Record<string, Record<string, {}>>
> = _aliyotJSON

const fetchPage = ({
  path,
  title,
  pageNumber,
}: {
  path: string
  title: string
  pageNumber: unknown
}) =>
  window
    .fetch(path)
    .then((res) => res.json())
    .then((page) => ({ content: page, title, pageNumber }))
    .catch((err) => {
      console.error(err)
    })

const aliyotStrings = [
  'ראשון',
  'שני',
  'שלישי',
  'רביעי',
  'חמישי',
  'ששי',
  'שביעי',
  'מפטיר',
]

const aliyahName = ({
  aliyah,
  getParshaName,
}: {
  aliyah: number
  getParshaName: () => string
}) => {
  if (aliyah < 1 || aliyah > aliyotStrings.length) return null

  if (aliyah === 1) return getParshaName()

  return aliyotStrings[aliyah - 1]
}

export type ScrollType = ReturnType<typeof Scroll['new']>

const Scroll = {
  new: ({
    scroll,
    makePath,
    makeTitle,
    startingAtRef = { b: 1, c: 1, v: 1 },
    aliyotByRef,
    aliyahFinder,
  }: {
    scroll: string
    makePath: (n: number) => string
    makeTitle: (n: number) => string
    startingAtRef: Ref
    aliyotByRef: Record<
      string,
      Record<
        string,
        Record<string, { standard: number[]; double: number; special: number }>
      >
    >
    aliyahFinder: { he: string; ref: Ref }[]
  }) => {
    const { pageNumber, lineNumber } = physicalLocationFromRef({
      ref: startingAtRef,
      scroll,
    })

    const iterator = IntegerIterator.new({ startingAt: pageNumber })

    return {
      scrollName: scroll,
      fetchPrevious: () => {
        const n = iterator.previous()
        if (n <= 0) return Promise.resolve()
        return fetchPage({
          path: makePath(n),
          title: makeTitle(n),
          pageNumber: n,
        })
      },
      fetchNext: () => {
        const n = iterator.next()
        return fetchPage({
          path: makePath(n),
          title: makeTitle(n),
          pageNumber: n,
        })
      },
      startingLineNumber: lineNumber,
      aliyotFor: ({
        verses,
      }: {
        verses: { book: number; chapter: number; verse: number }[]
      }) => {
        const found = verses
          .map(({ book, chapter, verse }) => {
            return aliyotByRef?.[book]?.[chapter]?.[verse]
          })
          .filter(Boolean)

        if (!found.length) return ''

        const { standard, double, special } = found[0]

        const display = (aliyah: number) => {
          return aliyahName({
            aliyah,
            getParshaName: () => {
              const found = aliyahFinder.find(({ ref }) =>
                verses.some(
                  ({ book: b, chapter: c, verse: v }) =>
                    ref.b === b && ref.c === c && ref.v === v
                )
              )

              return found?.he
            },
          })
        }

        return [
          ...(standard
            ? [standard.map((n: number) => display(n)).join(', ')]
            : []),
          ...(double ? [`[${display(double)}]`] : []),
          ...(special ? [`(${display(special)})`] : []),
        ].join(' ')
      },
    }
  },
}

const TorahScroll = {
  new: ({ startingAtRef }: { startingAtRef: Ref }): ScrollType => {
    return Scroll.new({
      scroll: 'torah',
      makePath: (n) => `/data/pages/torah/${n}.json`,
      makeTitle: (n) => getTitle(pageTitles[n - 1]),
      startingAtRef,
      aliyahFinder: parshiyot,
      aliyotByRef: aliyotJSON.torah,
    })
  },
}

const EstherScroll = {
  new: ({ startingAtRef }: { startingAtRef: Ref }): ScrollType => {
    return Scroll.new({
      scroll: 'esther',
      makePath: (n) => `/data/pages/esther/${n}.json`,
      makeTitle: () => 'אסתר',
      startingAtRef,
      aliyahFinder: [],
      aliyotByRef: aliyotJSON.esther,
    })
  },
}

export default {
  torah: TorahScroll,
  esther: EstherScroll,
  ...Object.keys(holydays).reduce((result, holydayKey) => {
    const HolydayScroll = {
      new: ({ startingAtRef }: { startingAtRef: Ref }): ScrollType => {
        return Scroll.new({
          scroll: holydayKey,
          makePath: (n) => `/data/pages/${holydayKey}/${n}.json`,
          makeTitle: () => holydays[holydayKey].he,
          startingAtRef,
          aliyahFinder: [holydays[holydayKey]],
          aliyotByRef: aliyotJSON[holydayKey],
        })
      },
    }
    return { ...result, [holydayKey]: HolydayScroll }
  }, {}),
}
