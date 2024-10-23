import {
  RenderedEntry,
  RenderedLineInfo,
  ScrollViewModel,
} from './scroll-view-model.ts'

export function renderLine(line: RenderedLineInfo): string {
  return `${line.labels}: ${line.text
    .map((spans) => spans.join(' '))
    .join('\t')}`
}

/** Fetches a range of pages around the start of a ScrollViewModel. */
export async function fetchPages(
  model: ScrollViewModel | null,
  { count, fetchPreviousPages }: { count: number; fetchPreviousPages: boolean }
): Promise<RenderedEntry[]> {
  if (!model) throw new Error('No model')
  const pages: RenderedEntry[] = [(await model.startingLocation).page]

  if (fetchPreviousPages) count /= 2
  for (let i = 0; i < count; i++) {
    const previousPage = await model.fetchPreviousPage()
    if (previousPage) pages.unshift(previousPage)
    const nextPage = await model.fetchNextPage()
    if (nextPage) pages.push(nextPage)
  }
  return pages
}
