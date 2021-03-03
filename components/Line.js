import { displayRange, textFilter } from '../src'

const ktivKriAnnotation = text => text.replace(/[{]/g, `<span class="ktiv-kri">`).replace(/[}]/g, `</span>`)

const petuchaClass = (isPetucha) => isPetucha ? 'mod-petucha' : ''
const setumaClass = (column) => column.length > 1 ? 'mod-setuma' : ''
const shiraClass = (text) => text.length === 3 ? 'mod-shira' : ''

const Line = ({ text, verses, aliyot, isPetucha }) => `
  <div class="line ${petuchaClass(isPetucha)}  ${shiraClass(text)}">
    ${text.map((column) => (`
      <div class="column">
        ${column.map((fragment) => (`
          <span class="fragment ${setumaClass(column)} mod-annotations-on">${ktivKriAnnotation(textFilter({ text: fragment, annotated: true }))}</span>
          <span class="fragment ${setumaClass(column)} mod-annotations-off">${ktivKriAnnotation(textFilter({ text: fragment, annotated: false }))}</span>
        `)).join('')}
      </div>
    `)).join('')}
    <span class="location-indicator mod-verses">${displayRange.asVersesRange(verses)}</span>
    <span class="location-indicator mod-aliyot" data-target-id="aliyot-range">${displayRange.asAliyotRange(aliyot, verses)}</span>
  </div>
`

export default Line
