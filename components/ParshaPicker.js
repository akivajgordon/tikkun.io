import parshiyot from '../build/parshiyot.json'

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

const ParshaPicker = () => `
  <div class="parsha-picker">
    <div class="parsha-search">
      <input class="parsha-search-input" placeholder="Search..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"/>
      <span class="parsha-search-icon">⚲</span>
    </div>
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

export default ParshaPicker
