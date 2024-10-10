import Line from './Line.ts'
import { RenderedPageInfo } from '../calendar-model/scroll-view-model.ts'

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

const Page = (page: RenderedPageInfo) => `
  <table>
    ${page.lines.map((line, idx) => Line({ lineIndex: idx, ...line })).join('')}
  </table>
`

export default Page
