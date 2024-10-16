import hebrewNumeralFromInteger from './hebrew-numeral.ts'
import { Ref } from './ref.ts'

const asRange = (strings: string[]) => {
  if (!strings.length) {
    return ''
  }

  if (strings.length === 1) {
    return strings[0]
  }

  return [strings[0], strings[strings.length - 1]].join('-')
}

const asVersesRange = (verses: Ref[]) =>
  asRange(
    verses.map((verse) => {
      const components = []

      if (verse.v === 1) {
        components.push(verse.c)
      }

      components.push(verse.v)

      return components.map((num) => hebrewNumeralFromInteger(num)).join(':')
    })
  )

export default { asVersesRange }
