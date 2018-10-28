import utils from './utils'

const { htmlToElement } = utils

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

const ParshaResult = ({ match, item }) => htmlToElement(`
  <div data-target-class="parsha-result" data-jump-to-book="${item.ref.b}" data-jump-to-chapter="${item.ref.c}" data-jump-to-verse="${item.ref.v}">
    <p class="search-result-tag" data-target-class="result-hebrew">${match.index === 0 ? decorateString({
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
  </div>
`)

export default ParshaResult

const NoResults = () => htmlToElement(`<p class="" style="text-align: center; color: hsla(0, 0%, 0%, 0.5);">
  No results
</p>
`)

export { NoResults }
