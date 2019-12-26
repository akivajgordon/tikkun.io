import utils from './utils'
import SelectList, { setSelected, getSelected } from './SelectList'

const { htmlToElement: html, whenKey, purgeNode } = utils

const Search = ({ search, emitter }) => {
  let list

  const self = html(`
    <div class="search">
      <div class="search-bar">
        <span class="search-icon">⚲</span>
        <input class="search-input" placeholder="Search..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" autofocus />
      </div>
      <div class="search-results u-hidden">
      </div>
    </div>
  `)

  self.addEventListener('keydown', whenKey('Enter', () => {
    emitter.emit('selection', getSelected(list))
  }))

  const onSelect = item => emitter.emit('selection', item)

  ;[
    { key: 'ArrowDown', adjustment: selected => selected + 1 },
    { key: 'ArrowUp', adjustment: selected => selected - 1 },
    { key: { key: 'n', ctrl: true }, adjustment: selected => selected + 1 },
    { key: { key: 'p', ctrl: true }, adjustment: selected => selected - 1 }
  ].forEach(({ key, adjustment }) => self.addEventListener('keydown', whenKey(key, e => {
    e.preventDefault()
    setSelected(list, adjustment)
  })))

  const searchInput = self.querySelector('.search-input')
  const searchResults = self.querySelector('.search-results')

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value

    purgeNode(searchResults)

    if (query) {
      emitter.emit('search', query)
      const results = search(query)
      list = SelectList(results, searchInput, onSelect)

      searchResults.appendChild(list)
      searchResults.classList.remove('u-hidden')
    } else {
      emitter.emit('clear')
      searchResults.classList.add('u-hidden')
    }
  })

  self.focus = () => {
    searchInput.focus()
  }

  return self
}

export default Search
