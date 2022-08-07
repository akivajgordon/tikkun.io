import { defaultRef, resolveToValidRef } from './location'
import parshiyot from './data/parshiyot.json'
import schedule from './data/schedule.json'
import holydays from './data/holydays.json'

const isURL = (url) => {
  try {
    new URL(url)
  } catch (e) {
    return false
  }

  return true
}

const hashOf = (url) => {
  if (!isURL(url)) return ''

  return new URL(url).hash
}

const RefRouter = {
  refFromPathParts: ({ pathParts }) => {
    if (!pathParts || !pathParts[0].length) return defaultRef()
    const locationMatch = pathParts[0].match(/(\d+)\-(\d+)-(\d+)/)

    if (!locationMatch) return defaultRef()

    return resolveToValidRef({
      scroll: 'torah',
      book: locationMatch[1],
      chapter: locationMatch[2],
      verse: locationMatch[3],
    })
  },
}

const ParshaRouter = {
  refFromPathParts: ({ pathParts }) => {
    if (!pathParts || !pathParts[0].length) return defaultRef()

    const decoded = decodeURIComponent(pathParts[0])

    const toLowercaseAlpha = (str) => str.toLowerCase().replace(/[^a-z]/g, '')

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

const HolydayRouter = {
  refFromPathParts: ({ pathParts }) => {
    const holyday = pathParts[0]

    const holydaysAndEsther = {
      ...holydays,
      esther: { ref: { b: 1, c: 1, v: 1 } },
    }

    if (!Object.keys(holydaysAndEsther).includes(holyday)) return defaultRef()

    return { scroll: holyday, ...holydaysAndEsther[holyday].ref }
  },
}

const NextRouter = {
  new: ({ scheduleFetcher }) => ({
    refFromPathParts: async ({ pathParts, asOfDate }) => {
      const schedule = await scheduleFetcher.fetch()
      const found = schedule.find(
        ({ datetime }) => new Date(datetime) > new Date(asOfDate || Date.now())
      )

      if (!found) return defaultRef()

      const parsha = parshiyot.find(
        ({ he }) => found.label.split('–')[0].trim() === he
      )

      const { b, c, v } = parsha.ref

      return { scroll: 'torah', b, c, v }
    },
  }),
}

const DefaultRouter = { refFromPathParts: () => defaultRef() }

const emptyScheduleFetcher = { fetch: () => [] }

export default async ({
  url,
  asOfDate,
  scheduleFetcher = emptyScheduleFetcher,
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
