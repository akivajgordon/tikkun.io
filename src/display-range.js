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

const aliyotNames = (aliyot, getParshaName) => aliyot
  .filter((aliyah) => aliyah > 0 && aliyah <= aliyotStrings.length)
  .map((aliyah) => aliyotStrings[aliyah - 1])
  .map(aliyah => {
    if (aliyah === 'ראשון') {
      return getParshaName()
    }

    return aliyah
  })

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

module.exports = { asVersesRange, asAliyotRange }
