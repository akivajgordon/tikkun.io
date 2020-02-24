/* global gtag */

import parshiyot from '../build/parshiyot.json'
import fuzzy from '../src/fuzzy'
import utils from './utils'
import ParshaResult, { NoResults } from './ParshaResult'

const { htmlToElement } = utils

const Parsha = ({ ref, he, scroll }) => `<li
  class="parsha"
  data-target-id="parsha"
  data-jump-to-book="${ref.b}"
  data-jump-to-chapter="${ref.c}"
  data-jump-to-verse="${ref.v}"
  data-scroll="${scroll}"
>
  ${he}
</li>
`

const Book = (book) => `
  <li class="parsha-book">
    <ol class="parsha-list">
      ${book.map(b => Parsha({ ...b, scroll: 'torah' })).join('')}
    </ol>
  </li>
`

const ParshaPicker = (search, searchEmitter, jumpToRef) => {
  const self = htmlToElement(`
    <div class="parsha-picker">
      <div id="search"></div>
      <div class="browse">
        <h2 class="section-heading">תורה</h2>
        <ol class="parsha-books">
          ${parshiyot
            .reduce((books, parsha) => {
              const book = parsha.ref.b
              books[book] = books[book] || []
              books[book].push(parsha)
              return books
            }, [])
            .map(Book)
            .join('')
          }
        </ol>

        <h2 class="section-heading">מגילות</h2>
        <ol class="parsha-books">
          <li class="parsha-book">
            <ol class="parsha-list">
              ${Parsha({ ref: { b: 1, c: 1, v: 1 }, he: 'אסתר', scroll: 'esther' })}
            </ol>
          </li>
        </ol>
      </div>
    </div>
  `)

  searchEmitter.on('selection', (selected) => {
    gtag('event', 'search_selection', {
      event_category: 'navigation',
      event_label: selected.querySelector('[data-target-class="result-hebrew"]').textContent.trim()
    })

    const result = selected.querySelector('[data-target-class="parsha-result"]')

    jumpToRef({ ref: result, scroll: result.getAttribute('data-scroll') })
  })

  searchEmitter.on('search', query => {
    self.querySelector('.browse').classList.add('u-hidden')
    gtag('event', 'search', {
      event_category: 'navigation',
      event_label: query
    })
  })

  searchEmitter.on('clear', () => {
    self.querySelector('.browse').classList.remove('u-hidden')
  })

  self.replaceChild(search, self.querySelector('#search'))

  ;[...self.querySelectorAll('[data-target-id="parsha"]')]
    .forEach((parsha) => {
      parsha.addEventListener('click', (e) => {
        gtag('event', 'browse_selection', {
          event_category: 'navigation',
          event_label: e.target.textContent.trim()
        })
        jumpToRef({ ref: e.target, scroll: e.target.getAttribute('data-scroll') })
      })
    })

  return self
}

const searchables = [
  ...parshiyot.map(p => ({ ...p, scroll: 'torah' })),
  {
    he: 'אסתר',
    en: 'Esther',
    ref: { b: 1, c: 1, v: 1 },
    scroll: 'esther'
  }
]

const searchResults = (query) => {
  const results = fuzzy(searchables, query, parsha => [parsha.he, parsha.en])

  return results.length ? results : [{
    item: 'No results',
    match: { index: 0, indexes: [] }
  }]
}

const top = (n) => (_, i) => i < n

const search = query => searchResults(query)
  .filter(top(5))
  .map(result => result.item === 'No results'
    ? NoResults()
    : ParshaResult(result)
  )

export { search }

export default ParshaPicker
