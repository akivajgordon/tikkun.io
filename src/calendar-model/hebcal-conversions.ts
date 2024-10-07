/** @fileoverview Contains generic helpers to convert between @hebcal types and our model types. */

import { Aliyah, calculateNumVerses } from '@hebcal/leyning'
import { Ref, RefWithScroll } from '../ref'
import { LeiningAliyah } from './model-types'

// TODO(later): Change the JSON to use these names and get rid of this array.
const bookNames = [
  '',
  'Genesis',
  'Exodus',
  'Leviticus',
  'Numbers',
  'Deuteronomy',
]

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
    const torahIndex = bookNames.indexOf(a.k)
    return {
      // TODO(haftara): Expand this once we add more scrolls.
      scroll: torahIndex ? 'torah' : 'esther',
      b: torahIndex,
      c: parseInt(c),
      v: parseInt(v),
    }
  }
}

/** Counts the number of פסוקים between two locations. Returns zero if both arguments are equal. */
export function numVersesBetween(start: Ref, end: RefWithScroll): number {
  // TODO(haftara): Handle other scrolls.
  // Note that this is currently only used in חומש.

  // Construct a fake Aliyah to pass to hebcal's utility function.
  const aliyah: Aliyah = {
    b: `${start.v}:${start.c}`,
    e: `${end.c}:${end.v}`,
    k: bookNames[start.b],
  }
  // This helper includes the ending verse, which is not what we want here.
  return calculateNumVerses(aliyah) - 1
}

/** Converts a hebcal index string (from `AliyahMap`) to our `index` property value. */
export function toAliyahIndex(key: string): LeiningAliyah['index'] {
  if (key === 'M') return 'Maftir'
  return parseInt(key)
}
