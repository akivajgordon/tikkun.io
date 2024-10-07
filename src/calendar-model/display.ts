/** @fileoverview Contains logic to build strings for display. */

import { physicalLocationFromRef } from '../location'
import { Ref } from '../ref'
import { numVersesBetween } from './hebcal-conversions'
import { LeiningRun, LeiningAliyah } from './model-types'

/** Returns true if the next עלייה is far enough away to need a second ספר תורה. */
export function isSameRun(existing: LeiningAliyah, next: LeiningAliyah) {
  if (existing.end.b !== next.start.b) return false
  // If they're in the same פרק, they're definitely close.
  if (existing.end.c === next.start.c) return true

  const existingLocation = physicalLocationFromRef(existing.end)
  const nextLocation = physicalLocationFromRef(next.start)

  return Math.abs(nextLocation.pageNumber - existingLocation.pageNumber) < 3
}

/**
 * Computes the set of עלייה labels to display for a line:
 *  - If one or (for מפטיר and שביעי) more עליות begin in this line, return them.
 *  - If an עלייה ends at this line, but a new עלייה or פרשה begins in the next פסוק, return nothing.
 *  - If an עלייה ends at this line, and a new עלייה does not begin in the vicinity, return `סוף`.
 * @param runs The run containing the פסוקים, as well as the next run in the scroll.
 * @param verses The פסוקים that begin in this line, if any.
 */
export function getLabels(runs: LeiningRun[], verses: Ref[]): string[] {
  if (!runs.length || !verses.length) return []
  const labels: string[] = []
  const allAliyot = runs.flatMap((r) => r.aliyot)
  for (const v of verses) {
    const myAliyot = runs[0].aliyot
    // First, look for an עלייה in the containing run.
    const starts = myAliyot.filter((a) => a.index && refEquals(a.start, v))
    labels.push(...starts.map((a) => aliyahName(a.index, runs[0])))
    // If we already have labels, we're done.
    if (starts.length) continue

    const ends = myAliyot.filter((a) => refEquals(a.end, v))
    // If no עלייה ends here, there is nothing to label.
    if (!ends.length) continue

    const followUpStarts = allAliyot.some(
      (a) => numVersesBetween(v, a.start) === 1
    )
    // If another עלייה (in this run or another run) starts in the next פסוק,
    // we don't need to label the end.
    if (followUpStarts) continue
    labels.push(`סוף ${aliyahName(ends[0].index, runs[0])}`)
  }
  return labels
}

const aliyahStrings = [
  'ראשון',
  'שני',
  'שלישי',
  'רביעי',
  'חמישי',
  'ששי',
  'שביעי',
]

function aliyahName(index: LeiningAliyah['index'], run: LeiningRun) {
  if (index === 'Maftir') return 'מפטיר'
  if (index < 1 || index > aliyahStrings.length) return null

  if (index === 1) return run.leining.date.title
  if (run.leining.date.title === 'שמחת תורה') {
    if (index === 6) return `חתן תורה`
    if (index === 7) return `חתן בראשית`
  }
  return aliyahStrings[index - 1]
}

/** Checks whether a run or single עלייה contains a פסוק. */
export function containsRef(o: LeiningAliyah | LeiningRun, ref: Ref): boolean {
  if (isRun(o)) return o.aliyot.some((a) => containsRef(a, ref))
  return compareRefs(o.start, ref) <= 0 && compareRefs(o.end, ref) >= 0
}

function compareRefs(a: Ref, b: Ref): -1 | 0 | 1 {
  if (a.b != b.b) return compare(a.b, b.b)
  if (a.c != b.c) return compare(a.c, b.c)
  return compare(a.v, b.v)
}

function refEquals(a: Ref, b: Ref): boolean {
  return compareRefs(a, b) === 0
}

function compare(a: number, b: number): -1 | 0 | 1 {
  if (a === b) return 0
  return a < b ? -1 : 1
}

function isRun(o: object): o is LeiningRun {
  return 'aliyot' in o
}
