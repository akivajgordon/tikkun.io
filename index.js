import { InfiniteScroller, IntegerIterator, title as getTitle } from './src'
import Page from './components/Page'
import ParshaPicker from './components/ParshaPicker'
import pageTitles from './build/page-titles.json'

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

const htmlToElement = (html) => {
  const template = document.createElement('template')
  html = html.trim() // Never return a text node of whitespace as the result
  template.innerHTML = html
  return template.content.firstChild
}

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

const purgeNode = (node) => {
  while (node.firstChild) node.removeChild(node.firstChild)
}

const makePageNode = (n) => {
  const node = document.createElement('div')
  node.classList.add('tikkun-page')
  node.setAttribute('data-page-number', n)

  return node
}

const showParshaPicker = () => {
  document.querySelector('#js-app').appendChild(htmlToElement(ParshaPicker()))
  ;[...document.querySelectorAll('[data-target-id="parsha"]')]
    .forEach((parsha) => {
      parsha.addEventListener('click', (e) => {
        const page = Number(e.target.getAttribute('data-jump-to-page'))

        purgeObject(cache)
        state.iterator = IntegerIterator.new({ startingAt: page })

        purgeNode(document.querySelector('[data-target-id="tikkun-book"]'))

        fetchPage(state.iterator.next())
          .then(renderNext)

        toggleParshaPicker()
      })
    })
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

const toggleAnnotations = (e) => {
  if (e.key !== 'Shift') return

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

  document.addEventListener('keydown', toggleAnnotations)
  document.addEventListener('keyup', toggleAnnotations)

  document.querySelector('[data-target-id="parsha-title"]').addEventListener('click', toggleParshaPicker)

  fetchPage(state.iterator.next())
    .then(renderNext)
})
