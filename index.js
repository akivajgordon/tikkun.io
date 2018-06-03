import { html, render } from 'lit-html/lib/lit-extended'
import { displayRange, textFilter, InfiniteScroller, IntegerIterator } from './src'

const petuchaClass = (isPetucha) => isPetucha ? 'mod-petucha' : ''

const setumaClass = (column) => column.length > 1 ? 'mod-setuma' : ''

const Line = ({ text, verses, aliyot, isPetucha }, annotated) => html`
  <div class$="line ${petuchaClass(isPetucha)}">
    ${text.map((column) => (html`
      <div class="column">
        ${column.map((fragment) => (html`
          <div class$="fragment ${setumaClass(column)}">${textFilter({ text: fragment, annotated })}</span>
        `))}
      </div>
    `))}
    <span class="location-indicator mod-verses" hidden="${!annotated}">${displayRange.asVersesRange(verses)}</span>
    <span class="location-indicator mod-aliyot" hidden="${!annotated}">${displayRange.asAliyotRange(aliyot)}</span>
  </div>
`

const Page = (lines, annotated) => html`
  <div class="tikkun-page">
    <table>
      ${lines.map((line) => (html`
        <tr>
          <td>${Line(line, annotated)}</td>
        </tr>
      `))}
    </table>
  </div>
`

const ParshaPicker = () => html`
  <div class="parsha-picker">
    <ol class="parsha-list">
      <li class="parsha">בראשית</li>

      <li class="parsha">נח</li>

      <li class="parsha">לך לך</li>

      <li class="parsha">וירא</li>

      <li class="parsha">וזאת הברכה</li>

      <li class="parsha">בראשית</li>

      <li class="parsha">בראשית</li>

      <li class="parsha">וזאת הברכה</li>

      <li class="parsha">בראשית</li>

      <li class="parsha">בראשית</li>

      <li class="parsha">וזאת הברכה</li>

      <li class="parsha">בראשית</li>

      <li class="parsha">בראשית</li>

      <li class="parsha">וזאת הברכה</li>

      <li class="parsha">בראשית</li>

      <li class="parsha">בראשית</li>

      <li class="parsha">וזאת הברכה</li>

      <li class="parsha">בראשית</li>

      <li class="parsha">בראשית</li>

      <li class="parsha">וזאת הברכה</li>

      <li class="parsha">בראשית</li>

      <li class="parsha">בראשית</li>

      <li class="parsha">וזאת הברכה</li>

      <li class="parsha">בראשית</li>

    </ol>
  </div>
`

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
}

const iterator = IntegerIterator.new({ startingAt: 1 })

const cache = {}

document.addEventListener('DOMContentLoaded', () => {
  InfiniteScroller
    .new({
      container: document.querySelector('#js-app'),
      fetchPreviousContent: {
        fetch: () => fetchPage(iterator.previous()),
        render: (container, { key, content }) => {
          const node = document.createElement('div')
          insertBefore(container, node)
          cache[key] = { node, content }
          render(Page(content, true), node)
        }
      },
      fetchNextContent: {
        fetch: () => fetchPage(iterator.next()),
        render: (container, { key, content }) => {
          const node = document.createElement('div')
          insertAfter(container, node)
          cache[key] = { node, content }
          render(Page(content, true), node)
        }
      }
    })
    .attach()

  document.querySelector('[data-target-id="annotations-toggle"]').addEventListener('change', (e) => {
    const showAnnotations = e.target.checked

    Object.keys(cache)
      .map(key => cache[key])
      .forEach(({ node, content }) => {
        render(Page(content, showAnnotations), node)
      })
  })

  document.querySelector('[data-target-id="parsha-title"]').addEventListener('click', () => {
    render(html``, document.querySelector('[data-target-id="tikkun-book"]'))
    render(ParshaPicker(), document.querySelector('[data-target-id="parsha-picker"]'))
  })

  fetchPage(iterator.next())
    .then(({ key, content }) => {
      const node = document.querySelector('[data-target-id="tikkun-book"]')
      cache[key] = { node, content }
      render(Page(content, true), node)
    })
})