/* global gtag */

import { InfiniteScroller, urlToRef, scrollsByKey } from './src'
import Page from './components/Page'
import ParshaPicker from './components/ParshaPicker'
import utils from './components/utils'

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

const makePageNode = ({ title, pageNumber }) => {
  const node = document.createElement('div')
  node.classList.add('tikkun-page')
  node.setAttribute('data-page-title', title)
  node.setAttribute('data-page-number', pageNumber)

  return node
}

const scrollToLine = ({ node, lineIndex }) => {
  const lines = [...node.querySelectorAll('.line')]

  const line = lines[lineIndex]

  const book = document.querySelector('.tikkun-book')

  book.scrollTop =
    line.offsetTop + line.offsetHeight / 2 - book.offsetHeight / 2
}

const app = {
  jumpTo: ({ ref }) => {
    scroll = scrollsByKey[ref.scroll].new({ startingAtRef: ref })

    purgeNode(document.querySelector('[data-target-id="tikkun-book"]'))

    scroll
      .fetchNext()
      .then(renderNext)
      .then((pageNode) => {
        scrollToLine({
          node: pageNode,
          lineIndex: scroll.startingLineNumber - 1,
        })
      })

    hideParshaPicker()

    return Promise.resolve()
  },
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
    { selector: '[data-target-id="tikkun-book"]', visible: false },
  ].forEach(({ selector, visible }) => setVisibility({ selector, visible }))

  const jumper = ParshaPicker(({ ref, key, source }) => {
    app.jumpTo({ ref })

    const { scroll } = ref

    const hashBySource = {
      comingUp: (key) => (key === 'next' ? `#/next` : `#/p/${key}`),
      browse: (key) => `#/${scroll === 'torah' ? 'p' : 'h'}/${key}`,
      search: (key) => `#/${scroll === 'torah' ? 'p' : 'h'}/${key}`,
    }[source](key)

    window.location.hash = hashBySource
  })

  document.querySelector('#js-app').appendChild(jumper.node)

  gtag('event', 'view', {
    event_category: 'navigation',
  })

  jumper.onMount()
}

const hideParshaPicker = () => {
  ;[
    { selector: '[data-test-id="annotations-toggle"]', visible: true },
    { selector: '[data-target-id="repo-link"]', visible: true },
    { selector: '[data-target-id="tikkun-book"]', visible: true },
  ].forEach(({ selector, visible }) => setVisibility({ selector, visible }))

  document.querySelector('.parsha-picker') &&
    document
      .querySelector('#js-app')
      .removeChild(document.querySelector('.parsha-picker'))
}

const toggleParshaPicker = () => {
  const isShowingParshaPicker = Boolean(
    document.querySelector('.parsha-picker')
  )

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
  pageAtTop: null,
}

const resumeLastScrollPosition = () => {
  if (!scrollState.pageAtTop) return
  const book = document.querySelector('.tikkun-book')
  const pageRect = scrollState.pageAtTop.getBoundingClientRect()

  book.scrollTop =
    scrollState.pageAtTop.offsetTop +
    scrollState.lastScrolledPosition * pageRect.height
}

const rememberLastScrolledPosition = () => {
  const book = document.querySelector('.tikkun-book')
  const bookBoundingRect = book.getBoundingClientRect()

  const topOfBookRelativeToViewport = {
    x: bookBoundingRect.left + bookBoundingRect.width / 2,
    y: bookBoundingRect.top,
  }

  const pageAtTop = [
    ...document.elementsFromPoint(
      topOfBookRelativeToViewport.x,
      topOfBookRelativeToViewport.y
    ),
  ].find((el) => el.className.includes('tikkun-page'))

  if (!pageAtTop) return

  scrollState.pageAtTop = pageAtTop
  scrollState.lastScrolledPosition =
    (book.scrollTop - pageAtTop.offsetTop) / pageAtTop.clientHeight
}

const updatePageTitle = () => {
  const bookBoundingRect = document
    .querySelector('.tikkun-book')
    .getBoundingClientRect()

  const centerOfBookRelativeToViewport = {
    x: bookBoundingRect.left + bookBoundingRect.width / 2,
    y: bookBoundingRect.top + bookBoundingRect.height / 2,
  }

  const pageAtCenter = [
    ...document.elementsFromPoint(
      centerOfBookRelativeToViewport.x,
      centerOfBookRelativeToViewport.y
    ),
  ].find((el) => el.className.includes('tikkun-page'))

  if (!pageAtCenter) return

  renderTitle({ title: pageAtCenter.getAttribute('data-page-title') })
}

let lastCalled = Date.now()
const throttle = (f) => {
  if (Date.now() - lastCalled > 300) {
    lastCalled = Date.now()
    f()
  }
}

const renderPage =
  ({ insertStrategy: insert }) =>
  ({ content, title, pageNumber }) => {
    const node = makePageNode({ title, pageNumber })

    insert(document.querySelector('[data-target-id="tikkun-book"]'), node)

    const el = htmlToElement(Page({ scroll, lines: content }))

    const firstChild = node.firstChild
    if (firstChild) {
      node.replaceChild(el, firstChild)
    } else {
      node.appendChild(el)
    }

    setTimeout(updatePageTitle, 0)

    return node
  }

const renderPrevious = renderPage({ insertStrategy: insertBefore })
const renderNext = renderPage({ insertStrategy: insertAfter })

const debounce = (callback, delay) => {
  let timeout
  return () => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      callback()
    }, delay)
  }
}

const listenForRevealGesture = (book) => {
  const PULL_THRESHOLD = 30 // px
  const PULL_MAXIMUM = 100

  const endTouch = () => {
    book.classList.add('mod-pull-releasing')

    book.style.setProperty('--pull-translation', 0)
  }

  let startX = 0

  book.addEventListener('touchstart', (e) => {
    book.classList.remove('mod-pull-releasing')

    startX = e.changedTouches[0].screenX
  })

  book.addEventListener('touchmove', (e) => {
    const touchX = e.changedTouches[0].screenX
    const pullDistance = -Math.max(touchX - startX, -PULL_MAXIMUM)

    if (pullDistance < PULL_THRESHOLD) return

    book.style.setProperty(
      '--pull-translation',
      `${PULL_THRESHOLD - pullDistance}px`
    )
  })

  book.addEventListener('touchend', endTouch)

  book.addEventListener('touchcancel', endTouch)
}

document.addEventListener('DOMContentLoaded', () => {
  const book = document.querySelector('[data-target-id="tikkun-book"]')
  const toggle = document.querySelector('[data-target-id="annotations-toggle"]')

  InfiniteScroller.new({
    container: book,
    fetchPreviousContent: {
      fetch: () => scroll.fetchPrevious(),
      render: renderPrevious,
    },
    fetchNextContent: { fetch: () => scroll.fetchNext(), render: renderNext },
  }).attach()

  book.addEventListener('scroll', () => {
    throttle(() => updatePageTitle())
  })

  book.addEventListener(
    'scroll',
    debounce(() => {
      rememberLastScrolledPosition()
    }, 1000)
  )

  listenForRevealGesture(book)

  window.addEventListener('resize', () => {
    resumeLastScrollPosition()
  })

  toggle.addEventListener('change', (e) =>
    toggleAnnotations(() => !e.target.checked)
  )

  document.addEventListener(
    'keydown',
    whenKey('Shift', () => toggleAnnotations(() => toggle.checked))
  )
  document.addEventListener(
    'keyup',
    whenKey('Shift', () => toggleAnnotations(() => toggle.checked))
  )

  document
    .querySelector('[data-target-id="parsha-title"]')
    .addEventListener('click', toggleParshaPicker)
  document.addEventListener('keydown', whenKey('/', toggleParshaPicker))

  const startingRef = urlToRef({ url: window.location.href })
  app.jumpTo({ ref: startingRef }).then(hideParshaPicker)
})
