/** @fileoverview Contains generic helpers to convert between @hebcal types and our model types. */

import { Aliyah, calculateNumVerses } from '@hebcal/leyning'
import { Ref, RefWithScroll, ScrollName } from '../ref.ts'
import { LeiningAliyah } from './model-types.ts'

/** Maps scrolls with multiple books to their book names as used in @hebcal. */
const bookNames: Partial<Record<ScrollName, string[]>> = {
  torah: ['', 'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy'],
  // TODO(haftara): Add Trei Asar, Shmuel, Melachim
  // TODO(haftara): Add any other differences between ScrollName and @hebcal's parameters.
}

/** Maps book names that appear in @hebcal to `{scroll, b}` properties used in our JSON. */
const hebCalToScrollBook = Object.fromEntries(
  Object.entries(bookNames).flatMap(([scroll, books]) =>
    books.map((book, index) => [
      book,
      { scroll: scroll as ScrollName, b: index },
    ])
  )
)

export function toLeiningAliyah(
  a: Aliyah,
  index?: LeiningAliyah['index']
): LeiningAliyah {
  return {
    start: toRef(a.b),
    end: toRef(a.e),
    index,
  }

  function toRef(verse: string): RefWithScroll {
    const [c, v] = verse.split(':')
    const bookRef = hebCalToScrollBook[a.k] ?? {
      scroll: a.k.toLowerCase(),
      b: 1,
    }
    return {
      ...bookRef,
      c: parseInt(c),
      v: parseInt(v),
    }
  }
}

/** Counts the number of פסוקים between two locations. Returns zero if both arguments are equal. */
export function numVersesBetween(start: Ref, end: RefWithScroll): number {
  // Note that this is currently only used in חומש.

  // Construct a fake Aliyah to pass to hebcal's utility function.
  const aliyah: Aliyah = {
    b: `${start.v}:${start.c}`,
    e: `${end.c}:${end.v}`,
    // If the book isn't in our map, convert our lowercase name to @hebcal's title-case name
    k: bookNames[end.scroll]?.[start.b] ?? toTitleCase(end.scroll),
  }
  // This helper includes the ending verse, which is not what we want here.
  return calculateNumVerses(aliyah) - 1
}

function toTitleCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/** Converts a hebcal index string (from `AliyahMap`) to our `index` property value. */
export function toAliyahIndex(key: string): LeiningAliyah['index'] {
  if (key === 'M') return 'Maftir'
  return parseInt(key)
}
