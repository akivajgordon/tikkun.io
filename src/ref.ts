import type parshiyot from './data/parshiyot.json'
import type holydays from './data/holydays.json'

export type ParshaName = (typeof parshiyot)[number]['en']

export type Ref = {
  /** Book number. 1 for בראשית, etc. */
  b: number
  c: number
  v: number
}

export type Holyday = keyof typeof holydays

export type ScrollName = 'torah' | 'esther' | Holyday

export type RefWithScroll = Ref & {
  scroll: ScrollName
}
