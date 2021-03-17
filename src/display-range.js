const hebrewNumeralFromInteger = require('./hebrew-numeral')

var asRange = (strings) => {
  if (!strings.length) {
    return ''
  }

  if (strings.length === 1) {
    return strings[0]
  }

  return [strings[0], strings[strings.length - 1]].join('-')
}

const aliyotStrings = [
  'ראשון',
  'שני',
  'שלישי',
  'רביעי',
  'חמישי',
  'ששי',
  'שביעי',
  'מפטיר'
]

const aliyahName = ({ aliyah, getParshaName }) => {
  if (aliyah < 1 || aliyah > aliyotStrings.length) return null

  if (aliyah === 1) return getParshaName()

  return aliyotStrings[aliyah - 1]
}

const aliyotNames = (aliyot, getParshaName) => aliyot
  .map((aliyah) => aliyahName({ aliyah, getParshaName }))

const asVersesRange = (verses) => asRange(verses.map((verse) => {
  const components = []

  if (verse.verse === 1) {
    components.push(verse.chapter)
  }

  components.push(verse.verse)

  return components
    .map((num) => hebrewNumeralFromInteger(num))
    .join(':')
}))

const asAliyotRange = (aliyot, getParshaName) => {
  if (!aliyot.length) {
    return ''
  }

  const aliyotByName = aliyotNames(aliyot, getParshaName)

  return aliyotByName[0] + (aliyotByName[1] ? ` [${aliyotByName[1]}]` : '')
}

module.exports = { asVersesRange, asAliyotRange, aliyotStrings, aliyotNames, aliyahName }
