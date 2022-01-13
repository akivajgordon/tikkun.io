import { IntegerIterator, physicalLocationFromRef, title as getTitle } from '.'
import pageTitles from '../build/page-titles.json'
import holydays from '../build/holydays.json'

const fetchPage = ({ path, title, pageNumber }) =>
  window
    .fetch(path)
    .then((res) => res.json())
    .then((page) => ({ content: page, title, pageNumber }))
    .catch((err) => {
      console.error(err)
    })

const Scroll = {
  new: ({
    scroll,
    makePath,
    makeTitle,
    startingAtRef = { b: 1, c: 1, v: 1 },
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
    })
  },
}

const EstherScroll = {
  new: ({ startingAtRef }) => {
    return Scroll.new({
      scroll: 'esther',
      makePath: (n) => `/build/pages/esther/${n}.json`,
      makeTitle: (n) => 'אסתר',
      startingAtRef,
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
          makeTitle: (n) => holydays[holydayKey].he,
          startingAtRef,
        })
      },
    }
    return { ...result, [holydayKey]: HolydayScroll }
  }, {}),
}
