import { defaultRef, resolveToValidRef } from './location.ts'
import parshiyot from './data/parshiyot.json'
import holydays from './data/holydays.json'
import { Holyday, Ref, RefWithScroll } from './ref.ts'

// Declare this class to avoid TypeScript compiler errors when running in Node.js.
declare class URL {
  hash: string
  constructor(url: string)
}

const isURL = (url: string) => {
  try {
    new URL(url)
  } catch {
    return false
  }

  return true
}

const hashOf = (url: string): string => {
  if (!isURL(url)) return ''

  return new URL(url).hash
}

type PathPart = string

type Router = {
  refFromPathParts: ({
    pathParts,
    asOfDate,
  }: {
    pathParts: PathPart[]
    asOfDate?: string
  }) => Promise<RefWithScroll>
}

const RefRouter: Router = {
  refFromPathParts: async ({ pathParts }) => {
    if (!pathParts || !pathParts[0].length) return defaultRef()
    const locationMatch = pathParts[0].match(/(\d+)-(\d+)-(\d+)/)

    if (!locationMatch) return defaultRef()

    return resolveToValidRef({
      scroll: 'torah',
      book: locationMatch[1],
      chapter: locationMatch[2],
      verse: locationMatch[3],
    })
  },
}

const ParshaRouter: Router = {
  refFromPathParts: async ({ pathParts }) => {
    if (!pathParts || !pathParts[0].length) return defaultRef()

    const decoded = decodeURIComponent(pathParts[0])

    const toLowercaseAlpha = (str: string) =>
      str.toLowerCase().replace(/[^a-z]/g, '')

    const found = parshiyot.find(({ he, en }) => {
      return (
        he === decoded || toLowercaseAlpha(en) === toLowercaseAlpha(decoded)
      )
    })

    if (!found) return defaultRef()

    const { b, c, v } = found.ref
    return { scroll: 'torah', b, c, v }
  },
}

const HolydayRouter: Router = {
  refFromPathParts: async ({ pathParts }) => {
    const holyday = pathParts[0]

    const holydaysAndEsther: Record<string, { ref: Ref }> = {
      ...holydays,
      esther: { ref: { b: 1, c: 1, v: 1 } },
    }

    const isRecognizedHolyday = (
      holyday: string,
    ): holyday is 'esther' | Holyday =>
      Object.keys(holydaysAndEsther).includes(holyday)

    if (!isRecognizedHolyday(holyday)) return defaultRef()

    return { scroll: holyday, ...holydaysAndEsther[holyday].ref }
  },
}

type Schedule = {
  datetime: string
  label: string
}[]

type ScheduleFetcher = {
  fetch: () => Promise<Schedule>
}

const NextRouter = {
  new: ({ scheduleFetcher }: { scheduleFetcher: ScheduleFetcher }): Router => ({
    refFromPathParts: async ({ asOfDate }: { asOfDate?: string }) => {
      const schedule = await scheduleFetcher.fetch()
      const found = schedule.find(
        ({ datetime }) => new Date(datetime) > new Date(asOfDate || Date.now()),
      )

      if (!found) return defaultRef()

      const parsha = parshiyot.find(
        ({ he }) => found.label.split('–')[0].trim() === he,
      )
      if (!parsha) return defaultRef()

      const { b, c, v } = parsha.ref

      return { scroll: 'torah', b, c, v }
    },
  }),
}

const DefaultRouter = { refFromPathParts: () => defaultRef() }

const emptyScheduleFetcher: ScheduleFetcher = { fetch: async () => [] }

export default async ({
  url,
  asOfDate,
  scheduleFetcher = emptyScheduleFetcher,
}: {
  url: string
  asOfDate?: string
  scheduleFetcher: ScheduleFetcher
}) => {
  const hashParts = hashOf(url).split('/').slice(1)

  const router =
    {
      r: RefRouter,
      p: ParshaRouter,
      h: HolydayRouter,
      next: NextRouter.new({ scheduleFetcher }),
    }[hashParts[0]] || DefaultRouter

  return await router.refFromPathParts({
    pathParts: hashParts.slice(1),
    asOfDate,
  })
}
