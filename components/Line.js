import { displayRange, textFilter } from '../src'
const parshiyot = require('../build/parshiyot.json')
const holydays = require('../build/holydays.json')
const aliyotJSON = require('../build/aliyot.json')

const ktivKriAnnotation = text => text.replace(/[{]/g, `<span class="ktiv-kri">`).replace(/[}]/g, `</span>`)

const petuchaClass = (isPetucha) => isPetucha ? 'mod-petucha' : ''
const setumaClass = (column) => column.length > 1 ? 'mod-setuma' : ''

const aliyahFinderByScroll = {
  torah: parshiyot,
  ...Object.keys(holydays).reduce((result, holydayKey) => {
    return { ...result, [holydayKey]: [holydays[holydayKey]] }
  }, {})
}

const aliyotByRefByScroll = aliyotJSON


const getParshaName = (verses, __scroll) => () => parshaName(verses, __scroll)

const aliyotDisplay = ({ verses, scroll }) => {
  const found = verses.map(({ book, chapter, verse }) => {
    return aliyotByRefByScroll[scroll]?.[book]?.[chapter]?.[verse]
  }).filter(Boolean)

  if (!found.length) return ''

  const { standard, double, special } = found[0]

  return [
    ...standard ? [standard.map(n => displayRange.aliyahName({ aliyah: n, getParshaName: getParshaName(verses, scroll ) })).join(', ')] : [],
    ...double ? [`[${displayRange.aliyahName({ aliyah: double, getParshaName: getParshaName(verses, scroll ) })}]`] : [],
    ...special ? [`(${displayRange.aliyahName({ aliyah: special, getParshaName: getParshaName(verses, scroll)})})`] : []
  ].join(' ')
}

const parshaName = (verses, __scroll) => aliyahFinderByScroll[__scroll]
  .find(({ ref }) => verses
    .some(({ book: b, chapter: c, verse: v }) => ref.b === b && ref.c === c && ref.v === v
    )
  ).he

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
    <span class="location-indicator mod-aliyot" data-target-id="aliyot-range">${aliyotDisplay({ verses, scroll: __scroll })}</span>
  </div>
`

export default Line
