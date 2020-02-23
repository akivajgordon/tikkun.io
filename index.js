/* global gtag */

import { EventEmitter } from 'events'
import { InfiniteScroller, IntegerIterator, title as getTitle, physicalLocationFromRef } from './src'
import Page from './components/Page'
import ParshaPicker, { search } from './components/ParshaPicker'
import Search from './components/Search'
import utils from './components/utils'
import pageTitles from './build/page-titles.json'

const { htmlToElement, whenKey, purgeNode } = utils

const insertBefore = (parent, child) => {
  parent.insertAdjacentElement('afterbegin', child)
}

const insertAfter = (parent, child) => {
  parent.insertAdjacentElement('beforeend', child)
}

const cache = {}

const unpackCache = (cache) => Object.keys(cache || {}).map(key => cache[key])

let isShowingParshaPicker = false

let scroll

const state = {}

const render = ({ cache, showAnnotations, title }) => {
  unpackCache(cache)
    .forEach(({ node, content }) => {
      const el = htmlToElement(Page(content, showAnnotations))

      const firstChild = node.firstChild
      if (firstChild) {
        node.replaceChild(el, firstChild)
      } else {
        node.appendChild(el)
      }
    })

  document.querySelector('[data-target-id="parsha-title"]').innerHTML = title
}

const setState = (updates) => {
  const newState = Object.assign(state, updates)

  render(newState)
}

const purgeObject = (obj) => {
  for (const key in obj) {
    delete obj[key]
  }
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

const app = {
  jumpTo: ({ ref, scroll: _scroll }) => {
    purgeObject(cache)

    scroll = (_scroll === 'esther' ? EstherScroll : TorahScroll).new({ startingAtRef: ref })

    purgeNode(document.querySelector('[data-target-id="tikkun-book"]'))

    scroll.fetchNext()
      .then(renderNext)
      .then((pageNode) => {
        scrollToLine({ node: pageNode, lineIndex: scroll.startingLineNumber - 1 })
      })

    toggleParshaPicker()

    return Promise.resolve()
  }
}

const refOf = element => {
  const refPart = (part) => Number(element.getAttribute(`data-jump-to-${part}`))

  return { b: refPart('book'), c: refPart('chapter'), v: refPart('verse') }
}

const showParshaPicker = () => {
  const searchEmitter = new EventEmitter()

  const s = Search({ search, emitter: searchEmitter })
  const jumper = ParshaPicker(s, searchEmitter, ({ ref, scroll }) => app.jumpTo({ ref: refOf(ref), scroll }))
  document.querySelector('#js-app').appendChild(jumper)
  gtag('event', 'view', {
    event_category: 'navigation'
  })

  setTimeout(() => s.focus(), 0)
}

const toggleParshaPicker = () => {
  isShowingParshaPicker = !isShowingParshaPicker

  ;[
    '[data-test-id="annotations-toggle"]',
    '[data-target-id="repo-link"]',
    '[data-target-id="tikkun-book"]'
  ]
    .map(selector => document.querySelector(selector))
    .map(el => el.classList)
    .forEach(classList => {
      classList.toggle('u-hidden')
      classList.toggle('mod-animated')
    })

  if (isShowingParshaPicker) {
    showParshaPicker()
  } else {
    document.querySelector('#js-app').removeChild(document.querySelector('.parsha-picker'))
  }
}

const toggleAnnotations = () => {
  const toggle = document.querySelector('[data-target-id="annotations-toggle"]')

  toggle.checked = !toggle.checked

  setState({ showAnnotations: toggle.checked })
}

const updatePageTitle = () => {
  const bookBoundingRect = document.querySelector('.tikkun-book').getBoundingClientRect()

  const centerOfBookRelativeToViewport = {
    x: bookBoundingRect.left + (bookBoundingRect.width / 2),
    y: bookBoundingRect.top + (bookBoundingRect.height / 2)
  }

  const pageAtCenter = [...document.elementsFromPoint(centerOfBookRelativeToViewport.x, centerOfBookRelativeToViewport.y)]
    .find(el => el.className.includes('tikkun-page'))

  setState({ title: pageAtCenter.getAttribute('data-page-title') })
}

let lastCalled = Date.now()
const throttle = f => {
  if (Date.now() - lastCalled > 200) {
    lastCalled = Date.now()
    f()
  }
}

const renderPage = ({ insertStrategy: insert }) => ({ key, content, title }) => {
  const node = makePageNode({ title })

  cache[key] = { node, content }
  insert(document.querySelector('[data-target-id="tikkun-book"]'), node)

  setState({
    cache,
    showAnnotations: document.querySelector('[data-target-id="annotations-toggle"]').checked,
    title
  })

  return node
}

const renderPrevious = renderPage({ insertStrategy: insertBefore })
const renderNext = renderPage({ insertStrategy: insertAfter })

const fetchPage = ({ path, title }) => window.fetch(path)
  .then((res) => res.json())
  .then((page) => ({ key: path, content: page, title }))
  .catch((err) => {
    console.error(err)
  })

const Scroll = {
  new: ({ scroll, makePath, makeTitle, startingAtRef = { b: 1, c: 1, v: 1 } }) => {
    const { pageNumber, lineNumber } = physicalLocationFromRef({ ref: startingAtRef, scroll })

    const iterator = IntegerIterator.new({ startingAt: pageNumber })

    return {
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
      makePath: n => `/build/pages/${n}.json`,
      makeTitle: n => getTitle(pageTitles[n - 1]),
      startingAtRef
    })
  }
}

const EstherScroll = {
  new: ({ startingAtRef }) => {
    return Scroll.new({
      scroll: 'esther',
      makePath: n => `/build/pages/${n}-esther.json`,
      makeTitle: n => 'אסתר',
      startingAtRef
    })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  InfiniteScroller
    .new({
      container: document.querySelector('[data-target-id="tikkun-book"]'),
      fetchPreviousContent: { fetch: () => scroll.fetchPrevious(), render: renderPrevious },
      fetchNextContent: { fetch: () => scroll.fetchNext(), render: renderNext }
    })
    .attach()

  document.querySelector('[data-target-id="tikkun-book"]').addEventListener('scroll', () => {
    throttle(() => updatePageTitle())
  })

  document.querySelector('[data-target-id="annotations-toggle"]').addEventListener('change', (e) => {
    const showAnnotations = e.target.checked

    setState({ showAnnotations })
  })

  document.addEventListener('keydown', whenKey('Shift', toggleAnnotations))
  document.addEventListener('keyup', whenKey('Shift', toggleAnnotations))

  document.querySelector('[data-target-id="parsha-title"]').addEventListener('click', toggleParshaPicker)
  document.addEventListener('keydown', whenKey('/', toggleParshaPicker))

  app.jumpTo({ ref: { b: 1, c: 1, v: 1 }, scroll: 'torah' })
    .then(toggleParshaPicker)
})
