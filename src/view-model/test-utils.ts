import { RenderedLineInfo } from './scroll-view-model.ts'

export function renderLine(line: RenderedLineInfo): string {
  return `${line.labels}: ${line.text
    .map((spans) => spans.join(' '))
    .join('\t')}`
}