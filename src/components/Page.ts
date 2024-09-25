import Line from './Line.ts'
import type { ScrollType } from '../scrolls-by-key'

type Verse = {
  book: number
  chapter: number
  verse: number
}

export type LineType = {
  text: string[][]
  verses: Verse[]
  aliyot: { standard: number }[]
  isPetucha: boolean
}

const Page = ({
  scroll: _scroll,
  lines,
}: {
  scroll: ScrollType
  lines: LineType[]
}) => `
  <table>
    ${lines
      .map((line, idx) => Line({ scroll: _scroll, lineIndex: idx, ...line }))
      .join('')}
  </table>
`

export default Page
