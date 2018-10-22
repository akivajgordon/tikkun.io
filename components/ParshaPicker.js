import parshiyot from '../build/parshiyot.json'
import fuzzy from '../src/fuzzy'

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

const Search = () => `
  <div class="search">
    <div class="search-bar">
      <span class="search-icon">⚲</span>
      <input class="search-input" placeholder="Search..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" autofocus />
    </div>
    <ol class="search-results u-hidden">
    </ol>
  </div>
`

const decorateString = ({ string, atIndexes, withDecoration }) => {
  let indexesIndex = 0
  return string
    .split('')
    .map((char, i) => {
      if (atIndexes[indexesIndex] !== i) return char

      ++indexesIndex
      return withDecoration(char)
    }, '')
    .join('')
}

const strongify = (c) => (`<strong>${c}</strong>`)

const NoResults = () => `<p class="" style="text-align: center; color: hsla(0, 0%, 0%, 0.5);">
  No results
</p>
`

const ParshaResult = ({ match, item }) => `
  <p class="search-result-tag">${match.index === 0 ? decorateString({
    string: item.he,
    atIndexes: match.indexes,
    withDecoration: strongify
  }) : item.he}
  </p>
  <p class="search-result-tag">${match.index === 1 ? decorateString({
    string: item.en,
    atIndexes: match.indexes,
    withDecoration: strongify
  }) : item.en}
  </p>
`

const SearchResult = (result) => `
  <li class="search-result" data-target-class="search-result">
    ${result}
  </li>
`

const ParshaPicker = () => `
  <div class="parsha-picker">
    ${Search()}
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
`

const searchResults = (query) => {
  const results = fuzzy(parshiyot, query, parsha => [parsha.he, parsha.en])

  return results.length ? results : [{
    item: 'No results',
    match: { index: 0, indexes: [] }
  }]
}

const htmlToElement = (html) => {
  const template = document.createElement('template')
  html = html.trim() // Never return a text node of whitespace as the result
  template.innerHTML = html
  return template.content.firstChild
}

const top = (n) => (_, i) => i < n

const search = ({ jumper, query, jumpToRef, toggleParshaPicker }) => {
  const searchResultsElement = jumper.querySelector('.search-results')

  if (query) {
    searchResultsElement.classList.remove('u-hidden')
    jumper.querySelector('.parsha-books').classList.add('u-hidden')

    searchResultsElement.innerHTML = ''

    searchResults(query)
      .filter(top(5))
      .map(result => result.item === 'No results'
        ? { html: NoResults(), onClick: () => {} }
        : {
          html: ParshaResult(result),
          onClick: () => {
            jumpToRef(result.item)
            toggleParshaPicker()
          }
        }
      )
      .map(({ html, onClick }) => ({ html: SearchResult(html), onClick }))
      .map(({ html, onClick }) => {
        const el = htmlToElement(html)

        el.addEventListener('click', onClick)

        return el
      })
      .forEach(result => {
        searchResultsElement.appendChild(result)
      })
  } else {
    searchResultsElement.classList.add('u-hidden')
    jumper.querySelector('.parsha-books').classList.remove('u-hidden')
  }
}

export { search }

export default ParshaPicker
