import { displayRange, textFilter } from '../src'
const parshiyot = require('../build/parshiyot.json')
const holydays = require('../build/holydays.json')

const ktivKriAnnotation = text => text.replace(/[{]/g, `<span class="ktiv-kri">`).replace(/[}]/g, `</span>`)

const petuchaClass = (isPetucha) => isPetucha ? 'mod-petucha' : ''
const setumaClass = (column) => column.length > 1 ? 'mod-setuma' : ''

const aliyahFinderByScroll = {
  torah: parshiyot,
  'rosh-1': [holydays['rosh-1']]
}

const parshaName = (verses, __scroll) => aliyahFinderByScroll[__scroll]
  .find(({ ref }) => verses
    .some(({ book: b, chapter: c, verse: v }) => ref.b === b && ref.c === c && ref.v === v
    )
  ).he

const getParshaName = (verses, __scroll) => () => parshaName(verses, __scroll)

const Line = ({ scroll: __scroll, text, verses, aliyot, isPetucha }) => `
  <div class="line ${petuchaClass(isPetucha)}">
    ${text.map((column) => (`
      <div class="column">
        ${column.map((fragment) => (`
          <span class="fragment ${setumaClass(column)} mod-annotations-on">${ktivKriAnnotation(textFilter({ text: fragment, annotated: true }))}</span>
          <span class="fragment ${setumaClass(column)} mod-annotations-off">${ktivKriAnnotation(textFilter({ text: fragment, annotated: false }))}</span>
        `)).join('')}
      </div>
    `)).join('')}
    <span class="location-indicator mod-verses">${displayRange.asVersesRange(verses)}</span>
    <span class="location-indicator mod-aliyot" data-target-id="aliyot-range">${displayRange.asAliyotRange(aliyot, getParshaName(verses, __scroll))}</span>
  </div>
`

export default Line
