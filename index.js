import { html, render } from 'lit-html/lib/lit-extended'
import { displayRange, textFilter, InfiniteScroller } from './src'

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

document.addEventListener('DOMContentLoaded', () => {
  InfiniteScroller.new({ container: document.querySelector('#js-app') }).attach()
  window.fetch('/build/pages/1.json')
    .then((res) => res.json())
    .then((page) => {
      render(Page(page, true), document.querySelector('#js-app'))
    })
})
