import _parshiyot from '../data/parshiyot.json'
import scheduleFetcher from '../schedule'
import _holydays from '../data/holydays.json'
import fuzzy from '../fuzzy'
import slugify from '../slugify'
import utils from './utils.ts'
import ParshaResult, { NoResults } from './ParshaResult.ts'
import Search, { SearchEmitter } from './Search.ts'
import EventEmitter from '../event-emitter'
import { Ref, RefWithScroll, Scroll } from '../ref'

type Reading = {
  en: string
  he: string
  ref: Ref
}

const parshiyot: Reading[] = _parshiyot
const holydays: Record<string, Reading> = _holydays

const { htmlToElement } = utils

const holydaysLayout = [
  [
    'rosh-1',
    'rosh-2',
    'yom-kippur',
    'rosh-chodesh',
    'taanit-tzibur',
    'tisha-bav',
    'shavuot-1',
    'shavuot-2',
  ],
  [
    'sukkot-1',
    'sukkot-2',
    'sukkot-3',
    'sukkot-4',
    'sukkot-5',
    'sukkot-6',
    'sukkot-7',
    'sukkot-shabbat-chol-hamoed',
    'shmini-atzeret',
    'simchat-torah',
  ],
  [
    'pesach-1',
    'pesach-2',
    'pesach-3',
    'pesach-4',
    'pesach-5',
    'pesach-6',
    'pesach-shabbat-chol-hamoed',
    'pesach-7',
    'pesach-8',
  ],
  [
    'purim',
    'chanukah-1',
    'chanukah-2',
    'chanukah-3',
    'chanukah-4',
    'chanukah-5',
    'chanukah-7',
    'chanukah-8',
  ],
]

export type Token = 'torah' | 'esther' | 'holydays'

const Parsha = ({
  idx,
  token,
  he,
  key,
}: {
  idx: unknown
  token: Token
  he: string
  key: unknown
}) => `
  <li><button
    class="parsha"
    data-idx="${idx}"
    data-token="${token}"
    data-target-id="parsha"
    data-key="${key}"
  >
    ${he}
  </button></li>
  `

type Parsha = {
  idx: number | string
  he: string
  en: string
}

type BookType = Parsha[]

const Book = (book: BookType) => `
  <li class="parsha-book">
    <ol class="parsha-list">
      ${book
        .map((p) =>
          Parsha({ idx: p.idx, token: 'torah', he: p.he, key: slugify(p.en) }),
        )
        .join('')}
    </ol>
  </li>
`

const parshaFromLabel = ({ label }: { label: string }) =>
  parshiyot.find(({ he }) => label.startsWith(he))

const ComingUpReading = (
  { label, date, datetime }: { label: string; date: string; datetime: string },
  index: number,
) => {
  const parsha = parshaFromLabel({ label })
  return `
  <li style="display: table-cell; width: calc(100% / 3); padding: 0 0.5em;">
    <div class="stack small" style="display: flex; flex-direction: column; align-items: center;">
      <button
        data-target-class="coming-up-reading"
        data-idx="${index}"
        data-key="${index === 0 ? 'next' : slugify(parsha.en)}"
        class="coming-up-button"
      >${label}</button>
      <time class="coming-up-date" datetime="${datetime}">${date}</time>
    </div>
  </li>
  `
}

const ComingUp = () => `
  <section dir="ltr" id="coming-up" class="section mod-alternate mod-padding">
    <div class="stack medium">
      <label class="section-label">Coming up</label>
      <div style="overflow-x: auto;">
        <ol id="coming-up-readings-list" class="cluster" style="list-style: none; display: table; margin-left: auto; margin-right: auto; white-space: nowrap;">
        </ol>
      </div>
    </div>
  </section>
`

const Browse = () => `
  <div class="browse">
    <h2 class="section-heading">פרשת השבוע</h2>
    <ol class="parsha-books mod-emphasize-first-in-group">
      ${parshiyot
        .reduce((books, parsha, idx) => {
          const book = parsha.ref.b
          books[book] = books[book] || []
          books[book].push({ ...parsha, idx })
          return books
        }, [])
        .map(Book)
        .join('')}
    </ol>

    <h2 class="section-heading">חגים</h2>
    <ol class="parsha-books">
      ${holydaysLayout
        .map(
          (col) => `
        <li class="parsha-book">
          <ol class="parsha-list">
            ${col
              .map((holydayKey) => {
                const holyday = holydays[holydayKey]

                return Parsha({
                  idx: holydayKey,
                  token: 'holydays',
                  he: holyday.he,
                  key: holydayKey,
                })
              })
              .join('\n')}
          </ol>
        </li>
      `,
        )
        .join('\n')}
    </ol>

    <h2 class="section-heading">מגילות</h2>
    <ol class="parsha-books">
      <li class="parsha-book">
        <ol class="parsha-list">
          ${Parsha({
            idx: 'esther',
            token: 'esther',
            he: 'אסתר',
            key: 'esther',
          })}
        </ol>
      </li>
    </ol>
  </div>
`

type Searchable = Parsha & {
  token: Token
  key: string
}

const searchables: Searchable[] = [
  ...parshiyot.map(
    (p, index): Searchable => ({
      idx: index,
      token: 'torah',
      ...p,
      key: slugify(p.en),
    }),
  ),
  {
    idx: 'esther',
    token: 'esther',
    he: 'אסתר',
    en: 'Esther',
    key: 'esther',
  },
  ...Object.keys(holydays).map((holydayKey): Searchable => {
    const holyday = holydays[holydayKey]

    const { he, en } = holyday

    return {
      idx: holydayKey,
      token: 'holydays',
      en,
      he,
      key: holydayKey,
    }
  }),
]

const searchResults = (query: string) => {
  return fuzzy(searchables, query, (parsha) => [parsha.he, parsha.en])
}

const top = (n: number) => (_: unknown, i: number) => i < n

const search = (query: string) => {
  const results = searchResults(query)

  if (!results.length) return [NoResults()]

  return results.filter(top(5)).map((result) => ParshaResult(result))
}

declare function gtag(type: 'event', eventName: string, payload: unknown): void

export default (
  jumpToRef: ({
    ref,
  }: {
    ref: RefWithScroll
    source: 'comingUp' | 'search' | 'browse'
    key: string
  }) => void,
) => {
  const searchEmitter = EventEmitter.new<SearchEmitter>()
  const s = Search({ search, emitter: searchEmitter })

  const self = htmlToElement(`
    <div class="parsha-picker">
      <div class="stack xlarge">
        <div class="centerize">
          <div id="search" style="display: inline-block;"></div>
        </div>
        ${ComingUp()}
        ${Browse()}
      </div>
    </div>
  `)

  scheduleFetcher.fetch().then((readingSchedule) => {
    const comingUpReadings = readingSchedule
      .filter((reading) => new Date(reading.datetime) > new Date())
      .slice(0, 3)

    const comingUpReadingsList = document.querySelector(
      '#coming-up-readings-list',
    )

    comingUpReadingsList.replaceWith(
      htmlToElement(`
        <ol id="coming-up-readings-list" class="cluster" style="list-style: none; display: table; margin-left: auto; margin-right: auto; white-space: nowrap;">
          ${comingUpReadings.map(ComingUpReading).join('')}
        </ol>
        `),
    )
    ;[
      ...self.querySelectorAll('[data-target-class="coming-up-reading"]'),
    ].forEach((comingUpReading, index) => {
      comingUpReading.addEventListener('click', (e) => {
        gtag('event', 'coming_up_selection', {
          event_category: 'navigation',
          event_label: ['due up', 'on deck', 'in the hole'][index],
        })

        const idx = Number((e.target as Element).getAttribute(`data-idx`))
        const token = 'torah' // e.getAttribute(`data-token`)

        const { ref, key } = {
          torah: (idx: number) => {
            const label = comingUpReading.textContent

            const parsha = parshaFromLabel({ label })

            return {
              ref: { ...parsha.ref, scroll: 'torah' as const },
              key: idx === 0 ? 'next' : slugify(parsha.en),
            }
          },
          holydays: (idx: Scroll) => ({
            ref: { ...holydays[idx].ref, scroll: idx },
            key: idx,
          }),
          esther: () => ({
            ref: { b: 1, c: 1, v: 1, scroll: 'esther' as const },
            key: 'esther',
          }),
        }[token](idx)

        jumpToRef({ ref, source: 'comingUp', key })
      })
    })
  })

  searchEmitter.on('selection', (selected) => {
    gtag('event', 'search_selection', {
      event_category: 'navigation',
      event_label: selected
        .querySelector('[data-target-class="result-hebrew"]')
        .textContent.trim(),
    })

    const result = selected.querySelector('[data-target-class="parsha-result"]')

    const idx = result.getAttribute(`data-idx`) as Scroll
    const token = result.getAttribute(`data-token`) as
      | 'torah'
      | 'holydays'
      | 'esther'

    const { ref, key } = {
      torah: (idx: number | string) => {
        const parsha = parshiyot[Number(idx)]

        return {
          ref: { ...parsha.ref, scroll: 'torah' as const },
          key: slugify(parsha.en),
        }
      },
      holydays: (idx: Scroll) => ({
        ref: { ...holydays[idx].ref, scroll: idx },
        key: idx,
      }),
      esther: () => ({
        ref: { b: 1, c: 1, v: 1, scroll: 'esther' as const },
        key: 'esther',
      }),
    }[token](idx)

    jumpToRef({ ref, source: 'search', key })
  })

  searchEmitter.on('search', (query) => {
    self.querySelector('.browse').classList.add('u-hidden')
    self.querySelector('#coming-up').classList.add('u-hidden')
    gtag('event', 'search', {
      event_category: 'navigation',
      event_label: query,
    })
  })

  searchEmitter.on('clear', () => {
    self.querySelector('.browse').classList.remove('u-hidden')
    self.querySelector('#coming-up').classList.remove('u-hidden')
  })

  self
    .querySelector('#search')
    .parentNode.replaceChild(s.node, self.querySelector('#search'))
  ;[...self.querySelectorAll('[data-target-id="parsha"]')].forEach((parsha) => {
    parsha.addEventListener('click', (e) => {
      const target = e.target as Element

      gtag('event', 'browse_selection', {
        event_category: 'navigation',
        event_label: target.textContent.trim(),
      })

      const idx = target.getAttribute(`data-idx`) as Scroll
      const token = target.getAttribute(`data-token`) as Token

      const { ref, key } = {
        torah: (idx: number | string) => {
          const parsha = parshiyot[Number(idx)]

          return {
            ref: { ...parsha.ref, scroll: 'torah' as const },
            key: slugify(parsha.en),
          }
        },
        holydays: (idx: Scroll) => ({
          ref: { ...holydays[idx].ref, scroll: idx },
          key: idx,
        }),
        esther: () => ({
          ref: { b: 1, c: 1, v: 1, scroll: 'esther' as const },
          key: 'esther',
        }),
      }[token](idx)

      jumpToRef({ ref, source: 'browse', key })
    })
  })

  return {
    node: self,
    onMount: () => {
      setTimeout(() => s.focus(), 0)
    },
  }
}
