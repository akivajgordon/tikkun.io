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

const ParshaPicker = (search, searchEmitter, jumpToRef, dismiss) => {
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
    jumpToRef(selected.querySelector('[data-target-class="parsha-result"]'))
    dismiss()
  })

  searchEmitter.on('search', () => {
    self.querySelector('.parsha-books').classList.add('u-hidden')
  })

  searchEmitter.on('clear', () => {
    self.querySelector('.parsha-books').classList.remove('u-hidden')
  })

  self.replaceChild(search, self.querySelector('#search'))

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
