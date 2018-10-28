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

const fetchPage = (n) => {
  if (n <= 0) return Promise.resolve({})

  return window.fetch(`/build/pages/${n}.json`)
    .then((res) => res.json())
    .then((page) => ({ key: n, content: page }))
    .catch((err) => {
      console.error(err)
      return {}
    })
}

const iterator = IntegerIterator.new({ startingAt: 1 })

const cache = {}

const unpackCache = (cache) => Object.keys(cache).map(key => cache[key])

let isShowingParshaPicker = false

const state = {
  iterator
}

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

const makePageNode = (n) => {
  const node = document.createElement('div')
  node.classList.add('tikkun-page')
  node.setAttribute('data-page-number', n)

  return node
}

const scrollToLine = ({ node, lineIndex }) => {
  const lines = [...node.querySelectorAll('.line')]

  const line = lines[lineIndex]

  const book = document.querySelector('.tikkun-book')

  book.scrollTop = line.offsetTop + (line.offsetHeight / 2) - (book.offsetHeight / 2)
}

const app = {
  jumpTo: ({ ref }) => {
    purgeObject(cache)

    const { pageNumber, lineNumber } = physicalLocationFromRef(ref)

    state.iterator = IntegerIterator.new({ startingAt: pageNumber })

    purgeNode(document.querySelector('[data-target-id="tikkun-book"]'))

    fetchPage(state.iterator.next())
      .then(renderNext)
      .then((pageNode) => {
        scrollToLine({ node: pageNode, lineIndex: lineNumber - 1 })
      })

    toggleParshaPicker()
  }
}

const refOf = element => {
  const refPart = (part) => Number(element.getAttribute(`data-jump-to-${part}`))

  return { b: refPart('book'), c: refPart('chapter'), v: refPart('verse') }
}

const showParshaPicker = () => {
  const searchEmitter = new EventEmitter()
  const jumper = ParshaPicker(Search({ search, emitter: searchEmitter }), searchEmitter, ref => app.jumpTo({ ref: refOf(ref) }))
  document.querySelector('#js-app').appendChild(jumper)
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

const isInView = (view, scrollView) => {
  return (
    view.offsetTop < scrollView.scrollTop + scrollView.clientHeight
  ) && (
    view.offsetTop + view.clientHeight > scrollView.scrollTop
  )
}

const updatePageTitle = (scrollView) => {
  const pages = [...document.querySelectorAll('.tikkun-page')]

  const inViewPages = pages.filter((page) => isInView(page, scrollView))

  const firstPageInView = inViewPages[0]

  const n = Number(firstPageInView.getAttribute('data-page-number'))
  setState({ title: getTitle(pageTitles[n - 1]) })
}

let timeout
const debounce = (f) => {
  clearTimeout(timeout)
  timeout = setTimeout(f, 100)
}

const renderPage = ({ insertStrategy: insert }) => ({ key, content }) => {
  const node = makePageNode(key)

  cache[key] = { node, content }
  insert(document.querySelector('[data-target-id="tikkun-book"]'), node)

  setState({
    cache,
    showAnnotations: document.querySelector('[data-target-id="annotations-toggle"]').checked,
    title: getTitle(pageTitles[key - 1])
  })

  return node
}

const renderPrevious = renderPage({ insertStrategy: insertBefore })
const renderNext = renderPage({ insertStrategy: insertAfter })

document.addEventListener('DOMContentLoaded', () => {
  InfiniteScroller
    .new({
      container: document.querySelector('[data-target-id="tikkun-book"]'),
      fetchPreviousContent: {
        fetch: () => fetchPage(state.iterator.previous()),
        render: (container, { key, content }) => renderPrevious({ key, content })
      },
      fetchNextContent: {
        fetch: () => fetchPage(state.iterator.next()),
        render: (container, { key, content }) => renderNext({ key, content })
      }
    })
    .attach()

  document.querySelector('[data-target-id="tikkun-book"]').addEventListener('scroll', (e) => {
    debounce(() => updatePageTitle(e.target))
  })

  document.querySelector('[data-target-id="annotations-toggle"]').addEventListener('change', (e) => {
    const showAnnotations = e.target.checked

    setState({ showAnnotations })
  })

  document.addEventListener('keydown', whenKey('Shift', toggleAnnotations))
  document.addEventListener('keyup', whenKey('Shift', toggleAnnotations))

  document.querySelector('[data-target-id="parsha-title"]').addEventListener('click', toggleParshaPicker)
  document.addEventListener('keydown', whenKey('/', toggleParshaPicker))

  fetchPage(state.iterator.next())
    .then(renderNext)
    // .then(toggleParshaPicker)
})
