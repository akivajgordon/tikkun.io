import hebrewNumeralFromInteger from './hebrew-numeral.ts'

const asRange = (strings: string[]) => {
  if (!strings.length) {
    return ''
  }

  if (strings.length === 1) {
    return strings[0]
  }

  return [strings[0], strings[strings.length - 1]].join('-')
}

type Ref = {
  verse: number
  chapter: number
}

const asVersesRange = (verses: Ref[]) =>
  asRange(
    verses.map((verse) => {
      const components = []

      if (verse.verse === 1) {
        components.push(verse.chapter)
      }

      components.push(verse.verse)

      return components.map((num) => hebrewNumeralFromInteger(num)).join(':')
    }),
  )

export default { asVersesRange }
