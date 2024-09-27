import type parshiyot from './data/parshiyot.json'
import type holydays from './data/holydays.json'

export type ParshaName = (typeof parshiyot)[number]['en']

export type Ref = {
  b: number
  c: number
  v: number
}

export type Holyday = keyof typeof holydays

export type Scroll = 'torah' | 'esther' | Holyday

export type RefWithScroll = Ref & {
  scroll: Scroll
}
