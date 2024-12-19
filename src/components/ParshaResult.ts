import { LeiningInstance } from '../calendar-model/model-types.ts'
import { generateUrl } from '../view-model/navigation/url-parser.ts'
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
  item: LeiningInstance
}) =>
  htmlToElement(`
  <a data-target-class="parsha-result" href="${generateUrl(item.runs[0])}">
    <p class="search-result-tag mod-hebrew" data-target-class="result-hebrew">${
      match.index === 0
        ? decorateString({
            string: item.date.title.he,
            atIndexes: match.indexes,
            withDecoration: strongify,
          })
        : item.date.title.he
    }: ${item.id}
    </p>
    <p class="search-result-tag">${
      match.index === 1
        ? decorateString({
            string: item.date.title.en,
            atIndexes: match.indexes,
            withDecoration: strongify,
          })
        : item.date.title.en
    }
    </p>
  </a>
`)

export default ParshaResult

const NoResults = () =>
  htmlToElement(`<p class="" style="text-align: center; color: var(--light-text-color);">
  No results
</p>
`)

export { NoResults }
