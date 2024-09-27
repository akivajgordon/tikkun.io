import displayRange from '../display-range'
import textFilter from '../text-filter'

const ktivKriAnnotation = (text: string) =>
  text
    .replace(/[{]/g, `<span class="ktiv-kri">`)
    .replace(/[}]/g, `</span>`)
    .trim()

const petuchaClass = (isPetucha: boolean) => (isPetucha ? 'mod-petucha' : '')
const setumaClass = (column: unknown[]) =>
  column.length > 1 ? 'mod-setuma' : ''

const Line = ({
  scroll: __scroll,
  text,
  verses,
  isPetucha,
  lineIndex,
}: {
  scroll: { aliyotFor: (verses: unknown) => string }
  text: string[][]
  verses: { verse: number; chapter: number }[]
  isPetucha: boolean
  lineIndex: number
}) => `
  <tr data-class="line" data-line-index="${lineIndex}">
    <td class="line ${petuchaClass(isPetucha)}">
      ${text
        .map(
          (column) => `
        <div class="column">
          ${column
            .map(
              (fragment) => `
            <span class="fragment ${setumaClass(
              column,
            )} mod-annotations-on">${ktivKriAnnotation(
              textFilter({ text: fragment, annotated: true }),
            )}</span>
            <span class="fragment ${setumaClass(
              column,
            )} mod-annotations-off">${ktivKriAnnotation(
              textFilter({ text: fragment, annotated: false }),
            )}</span>
          `,
            )
            .join('')}
        </div>
      `,
        )
        .join('')}
      <span class="location-indicator mod-verses">${displayRange.asVersesRange(
        verses,
      )}</span>
      <span class="location-indicator mod-aliyot" data-target-id="aliyot-range">${__scroll.aliyotFor(
        { verses },
      )}</span>
    </td>
  </tr>
`

export default Line
