/* global gtag */

import parshiyot from '../build/parshiyot.json'
import readingSchedule from '../build/schedule.json'
import fuzzy from '../src/fuzzy'
import utils from './utils'
import ParshaResult, { NoResults } from './ParshaResult'

const { htmlToElement } = utils

const Parsha = ({ ref, he, scroll }) => `
  <li
    class="parsha"
    data-target-id="parsha"
    data-jump-to-book="${ref.b}"
    data-jump-to-chapter="${ref.c}"
    data-jump-to-verse="${ref.v}"
    data-scroll="${scroll}"
  >
    ${he}
  </li>
  `

const Book = (book) => `
  <li class="parsha-book">
    <ol class="parsha-list">
      ${book.map(b => Parsha({ ...b, scroll: 'torah' })).join('')}
    </ol>
  </li>
`

const refFromLabel = ({ label }) => parshiyot
  .find(({ he }) => label.startsWith(he))
  .ref

const ComingUpReading = ({ label, date, datetime }) => {
  const { b: book, c: chapter, v: verse } = refFromLabel({ label })
  return `
    <li class="stack small" style="display: flex; flex-direction: column; align-items: center;">
      <button
        data-target-class="coming-up-reading"
        data-jump-to-book="${book}"
        data-jump-to-chapter="${chapter}"
        data-jump-to-verse="${verse}"
        data-scroll="torah"
        class="coming-up-button"
      >${label}</button>
      <time class="coming-up-date" datetime="${datetime}">${date}</time>
    </li>
  `
}

const ComingUp = () => `
  <section dir="ltr" id="coming-up" class="section mod-alternate mod-padding">
    <div class="stack medium">
      <label style="display: block; text-align: center; text-transform: uppercase; font-size: 0.8em; font-weight: 700; color: hsla(0, 0%, 0%, 0.5);">Coming up</label>
      <ol class="cluster" style="list-style: none; display: flex; justify-content: center;">
        ${readingSchedule
          .filter(reading => new Date(reading.datetime) > new Date())
          .slice(0, 3)
          .map(({ label, date, datetime }) => ComingUpReading({ label, date, datetime }))
          .join('')
        }
      </ol>
    </div>
  </section>
`

const Browse = () => `
  <div class="browse">
    <h2 class="section-heading">תורה</h2>
    <ol class="parsha-books">
      ${parshiyot
        .reduce((books, parsha) => {
          const book = parsha.ref.b
          books[book] = books[book] || []
          books[book].push(parsha)
          return books
        }, [])
        .map(Book)
        .join('')
      }
    </ol>

    <h2 class="section-heading">מגילות</h2>
    <ol class="parsha-books">
      <li class="parsha-book">
        <ol class="parsha-list">
          ${Parsha({ ref: { b: 1, c: 1, v: 1 }, he: 'אסתר', scroll: 'esther' })}
        </ol>
      </li>
    </ol>
  </div>
`

const ParshaPicker = (search, searchEmitter, jumpToRef) => {
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

  searchEmitter.on('selection', (selected) => {
    gtag('event', 'search_selection', {
      event_category: 'navigation',
      event_label: selected.querySelector('[data-target-class="result-hebrew"]').textContent.trim()
    })

    const result = selected.querySelector('[data-target-class="parsha-result"]')

    jumpToRef({ ref: result, scroll: result.getAttribute('data-scroll') })
  })

  searchEmitter.on('search', query => {
    self.querySelector('.browse').classList.add('u-hidden')
    self.querySelector('#coming-up').classList.add('u-hidden')
    gtag('event', 'search', {
      event_category: 'navigation',
      event_label: query
    })
  })

  searchEmitter.on('clear', () => {
    self.querySelector('.browse').classList.remove('u-hidden')
    self.querySelector('#coming-up').classList.remove('u-hidden')
  })

  self.querySelector('#search').parentNode.replaceChild(search, self.querySelector('#search'))

  ;[...self.querySelectorAll('[data-target-id="parsha"]')]
    .forEach((parsha) => {
      parsha.addEventListener('click', (e) => {
        gtag('event', 'browse_selection', {
          event_category: 'navigation',
          event_label: e.target.textContent.trim()
        })
        jumpToRef({ ref: e.target, scroll: e.target.getAttribute('data-scroll') })
      })
    })

  ;[...self.querySelectorAll('[data-target-class="coming-up-reading"]')]
    .forEach(comingUpReading => {
      comingUpReading.addEventListener('click', e => {
        gtag('event', 'coming_up_selection', {
          event_category: 'navigation',
          event_label: e.target.textContent.trim()
        })

        jumpToRef({ ref: e.target, scroll: e.target.getAttribute('data-scroll') })
      })
    })

  return self
}

const searchables = [
  ...parshiyot.map(p => ({ ...p, scroll: 'torah' })),
  {
    he: 'אסתר',
    en: 'Esther',
    ref: { b: 1, c: 1, v: 1 },
    scroll: 'esther'
  }
]

const searchResults = (query) => {
  const results = fuzzy(searchables, query, parsha => [parsha.he, parsha.en])

  return results.length ? results : [{
    item: 'No results',
    match: { index: 0, indexes: [] }
  }]
}

const top = (n) => (_, i) => i < n

const search = query => searchResults(query)
  .filter(top(5))
  .map(result => result.item === 'No results'
    ? NoResults()
    : ParshaResult(result)
  )

export { search }

export default ParshaPicker
