import IntegerIterator from './integer-iterator'
import { physicalLocationFromRef } from './location'
import getTitle from './title'
import pageTitles from '../build/page-titles.json'
import holydays from '../build/holydays.json'
import parshiyot from '../build/parshiyot.json'
import aliyotJSON from '../build/aliyot.json'

const fetchPage = ({ path, title, pageNumber }) =>
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

const aliyahName = ({ aliyah, getParshaName }) => {
  if (aliyah < 1 || aliyah > aliyotStrings.length) return null

  if (aliyah === 1) return getParshaName()

  return aliyotStrings[aliyah - 1]
}

const Scroll = {
  new: ({
    scroll,
    makePath,
    makeTitle,
    startingAtRef = { b: 1, c: 1, v: 1 },
    aliyotByRef,
    aliyahFinder,
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
      aliyotFor: ({ verses }) => {
        const found = verses
          .map(({ book, chapter, verse }) => {
            return aliyotByRef?.[book]?.[chapter]?.[verse]
          })
          .filter(Boolean)

        if (!found.length) return ''

        const { standard, double, special } = found[0]

        const display = (aliyah) => {
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
          ...(standard ? [standard.map((n) => display(n)).join(', ')] : []),
          ...(double ? [`[${display(double)}]`] : []),
          ...(special ? [`(${display(special)})`] : []),
        ].join(' ')
      },
    }
  },
}

const TorahScroll = {
  new: ({ startingAtRef }) => {
    return Scroll.new({
      scroll: 'torah',
      makePath: (n) => `/build/pages/torah/${n}.json`,
      makeTitle: (n) => getTitle(pageTitles[n - 1]),
      startingAtRef,
      aliyahFinder: parshiyot,
      aliyotByRef: aliyotJSON.torah,
    })
  },
}

const EstherScroll = {
  new: ({ startingAtRef }) => {
    return Scroll.new({
      scroll: 'esther',
      makePath: (n) => `/build/pages/esther/${n}.json`,
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
      new: ({ startingAtRef }) => {
        return Scroll.new({
          scroll: holydayKey,
          makePath: (n) => `/build/pages/${holydayKey}/${n}.json`,
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
