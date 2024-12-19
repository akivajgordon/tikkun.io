export type Ref = {
  /** Book number. 1 for בראשית, etc. */
  b: number
  c: number
  v: number
}

export type ScrollName = 'torah' | 'esther'

export type RefWithScroll = Ref & {
  scroll: ScrollName
}
