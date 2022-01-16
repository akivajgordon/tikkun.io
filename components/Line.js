import { displayRange, textFilter } from '../src'

const ktivKriAnnotation = (text) =>
  text.replace(/[{]/g, `<span class="ktiv-kri">`).replace(/[}]/g, `</span>`)

const petuchaClass = (isPetucha) => (isPetucha ? 'mod-petucha' : '')
const setumaClass = (column) => (column.length > 1 ? 'mod-setuma' : '')

const Line = ({ scroll: __scroll, text, verses, isPetucha }) => `
  <tr>
    <td class="line ${petuchaClass(isPetucha)}">
      ${text
        .map(
          (column) => `
        <div class="column">
          ${column
            .map(
              (fragment) => `
            <span class="fragment ${setumaClass(
              column
            )} mod-annotations-on">${ktivKriAnnotation(
                textFilter({ text: fragment, annotated: true })
              )}</span>
            <span class="fragment ${setumaClass(
              column
            )} mod-annotations-off">${ktivKriAnnotation(
                textFilter({ text: fragment, annotated: false })
              )}</span>
          `
            )
            .join('')}
        </div>
      `
        )
        .join('')}
      <span class="location-indicator mod-verses">${displayRange.asVersesRange(
        verses
      )}</span>
      <span class="location-indicator mod-aliyot" data-target-id="aliyot-range">${__scroll.aliyotFor(
        { verses }
      )}</span>
    </td>
  </tr>
`

export default Line
