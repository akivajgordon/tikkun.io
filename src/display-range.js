import hebrewNumeralFromInteger from './hebrew-numeral'

var asRange = (strings) => {
  if (!strings.length) {
    return ''
  }

  if (strings.length === 1) {
    return strings[0]
  }

  return [strings[0], strings[strings.length - 1]].join('-')
}

const asVersesRange = (verses) =>
  asRange(
    verses.map((verse) => {
      const components = []

      if (verse.verse === 1) {
        components.push(verse.chapter)
      }

      components.push(verse.verse)

      return components.map((num) => hebrewNumeralFromInteger(num)).join(':')
    })
  )

export default { asVersesRange }
