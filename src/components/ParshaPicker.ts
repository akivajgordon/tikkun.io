import _parshiyot from '../data/parshiyot.json'
import scheduleFetcher from '../schedule'
import _holydays from '../data/holydays.json'
import fuzzy from '../fuzzy'
import slugify from '../slugify'
import utils from './utils.ts'
import ParshaResult, { NoResults } from './ParshaResult.ts'
import Search, { SearchEmitter } from './Search.ts'
import EventEmitter from '../event-emitter'
import { Ref } from '../ref'

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

const Parsha = ({ he, ref, href }: { he: string; ref: Ref; href?: string }) => `
  <li><a
    class="parsha"
    href="${href ?? `#/r/${ref.b}-${ref.c}-${ref.v}`}"
  >
    ${he}
  </a></li>
  `

type Parsha = {
  idx: number | string
  he: string
  en: string
  ref: Ref
}

type BookType = Parsha[]

const Book = (book: BookType) => `
  <li class="parsha-book">
    <ol class="parsha-list">
      ${book.map((p) => Parsha({ he: p.he, ref: p.ref })).join('')}
    </ol>
  </li>
`

const parshaFromLabel = ({ label }: { label: string }) =>
  parshiyot.find(({ he }) => label.startsWith(he))

const ComingUpReading = (
  { label, date, datetime }: { label: string; date: string; datetime: string },
  index: number
) => {
  const parsha = parshaFromLabel({ label })
  return `
  <li style="display: table-cell; width: calc(100% / 3); padding: 0 0.5em;">
    <div class="stack small" style="display: flex; flex-direction: column; align-items: center;">
      <a
        href="#${
          index === 0
            ? '/next'
            : `/r/${parsha.ref.b}-${parsha.ref.c}-${parsha.ref.v}`
        }"
        class="coming-up-button"
      >${label}</a>
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
                  he: holyday.he,
                  ref: holyday.ref,
                })
              })
              .join('\n')}
          </ol>
        </li>
      `
        )
        .join('\n')}
    </ol>

    <h2 class="section-heading">מגילות</h2>
    <ol class="parsha-books">
      <li class="parsha-book">
        <ol class="parsha-list">
          ${Parsha({
            he: 'אסתר',
            ref: { b: 1, c: 1, v: 1 },
            href: '#/run/2025-03-14:megillah,megillah',
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
    })
  ),
  {
    idx: 'esther',
    token: 'esther',
    ref: { b: 1, c: 1, v: 1 },
    he: 'אסתר',
    en: 'Esther',
    key: 'esther',
  },
  ...Object.keys(holydays).map((holydayKey): Searchable => {
    const holyday = holydays[holydayKey]

    const { he, en, ref } = holyday

    return {
      idx: holydayKey,
      token: 'holydays',
      ref,
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

export default () => {
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
      '#coming-up-readings-list'
    )

    comingUpReadingsList.replaceWith(
      htmlToElement(`
        <ol id="coming-up-readings-list" class="cluster" style="list-style: none; display: table; margin-left: auto; margin-right: auto; white-space: nowrap;">
          ${comingUpReadings.map(ComingUpReading).join('')}
        </ol>
        `)
    )
    ;[
      ...self.querySelectorAll('[data-target-class="coming-up-reading"]'),
    ].forEach((comingUpReading, index) => {
      comingUpReading.addEventListener('click', () => {
        gtag('event', 'coming_up_selection', {
          event_category: 'navigation',
          event_label: ['due up', 'on deck', 'in the hole'][index],
        })
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
    })
  })

  return {
    node: self,
    onMount: () => {
      setTimeout(() => s.focus(), 0)
    },
  }
}
