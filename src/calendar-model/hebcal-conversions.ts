/** @fileoverview Contains generic helpers to convert between @hebcal types and our model types. */

import { Aliyah, calculateNumVerses } from '@hebcal/leyning'
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
      // TODO(later): Expand this once we add more scrolls.
      scroll: torahIndex ? 'torah' : 'esther',
      b: torahIndex,
      c: parseInt(c),
      v: parseInt(v),
    }
  }
}

/** Converts a hebcal index string (from `AliyahMap`) to our `index` property value. */
export function toAliyahIndex(key: string): LeiningAliyah['index'] {
  if (key === 'M') return 'Maftir'
  return parseInt(key)
}
