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

/*
<li class="search-result">
  <p class="search-result-tag">שלח</p>
  <p class="search-result-tag"><strong>Sh</strong>e<strong>l</strong>a<strong>ch</strong></p>
</li>
<li class="search-result">
  <p class="search-result-tag">בשלח</p>
  <p class="search-result-tag">Be<strong>sh</strong>a<strong>l</strong>a<strong>ch</strong></p>
</li>
<li class="search-result">
  <p class="search-result-tag">וישלח</p>
  <p class="search-result-tag">Vayi<strong>shl</strong>a<strong>ch</strong></p>
</li>
*/

/*
<li class="search-result">
  <p class="" style="text-align: center; color: hsla(0, 0%, 0%, 0.5);">No results</p>
</li>
*/
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

const ParshaResult = ({ string, indexes, item }) => `
  <p class="search-result-tag">${item.he}</p>
  <p class="search-result-tag">${decorateString({
    string,
    atIndexes: indexes,
    withDecoration: (c) => (`<strong>${c}</strong>`)
  })}
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
  const results = fuzzy(parshiyot, query, parsha => parsha.en)

  return results.length ? results : [{ string: 'No results', indexes: [], item: { he: '' } }]
}

const htmlToElement = (html) => {
  const template = document.createElement('template')
  html = html.trim() // Never return a text node of whitespace as the result
  template.innerHTML = html
  return template.content.firstChild
}

const top = (n) => (_, i) => i < n

const search = ({ jumper, query }) => {
  const searchResultsElement = jumper.querySelector('.search-results')

  if (query) {
    searchResultsElement.classList.remove('u-hidden')
    jumper.querySelector('.parsha-books').classList.add('u-hidden')

    searchResultsElement.innerHTML = ''

    searchResults(query)
      .filter(top(5))
      .map(ParshaResult)
      .map(SearchResult)
      .map(htmlToElement)
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
