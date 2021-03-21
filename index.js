/* global gtag */

import EventEmitter from './src/event-emitter'
import { InfiniteScroller, IntegerIterator, title as getTitle, physicalLocationFromRef } from './src'
import Page from './components/Page'
import ParshaPicker, { search } from './components/ParshaPicker'
import Search from './components/Search'
import utils from './components/utils'
import pageTitles from './build/page-titles.json'
import holydays from './build/holydays.json'

const { htmlToElement, whenKey, purgeNode } = utils

const insertBefore = (parent, child) => {
  parent.insertAdjacentElement('afterbegin', child)
}

const insertAfter = (parent, child) => {
  parent.insertAdjacentElement('beforeend', child)
}

let scroll

const renderTitle = ({ title }) => {
  document.querySelector('[data-target-id="parsha-title"]').innerHTML = title
}

const makePageNode = ({ title }) => {
  const node = document.createElement('div')
  node.classList.add('tikkun-page')
  node.setAttribute('data-page-title', title)

  return node
}

const scrollToLine = ({ node, lineIndex }) => {
  const lines = [...node.querySelectorAll('.line')]

  const line = lines[lineIndex]

  const book = document.querySelector('.tikkun-book')

  book.scrollTop = line.offsetTop + (line.offsetHeight / 2) - (book.offsetHeight / 2)
}

const scrollsByKey = () => ({
  'torah': TorahScroll,
  'esther': EstherScroll,
  ...Object.keys(holydays).reduce((result, holydayKey) => {
    const HolydayScroll = {
      new: ({ startingAtRef }) => {
        return Scroll.new({
          scroll: holydayKey,
          makePath: n => `/build/pages/${holydayKey}/${n}.json`,
          makeTitle: n => holydays[holydayKey].he,
          startingAtRef
        })
      }
    }
    return { ...result, [holydayKey]: HolydayScroll }
  }, {})
})

const Scroll = {
  new: ({ scroll, makePath, makeTitle, startingAtRef = { b: 1, c: 1, v: 1 } }) => {
    const { pageNumber, lineNumber } = physicalLocationFromRef({ ref: startingAtRef, scroll })

    const iterator = IntegerIterator.new({ startingAt: pageNumber })

    return {
      scrollName: scroll,
      fetchPrevious: () => {
        const n = iterator.previous()
        if (n <= 0) return Promise.resolve()
        return fetchPage({ path: makePath(n), title: makeTitle(n) })
      },
      fetchNext: () => {
        const n = iterator.next()
        return fetchPage({ path: makePath(n), title: makeTitle(n) })
      },
      startingLineNumber: lineNumber
    }
  }
}

const TorahScroll = {
  new: ({ startingAtRef }) => {
    return Scroll.new({
      scroll: 'torah',
      makePath: n => `/build/pages/torah/${n}.json`,
      makeTitle: n => getTitle(pageTitles[n - 1]),
      startingAtRef
    })
  }
}

const EstherScroll = {
  new: ({ startingAtRef }) => {
    return Scroll.new({
      scroll: 'esther',
      makePath: n => `/build/pages/esther/${n}.json`,
      makeTitle: n => 'אסתר',
      startingAtRef
    })
  }
}

const app = {
  jumpTo: ({ ref, scroll: _scroll }) => {
    scroll = scrollsByKey()[_scroll].new({ startingAtRef: ref })

    purgeNode(document.querySelector('[data-target-id="tikkun-book"]'))

    scroll.fetchNext()
      .then(renderNext)
      .then((pageNode) => {
        scrollToLine({ node: pageNode, lineIndex: scroll.startingLineNumber - 1 })
      })

    hideParshaPicker()

    return Promise.resolve()
  }
}

const refOf = element => {
  const refPart = (part) => Number(element.getAttribute(`data-jump-to-${part}`))

  return { b: refPart('book'), c: refPart('chapter'), v: refPart('verse') }
}

const setVisibility = ({ selector, visible }) => {
  const classList = document.querySelector(selector).classList

  classList[visible ? 'remove' : 'add']('u-hidden')
  classList[visible ? 'remove' : 'add']('mod-animated')
}

const showParshaPicker = () => {
  ;[
    { selector: '[data-test-id="annotations-toggle"]', visible: false },
    { selector: '[data-target-id="repo-link"]', visible: false },
    { selector: '[data-target-id="tikkun-book"]', visible: false }
  ]
    .forEach(({ selector, visible }) => setVisibility({ selector, visible }))

  const searchEmitter = EventEmitter.new()

  const s = Search({ search, emitter: searchEmitter })
  const jumper = ParshaPicker(s, searchEmitter, ({ ref, scroll }) => app.jumpTo({ ref: refOf(ref), scroll }))
  document.querySelector('#js-app').appendChild(jumper)
  gtag('event', 'view', {
    event_category: 'navigation'
  })

  setTimeout(() => s.focus(), 0)
}

const hideParshaPicker = () => {
  ;[
    { selector: '[data-test-id="annotations-toggle"]', visible: true },
    { selector: '[data-target-id="repo-link"]', visible: true },
    { selector: '[data-target-id="tikkun-book"]', visible: true }
  ]
    .forEach(({ selector, visible }) => setVisibility({ selector, visible }))

  document.querySelector('.parsha-picker') && document.querySelector('#js-app').removeChild(document.querySelector('.parsha-picker'))
}

const toggleParshaPicker = () => {
  const isShowingParshaPicker = Boolean(document.querySelector('.parsha-picker'))

  if (isShowingParshaPicker) {
    hideParshaPicker()
  } else {
    showParshaPicker()
  }
}

const toggleAnnotations = (getPreviousCheckedState) => {
  const toggle = document.querySelector('[data-target-id="annotations-toggle"]')

  toggle.checked = !getPreviousCheckedState()

  const book = document.querySelector('[data-target-id=tikkun-book]')

  book.classList.toggle('mod-annotations-on', toggle.checked)
  book.classList.toggle('mod-annotations-off', !toggle.checked)
}

const scrollState = {
  lastScrolledPosition: 0,
  pageAtTop: null
}

const resumeLastScrollPosition = () => {
  if (!scrollState.pageAtTop) return
  const book = document.querySelector('.tikkun-book')
  const pageRect = scrollState.pageAtTop.getBoundingClientRect()

  book.scrollTop = scrollState.pageAtTop.offsetTop + (scrollState.lastScrolledPosition * pageRect.height)
}

const rememberLastScrolledPosition = () => {
  const book = document.querySelector('.tikkun-book')
  const bookBoundingRect = book.getBoundingClientRect()

  const topOfBookRelativeToViewport = {
    x: bookBoundingRect.left + (bookBoundingRect.width / 2),
    y: bookBoundingRect.top
  }

  const pageAtTop = [...document.elementsFromPoint(topOfBookRelativeToViewport.x, topOfBookRelativeToViewport.y)]
    .find(el => el.className.includes('tikkun-page'))

  if (!pageAtTop) return

  scrollState.pageAtTop = pageAtTop
  scrollState.lastScrolledPosition = (book.scrollTop - pageAtTop.offsetTop) / pageAtTop.clientHeight
}

const updatePageTitle = () => {
  const bookBoundingRect = document.querySelector('.tikkun-book').getBoundingClientRect()

  const centerOfBookRelativeToViewport = {
    x: bookBoundingRect.left + (bookBoundingRect.width / 2),
    y: bookBoundingRect.top + (bookBoundingRect.height / 2)
  }

  const pageAtCenter = [...document.elementsFromPoint(centerOfBookRelativeToViewport.x, centerOfBookRelativeToViewport.y)]
    .find(el => el.className.includes('tikkun-page'))

  if (!pageAtCenter) return

  renderTitle({ title: pageAtCenter.getAttribute('data-page-title') })
}

let lastCalled = Date.now()
const throttle = f => {
  if (Date.now() - lastCalled > 300) {
    lastCalled = Date.now()
    f()
  }
}

const renderPage = ({ insertStrategy: insert }) => ({ content, title }) => {
  const node = makePageNode({ title })

  insert(document.querySelector('[data-target-id="tikkun-book"]'), node)

  const el = htmlToElement(Page({ scroll: scroll.scrollName, lines: content }))

  const firstChild = node.firstChild
  if (firstChild) {
    node.replaceChild(el, firstChild)
  } else {
    node.appendChild(el)
  }

  renderTitle({ title })

  return node
}

const renderPrevious = renderPage({ insertStrategy: insertBefore })
const renderNext = renderPage({ insertStrategy: insertAfter })

const fetchPage = ({ path, title }) => window.fetch(path)
  .then((res) => res.json())
  .then((page) => ({ content: page, title }))
  .catch((err) => {
    console.error(err)
  })

const debounce = (callback, delay) => {
  let timeout
  return () => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      callback()
    }, delay)
  }
}

const toggleColorScheme = () => {
  const body = document.querySelector('body')

  body.dataset.theme = body.dataset.theme === 'dark' ? 'light' : 'dark'
}

document.addEventListener('DOMContentLoaded', () => {
  const book = document.querySelector('[data-target-id="tikkun-book"]')
  const toggle = document.querySelector('[data-target-id="annotations-toggle"]')

  InfiniteScroller
    .new({
      container: book,
      fetchPreviousContent: { fetch: () => scroll.fetchPrevious(), render: renderPrevious },
      fetchNextContent: { fetch: () => scroll.fetchNext(), render: renderNext }
    })
    .attach()

  book.addEventListener('scroll', () => {
    throttle(() => updatePageTitle())
  })

  book.addEventListener('scroll', debounce(() => {
    rememberLastScrolledPosition()
  }, 1000))

  book.addEventListener('dblclick', toggleColorScheme)

  window.addEventListener('resize', () => {
    resumeLastScrollPosition()
  })

  toggle.addEventListener('change', (e) => toggleAnnotations(() => !e.target.checked))

  document.addEventListener('keydown', whenKey('Shift', () => toggleAnnotations(() => toggle.checked)))
  document.addEventListener('keyup', whenKey('Shift', () => toggleAnnotations(() => toggle.checked)))

  document.querySelector('[data-target-id="parsha-title"]').addEventListener('click', toggleParshaPicker)
  document.addEventListener('keydown', whenKey('/', toggleParshaPicker))

  app.jumpTo({ ref: { b: 1, c: 1, v: 1 }, scroll: 'torah' })
    .then(hideParshaPicker)
})
