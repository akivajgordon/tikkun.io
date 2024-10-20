import '/css/master.css'
import InfiniteScroller from './infinite-scroller.ts'
import urlToRef from './url-to-ref.ts'
import ParshaPicker from './components/ParshaPicker.ts'
import utils from './components/utils.ts'
import scheduleFetcher from './schedule.ts'
import { ScrollViewModel } from './view-model/scroll-view-model.ts'
import { LeiningGenerator } from './calendar-model/generator.ts'
import { ScrollDisplay } from './components/ScrollDisplay.ts'

declare function gtag(
  name: 'event',
  label: string,
  payload: Record<string, unknown>
): void

const { whenKey } = utils

// TODO(later): Add settings UI
const generator = new LeiningGenerator({
  ashkenazi: true,
  includeModernHolidays: false,
  israel: false,
})
let display: ScrollDisplay

const app = {
  jumpTo: (target: ScrollViewModel) => {
    display = new ScrollDisplay(
      target,
      document.querySelector('[data-target-id="tikkun-book"]')
    )

    display.rendered.then(() => {
      hideParshaPicker()
    })
  },
}

const setVisibility = ({
  selector,
  visible,
}: {
  selector: string
  visible: boolean
}) => {
  const classList = document.querySelector(selector).classList

  classList[visible ? 'remove' : 'add']('u-hidden')
  classList[visible ? 'remove' : 'add']('mod-animated')
}

const showParshaPicker = () => {
  ;[
    { selector: '[data-test-id="annotations-toggle"]', visible: false },
    { selector: '[data-target-id="repo-link"]', visible: false },
    { selector: '[data-target-id="tikkun-book"]', visible: false },
  ].forEach(({ selector, visible }) => setVisibility({ selector, visible }))

  const jumper = ParshaPicker(({ ref, key, source }) => {
    app.jumpTo(ScrollViewModel.forRef(generator, ref))

    const { scroll } = ref

    const hashBySource = {
      comingUp: (key: string) => (key === 'next' ? `#/next` : `#/p/${key}`),
      browse: (key: string) => `#/${scroll === 'torah' ? 'p' : 'h'}/${key}`,
      search: (key: string) => `#/${scroll === 'torah' ? 'p' : 'h'}/${key}`,
    }[source](key)

    window.location.hash = hashBySource
  })

  document.querySelector('#js-app').appendChild(jumper.node)

  gtag('event', 'view', {
    event_category: 'navigation',
  })

  jumper.onMount()
}

const hideParshaPicker = () => {
  ;[
    { selector: '[data-test-id="annotations-toggle"]', visible: true },
    { selector: '[data-target-id="repo-link"]', visible: true },
    { selector: '[data-target-id="tikkun-book"]', visible: true },
  ].forEach(({ selector, visible }) => setVisibility({ selector, visible }))

  if (document.querySelector('.parsha-picker'))
    document
      .querySelector('#js-app')
      .removeChild(document.querySelector('.parsha-picker'))
}

const isShowingParshaPicker = () =>
  Boolean(document.querySelector('.parsha-picker'))

const toggleParshaPicker = () => {
  if (isShowingParshaPicker()) {
    hideParshaPicker()
  } else {
    showParshaPicker()
  }
}

const toggleAnnotations = (getPreviousCheckedState: () => boolean) => {
  const toggle = document.querySelector<HTMLInputElement>(
    '[data-target-id="annotations-toggle"]'
  )

  toggle.checked = !getPreviousCheckedState()

  const book = document.querySelector('[data-target-id=tikkun-book]')

  book.classList.toggle('mod-annotations-on', toggle.checked)
  book.classList.toggle('mod-annotations-off', !toggle.checked)
}

const scrollState: { lastScrolledPosition: number; pageAtTop: HTMLElement } = {
  lastScrolledPosition: 0,
  pageAtTop: null,
}

const resumeLastScrollPosition = () => {
  if (!scrollState.pageAtTop) return
  const book = document.querySelector('.tikkun-book')
  const pageRect = scrollState.pageAtTop.getBoundingClientRect()

  book.scrollTop =
    scrollState.pageAtTop.offsetTop +
    scrollState.lastScrolledPosition * pageRect.height
}

const rememberLastScrolledPosition = () => {
  const book = document.querySelector('.tikkun-book')
  const bookBoundingRect = book.getBoundingClientRect()

  const topOfBookRelativeToViewport = {
    x: bookBoundingRect.left + bookBoundingRect.width / 2,
    y: bookBoundingRect.top,
  }

  const pageAtTop = [
    ...(document.elementsFromPoint(
      topOfBookRelativeToViewport.x,
      topOfBookRelativeToViewport.y
    ) as HTMLElement[]),
  ].find((el) => el.className.includes('tikkun-page'))

  if (!pageAtTop) return

  scrollState.pageAtTop = pageAtTop
  scrollState.lastScrolledPosition =
    (book.scrollTop - pageAtTop.offsetTop) / pageAtTop.clientHeight
}

const debounce = (callback: () => void, delay: number) => {
  let timeout: ReturnType<typeof setTimeout>
  return () => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      callback()
    }, delay)
  }
}

const listenForRevealGesture = (book: HTMLElement) => {
  const PULL_THRESHOLD = 30 // px
  const PULL_MAXIMUM = 100

  const endTouch = () => {
    book.classList.add('mod-pull-releasing')

    book.style.setProperty('--pull-translation', `0`)
  }

  let startX = 0

  book.addEventListener('touchstart', (e) => {
    book.classList.remove('mod-pull-releasing')

    startX = e.changedTouches[0].screenX
  })

  book.addEventListener('touchmove', (e) => {
    const touchX = e.changedTouches[0].screenX
    const pullDistance = -Math.max(touchX - startX, -PULL_MAXIMUM)

    if (pullDistance < PULL_THRESHOLD) return

    book.style.setProperty(
      '--pull-translation',
      `${PULL_THRESHOLD - pullDistance}px`
    )
  })

  book.addEventListener('touchend', endTouch)

  book.addEventListener('touchcancel', endTouch)
}

const setAppHeight = () => {
  // This prevents double-scroll bars from the inner "book" scrolling
  // when on browsers that have browser "chrome" (like the tab bar),
  // especially on mobile browsers
  document.documentElement.style.setProperty(
    '--app-height',
    `${window.innerHeight}px`
  )
}

document.addEventListener('resize', setAppHeight)

document.addEventListener('DOMContentLoaded', async () => {
  const book = document.querySelector<HTMLElement>(
    '[data-target-id="tikkun-book"]'
  )

  const toggle = document.querySelector<HTMLInputElement>(
    '[data-target-id="annotations-toggle"]'
  )

  book.addEventListener('mouseover', (e) => {
    const line = document
      .elementsFromPoint(e.x, e.y)
      .find((e) => e.className.includes('line'))
    console.log(line)
  })

  InfiniteScroller.new({
    container: book,
    fetchPreviousContent: {
      fetch: () => display.viewModel.fetchPreviousPage(),
      render: (entry) => display.renderPrevious(entry),
    },
    fetchNextContent: {
      fetch: () => display.viewModel.fetchNextPage(),
      render: (entry) => display.renderNext(entry),
    },
  }).attach()

  book.addEventListener(
    'scroll',
    debounce(() => {
      rememberLastScrolledPosition()
    }, 1000)
  )

  listenForRevealGesture(book)

  window.addEventListener('resize', () => {
    resumeLastScrollPosition()
  })

  // watchForHighlighting()

  toggle.addEventListener('change', () =>
    toggleAnnotations(() => !toggle.checked)
  )

  document.addEventListener(
    'keydown',
    whenKey('Shift', () => toggleAnnotations(() => toggle.checked))
  )
  document.addEventListener(
    'keyup',
    whenKey('Shift', () => toggleAnnotations(() => toggle.checked))
  )

  document
    .querySelector('[data-target-id="parsha-title"]')
    .addEventListener('click', toggleParshaPicker)
  document.addEventListener('keydown', whenKey('/', toggleParshaPicker))

  document.addEventListener(
    'keydown',
    whenKey('Escape', (e) => {
      if (isShowingParshaPicker()) {
        e.preventDefault()
        hideParshaPicker()
      }
    })
  )

  // TODO: Rewrite this logic to parse new and old URLs.
  await urlToRef({
    url: window.location.href,
    scheduleFetcher,
  })

  setAppHeight()

  app.jumpTo(ScrollViewModel.forDate(generator, new Date()))
})
