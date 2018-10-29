/* global gtag */

import parshiyot from '../build/parshiyot.json'
import fuzzy from '../src/fuzzy'
import utils from './utils'
import ParshaResult, { NoResults } from './ParshaResult'

const { htmlToElement } = utils

const Parsha = ({ ref, he }) => `<li
  class="parsha"
  data-target-id="parsha"
  data-jump-to-book="${ref.b}"
  data-jump-to-chapter="${ref.c}"
  data-jump-to-verse="${ref.v}"
>
  ${he}
</li>
`

const Book = (book) => `
  <li class="parsha-book">
    <ol class="parsha-list">
      ${book.map(Parsha).join('')}
    </ol>
  </li>
`

const ParshaPicker = (search, searchEmitter, jumpToRef) => {
  const self = htmlToElement(`
    <div class="parsha-picker">
      <div id="search"></div>
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
    </div>
  `)

  searchEmitter.on('selection', (selected) => {
    gtag('event', 'search_selection', {
      'event_category': 'navigation',
      'event_label': selected.querySelector('[data-target-class="result-hebrew"]').textContent.trim()
    })

    jumpToRef(selected.querySelector('[data-target-class="parsha-result"]'))
  })

  searchEmitter.on('search', query => {
    self.querySelector('.parsha-books').classList.add('u-hidden')
    gtag('event', 'search', {
      'event_category': 'navigation',
      'event_label': query
    })
  })

  searchEmitter.on('clear', () => {
    self.querySelector('.parsha-books').classList.remove('u-hidden')
  })

  self.replaceChild(search, self.querySelector('#search'))

  ;[...self.querySelectorAll('[data-target-id="parsha"]')]
    .forEach((parsha) => {
      parsha.addEventListener('click', (e) => {
        gtag('event', 'browse_selection', {
          'event_category': 'navigation',
          'event_label': e.target.textContent.trim()
        })
        jumpToRef(e.target)
      })
    })

  return self
}

const searchResults = (query) => {
  const results = fuzzy(parshiyot, query, parsha => [parsha.he, parsha.en])

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
