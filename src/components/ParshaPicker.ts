import fuzzy from '../fuzzy'
import utils from './utils.ts'
import ParshaResult, { NoResults } from './ParshaResult.ts'
import Search, { SearchEmitter } from './Search.ts'
import EventEmitter from '../event-emitter'
import { LeiningGenerator } from '../calendar-model/generator.ts'
import { HDate } from '@hebcal/core'
import {
  LeiningInstance,
  LeiningInstanceId,
} from '../calendar-model/model-types.ts'
import { generateUrl } from '../view-model/navigation/url-parser.ts'
import { isVezosHabracha } from '../view-model/scroll-view-model.ts'
import { last } from '../calendar-model/utils.ts'

const { htmlToElement } = utils

const dateFormat = Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })

const Parsha = (leining: LeiningInstance) => `
  <li><a
    class="parsha"
    href="${generateUrl(leining.runs[0])}"
  >
    ${renderTitle(leining)}
  </a></li>
  `
const Book = (book: LeiningInstance[]) => `
  <li class="parsha-book">
    <ol class="parsha-list">
      ${book.map(Parsha).join('')}
    </ol>
  </li>
`

const ComingUpReading = (obj: LeiningInstance, index: number) => {
  return `
  <li style="display: table-cell; width: calc(100% / 3); padding: 0 0.5em;">
    <div class="stack small" style="display: flex; flex-direction: column; align-items: center;">
      <a
        href="${index === 0 ? '#/next' : generateUrl(obj.runs[0])}"
        class="coming-up-button"
      >${renderTitle(obj)}</a>
      <time class="coming-up-date">${dateFormat.format(obj.date.date)}</time>
    </div>
  </li>
  `
}

const ComingUp = (comingUpReadings: LeiningInstance[]) => `
  <section dir="ltr" id="coming-up" class="section mod-alternate mod-padding">
    <div class="stack medium">
      <label class="section-label">Coming up</label>
      <div style="overflow-x: auto;">
        <ol id="coming-up-readings-list" class="cluster" style="list-style: none; display: table; margin-left: auto; margin-right: auto; white-space: nowrap;">
          ${comingUpReadings.map(ComingUpReading).join('')}
        </ol>
      </div>
    </div>
  </section>
`

const holidayGroupStarts = ['ראש השנה א׳', 'סוכות א׳', 'שבועות א׳', 'פסח א׳']
const groupHolidays = (leinings: LeiningInstance[]) => {
  const groups: LeiningInstance[][] = [[]]
  for (const leining of leinings) {
    if (leining.isParsha) continue
    // Only include the first ראש חודש
    if (last(groups).length && leining.date.title.he.startsWith('ראש חודש'))
      continue
    if (leining.date.title.he.startsWith('תענית אסתר')) continue
    if (holidayGroupStarts.includes(leining.date.title.he)) groups.push([])
    last(groups).push(leining)
  }
  return groups
}

const Browse = (leinings: LeiningInstance[]) => `
  <div class="browse">
    <h2 class="section-heading">פרשת השבוע</h2>
    <ol class="parsha-books mod-emphasize-first-in-group">
      ${leinings
        .filter((o) => o.isParsha || isVezosHabracha(o.runs[0]))
        .reduce((books, leining, idx) => {
          // TODO: Change to groupBy()
          const book = leining.runs[0].aliyot[0].start.b
          books[book] = books[book] || []
          books[book].push({ ...leining, idx })
          return books
        }, [])
        .map(Book)
        .join('')}
    </ol>

    <h2 class="section-heading">חגים</h2>
    <ol class="parsha-books">
      ${groupHolidays(leinings)
        .map(
          (col) => `
        <li class="parsha-book">
          <ol class="parsha-list">
            ${col.map(Parsha).join('\n')}
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
          ${leinings
            .filter((o) => o.id === LeiningInstanceId.Megillah)
            .map(Parsha)
            .join('\n')}
        </ol>
      </li>
    </ol>
  </div>
`

const top = (n: number) => (_: unknown, i: number) => i < n

const search = (leinings: LeiningInstance[], query: string) => {
  const results = fuzzy(leinings, query, (o) => [
    o.date.title.he,
    o.date.title.en,
  ])

  if (!results.length) return [NoResults()]

  return results.filter(top(5)).map((result) => ParshaResult(result))
}

function renderTitle(obj: LeiningInstance) {
  let title = obj.date.title.he.replace('פרשת ', '')
  if (obj.id !== LeiningInstanceId.Shacharis) title += `: ${obj.id}`
  return title
}

declare function gtag(type: 'event', eventName: string, payload: unknown): void

export default (generator: LeiningGenerator) => {
  const leinings = generator
    .forEntireChumash(new HDate())
    .flatMap((ld) => ld.leinings)

  const searchEmitter = EventEmitter.new<SearchEmitter>()
  const s = Search({
    search: search.bind(null, leinings),
    emitter: searchEmitter,
  })

  const comingUpReadings = leinings
    .filter((ld) => ld.date.date > new Date())
    .slice(0, 3)

  const self = htmlToElement(`
    <div class="parsha-picker">
      <div class="stack xlarge">
        <div class="centerize">
          <div id="search" style="display: inline-block;"></div>
        </div>
        ${ComingUp(comingUpReadings)}
        ${Browse(leinings)}
      </div>
    </div>
  `)

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
