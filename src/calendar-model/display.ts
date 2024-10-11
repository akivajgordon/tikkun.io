/** @fileoverview Contains logic to build strings for display. */

import { physicalLocationFromRef } from '../location'
import { Ref } from '../ref'
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

export class AliyahLabeller {
  /**
   * The label (if any) for the end of an עלייה from the previous פסוק.
   * This is stored to be applied to the following פסוק, if it does not
   * already have some other label.
   *
   * This is stored in a class field to persist across labelled lines.
   */
  previousEndLabel: string | null = null

  /**
   * Computes the set of עלייה labels to display for a line:
   *  - If one or (for מפטיר and שביעי) more עליות begin in this line, return them.
   *  - If an עלייה ends at this line, but a new עלייה or פרשה begins in the next פסוק, return nothing.
   *  - If an עלייה ends at this line, and a new עלייה does not begin in the vicinity, return `סוף`.
   * @param runs The run containing the פסוקים.
   *    This will be null for פסוקים that come after the end of the run.
   *    In that case, we will still want to label the end of the last עלליה from the previous line.
   * @param verses The פסוקים that begin in this line, if any.
   */
  getLabelsForLine(run: LeiningRun | null, verses: Ref[]): string[] {
    if (!verses.length) return []
    if (!run && !this.previousEndLabel) return []
    const labels: string[] = []

    for (const v of verses) {
      // First, look for an עלייה in the containing run.
      const starts =
        run?.aliyot.filter((a) => a.index && refEquals(a.start, v)) ?? []
      labels.push(...starts.map((a) => aliyahName(a.index, run)))

      // If there is no label here, and the previous פסוק ended an עלייה,
      // add its label here.
      if (!starts.length && this.previousEndLabel)
        labels.push(this.previousEndLabel)

      const end = run?.aliyot.find((a) => refEquals(a.end, v))
      this.previousEndLabel = end ? `סוף ${aliyahName(end.index)}` : null
    }
    return labels
  }
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

function aliyahName(index: LeiningAliyah['index'], run?: LeiningRun) {
  if (index === 'Maftir') return 'מפטיר'
  if (index < 1 || index > aliyahStrings.length) return null

  if (run && index === 1) return run.leining.date.title
  if (run?.leining.date.title === 'שמחת תורה') {
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
