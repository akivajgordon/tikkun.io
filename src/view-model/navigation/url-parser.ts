import { LeiningGenerator } from '../../calendar-model/generator.ts'
import { LeiningRun } from '../../calendar-model/model-types.ts'
import { ScrollViewModel } from '../scroll-view-model.ts'

/** Generates a URL that points to the beginning of a specific run. */
export function generateUrl(run: LeiningRun) {
  return `#/run/${run.id}`
}

// TODO(decide): Should we support links to a specific עלייה in a run?

const pathHandlers: Record<
  string,
  (
    generator: LeiningGenerator,
    ...pathParts: string[]
  ) => ScrollViewModel | null
> = {
  run(generator, runId) {
    return ScrollViewModel.forId(generator, runId)
  },
  /** Legacy URL: Specifies a ref in חומש. */
  r(generator, ref) {
    if (!ref) return null
    const [, book, chapter, verse] = ref.match(/^(\d+)-(\d+)-(\d+)$/) ?? []

    if (!book || !chapter || !verse) return null

    return ScrollViewModel.forRef(generator, {
      scroll: 'torah',
      b: Number(book),
      c: Number(chapter),
      v: Number(verse),
    })
  },
  /** Legacy URL: The next leining. */
  next(generator) {
    return ScrollViewModel.forDate(generator, new Date())
  },
  // TODO(decide): Should we maintain support for Parsha & Holiday URLs?
}

/** Parses a URL path (without #) into the ScrollViewModel to display. */
export function parseUrl(
  generator: LeiningGenerator,
  path: string
): ScrollViewModel | null {
  const [urlType, ...pathParts] = path.split('/').filter((p) => p)
  return pathHandlers[urlType]?.(generator, ...pathParts) ?? null
}
