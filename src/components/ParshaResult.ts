import { Token } from './ParshaPicker.ts'
import utils from './utils.ts'

const { htmlToElement } = utils

const decorateString = ({
  string,
  atIndexes,
  withDecoration,
}: {
  string: string
  atIndexes: number[]
  withDecoration: (char: string) => string
}) => {
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

const strongify = (c: string) => `<strong>${c}</strong>`

const ParshaResult = ({
  match,
  item,
}: {
  match: { index: number; indexes: number[] }
  item: { idx: unknown; token: Token; key: string; he: string; en: string }
}) =>
  htmlToElement(`
  <div data-target-class="parsha-result" data-idx="${item.idx}" data-token="${
    item.token
  }" data-key="${item.key}">
    <p class="search-result-tag mod-hebrew" data-target-class="result-hebrew">${
      match.index === 0
        ? decorateString({
            string: item.he,
            atIndexes: match.indexes,
            withDecoration: strongify,
          })
        : item.he
    }
    </p>
    <p class="search-result-tag">${
      match.index === 1
        ? decorateString({
            string: item.en,
            atIndexes: match.indexes,
            withDecoration: strongify,
          })
        : item.en
    }
    </p>
  </div>
`)

export default ParshaResult

const NoResults = () =>
  htmlToElement(`<p class="" style="text-align: center; color: var(--light-text-color);">
  No results
</p>
`)

export { NoResults }
