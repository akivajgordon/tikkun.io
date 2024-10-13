import { RenderedLineInfo } from './scroll-view-model'

export function renderLine(line: RenderedLineInfo): string {
  return `${line.labels}: ${line.text
    .map((spans) => spans.join(' '))
    .join('\t')}`
}
