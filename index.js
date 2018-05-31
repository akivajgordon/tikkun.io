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

const insertBefore = (parent, child) => {
  parent.insertAdjacentElement('afterbegin', child)
}

const insertAfter = (parent, child) => {
  parent.insertAdjacentElement('beforeend', child)
}

const fetchPage = (n) => window.fetch(`/build/pages/${n}.json`)
  .then((res) => res.json())
  .then((page) => Page(page, true))

const iterator = IntegerIterator.new({ startingAt: 223 })

document.addEventListener('DOMContentLoaded', () => {
  InfiniteScroller
    .new({
      container: document.querySelector('#js-app'),
      fetchPreviousContent: {
        fetch: () => fetchPage(iterator.previous()),
        render: (container, content) => {
          const node = document.createElement('div')
          insertBefore(container, node)
          render(content, node)
        }
      },
      fetchNextContent: {
        fetch: () => fetchPage(iterator.next()),
        render: (container, content) => {
          const node = document.createElement('div')
          insertAfter(container, node)
          render(content, node)
        }
      }
    })
    .attach()

  fetchPage(iterator.next())
    .then((page) => {
      render(page, document.querySelector('#js-app'))
    })
})
