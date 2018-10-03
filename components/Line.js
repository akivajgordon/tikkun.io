import { displayRange, textFilter } from '../src'

const petuchaClass = (isPetucha) => isPetucha ? 'mod-petucha' : ''
const setumaClass = (column) => column.length > 1 ? 'mod-setuma' : ''

const Line = ({ text, verses, aliyot, isPetucha }, annotated) => `
  <div class="line ${petuchaClass(isPetucha)}">
    ${text.map((column) => (`
      <div class="column">
        ${column.map((fragment) => (`
          <span class="fragment ${setumaClass(column)}">${textFilter({ text: fragment, annotated })}</span>
        `)).join('')}
      </div>
    `)).join('')}
    <span class="location-indicator mod-verses" ${annotated ? '' : 'hidden'}>${displayRange.asVersesRange(verses)}</span>
    <span class="location-indicator mod-aliyot" ${annotated ? '' : 'hidden'} data-target-id="aliyot-range">${displayRange.asAliyotRange(aliyot, verses)}</span>
  </div>
`

export default Line
