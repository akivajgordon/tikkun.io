import { Ref } from '../ref.ts'
import { compareRefs } from '../calendar-model/ref-utils.ts'
import { LeiningRun, LeiningAliyah } from '../calendar-model/model-types.ts'
import { findLastIndex } from '../calendar-model/utils.ts'

export class AliyahLabeller {
  /**
   * The index (if any) for the end of an עלייה from the previous פסוק.
   * This is stored to be applied to the following פסוק, if it does not
   * already have some other label, and if it's also the end of another
   * עלייה (on חול המועד סוכות).
   *
   * This is stored in a class field to persist across labelled lines.
   */
  previousEndIndex = -1
  /** When this changes, we discard the above field. */
  previousRun?: LeiningRun

  /**
   * Computes the set of עלייה labels to display for a line:
   *  - If one or (for מפטיר and שביעי) more עליות begin in this line, return them.
   *  - If an עלייה ends at this line, but a new עלייה or פרשה begins in the next פסוק, return nothing.
   *  - If an עלייה ends at this line, and a new עלייה does not begin in the vicinity, return `סוף`.
   * @param run The run containing the פסוקים.
   *    This will be null for פסוקים that come after the end of the run.
   *    In that case, we may still want to label the end of the last עלליה from the previous line.
   * @param verses The פסוקים that begin in this line, if any.
   */
  getLabelsForLine(run: LeiningRun | undefined, verses: Ref[]): string[] {
    if (run && run !== this.previousRun) {
      this.previousEndIndex = -1
    }

    if (!verses.length) return []
    if (!run && this.previousEndIndex < 0) return []
    const labels: string[] = []

    // TODO(haftara): Decide how to label skips
    for (const v of verses) {
      // First, look for an עלייה in the containing run.
      const starts =
        run?.aliyot.filter((a) => a.index && refEquals(a.start, v)) ?? []
      labels.push(
        ...starts.map((a) => aliyahName(a.index, run!)).filter((x) => x)
      )

      if (this.previousEndIndex >= 0) {
        const previousEndLabel = `סוף ${aliyahName(
          this.previousRun!.aliyot[this.previousEndIndex].index,
          this.previousRun!,
          { isEnd: true }
        )}`

        // If there is no label here, and the previous פסוק ended an עלייה,
        // add its label here.
        if (!starts.length) labels.push(previousEndLabel)
        // If the previous פסוק is the end of a different עלייה, label that.
        else if (
          run &&
          !starts.includes(run?.aliyot[this.previousEndIndex + 1])
        )
          labels.push(previousEndLabel)
      }

      this.previousEndIndex = run
        ? findLastIndex(run.aliyot, (a) => refEquals(a.end, v))
        : -1
    }
    // We can only set this after we consume this field above.
    // This lets us render a label, even when the current line
    // has no run.
    this.previousRun = run
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

export function aliyahName(
  index: LeiningAliyah['index'],
  run: LeiningRun,
  { isEnd }: { isEnd?: boolean } = {}
) {
  if (!index) return ''
  if (index === 'Maftir') return 'מפטיר'
  if (index < 1 || index > aliyahStrings.length) return ''

  if (!isEnd && index === 1) return run.leining.date.title
  if (run.leining.date.title === 'שמחת תורה') {
    if (index === 6) return `חתן תורה`
    if (index === 7) return `חתן בראשית`
  }
  return aliyahStrings[index - 1]
}

function refEquals(a: Ref, b: Ref): boolean {
  return compareRefs(a, b) === 0
}
