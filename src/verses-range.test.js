import test from 'ava'
import hebrewNumeral from './hebrew-numeral'

const versesRange = (verses) => {
  if (verses.length === 1) return hebrewNumeral(verses[0].verse)

  return [
    hebrewNumeral(verses[0].verse),
    hebrewNumeral(verses[verses.length - 1].verse),
  ].join('-')
}

test('a single verse is just the verse number', (t) => {
  t.is(versesRange([{ chapter: 4, verse: 3 }]), 'ג')
})

test('a single verse is just the verse number again', (t) => {
  t.is(versesRange([{ chapter: 5, verse: 9 }]), 'ט')
})

test('a range of verses is the first and last separated by a hyphen', (t) => {
  t.is(
    versesRange([
      { chapter: 5, verse: 9 },
      { chapter: 5, verse: 10 },
      { chapter: 5, verse: 11 },
      { chapter: 5, verse: 12 },
    ]),
    'ט-יב',
  )
})
