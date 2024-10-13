import { Ref } from '../ref.ts'
import { compareRefs } from './display.ts'
import { LeiningRun, LeiningAliyah } from './model-types.ts'

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
   * @param run The run containing the פסוקים.
   *    This will be null for פסוקים that come after the end of the run.
   *    In that case, we may still want to label the end of the last עלליה from the previous line.
   * @param verses The פסוקים that begin in this line, if any.
   */
  getLabelsForLine(run: LeiningRun | undefined, verses: Ref[]): string[] {
    if (!verses.length) return []
    if (!run && !this.previousEndLabel) return []
    const labels: string[] = []

    // TODO(haftara): Decide how to label skips
    for (const v of verses) {
      // First, look for an עלייה in the containing run.
      const starts =
        run?.aliyot.filter((a) => a.index && refEquals(a.start, v)) ?? []
      labels.push(
        ...starts.map((a) => aliyahName(a.index, run!)).filter((x) => x)
      )

      // If there is no label here, and the previous פסוק ended an עלייה,
      // add its label here.
      if (!starts.length && this.previousEndLabel)
        labels.push(this.previousEndLabel)

      const end = run?.aliyot.find((a) => refEquals(a.end, v))
      this.previousEndLabel = end
        ? `סוף ${aliyahName(end.index, run!, {
            isEnd: true,
          })}`
        : null
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

function aliyahName(
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
