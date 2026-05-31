import { LeiningGenerator } from '../../../calendar-model/generator.ts'
import { HDate } from '@hebcal/hdate'
import { LeiningDate, LeiningInstance, LeiningRun, LeiningInstanceId } from '../../../calendar-model/model-types.ts'
import { getReadingShortcuts, formatEnglishDate, cleanReadingTitle, formatHebrewDateString } from '../utils.ts'
import fuzzy from '../../../fuzzy.ts'

export default (generator: LeiningGenerator) => {
  const styleNode = document.createElement('style')
  styleNode.textContent = `
    .hud-container {
      direction: rtl;
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 650px;
      margin: 0 auto;
      padding: 20px 15px;
      color: var(--text-color, #333);
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .hud-palette {
      background: var(--paper-color, #fff);
      border: 1px solid var(--heavy-accent-color, #999);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15);
      overflow: hidden;
    }
    .hud-search-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      border-bottom: 1px solid var(--medium-accent-color, #ddd);
      padding: 12px 18px;
      background: var(--light-accent-color, #fafafa);
    }
    .hud-search-icon {
      font-size: 18px;
      margin-left: 12px;
      color: var(--light-text-color, #777);
    }
    .hud-search-input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-size: 18px;
      color: var(--text-color, #222);
      font-family: inherit;
    }
    .hud-search-input::placeholder {
      color: var(--light-text-color, #999);
    }
    .hud-kbd-hint {
      font-size: 11px;
      color: var(--light-text-color, #888);
      border: 1px solid var(--medium-accent-color, #ccc);
      padding: 2px 5px;
      border-radius: 4px;
      background: var(--paper-color, #fff);
      direction: ltr;
      user-select: none;
    }

    /* Quick jumps */
    .hud-quickjumps {
      padding: 15px 18px;
      background: var(--light-accent-color, #f9f9f9);
      border-bottom: 1px solid var(--medium-accent-color, #eee);
    }
    .hud-quickjumps-label {
      font-size: 12px;
      font-weight: bold;
      color: var(--light-text-color, #777);
      margin-bottom: 8px;
      display: block;
    }
    .hud-quickjumps-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
    .hud-quick-card {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 10px 12px;
      border: 1px solid var(--medium-accent-color, #ddd);
      border-radius: 8px;
      background: var(--paper-color, #fff);
      text-decoration: none;
      color: inherit;
      cursor: pointer;
      transition: all 0.2s;
    }
    .hud-quick-card:hover {
      border-color: #0b57d0;
      background: rgba(11, 87, 208, 0.02);
    }
    .hud-quick-title {
      font-size: 14px;
      font-weight: bold;
      color: var(--text-color, #111);
    }
    .hud-quick-desc {
      font-size: 11px;
      color: var(--light-text-color, #666);
    }
    
    /* Results */
    .hud-results {
      max-height: 380px;
      overflow-y: auto;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .hud-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 18px;
      border-bottom: 1px solid var(--light-accent-color, #eee);
      cursor: pointer;
      transition: all 0.15s;
    }
    .hud-row:last-child {
      border-bottom: none;
    }
    .hud-row.is-highlighted {
      background: rgba(11, 87, 208, 0.08);
    }
    .hud-row-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .hud-badge {
      font-size: 11px;
      font-weight: bold;
      padding: 3px 8px;
      border-radius: 5px;
    }
    .hud-badge.mod-torah {
      background: #e6f4ea;
      color: #137333;
    }
    .hud-badge.mod-holiday {
      background: #fef7e0;
      color: #b06000;
    }
    .hud-badge.mod-megillah {
      background: #fce8e6;
      color: #c5221f;
    }
    .hud-row-info {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .hud-row-title {
      font-size: 16px;
      font-weight: bold;
      color: var(--text-color, #111);
    }
    .hud-row-meta {
      font-size: 12px;
      color: var(--light-text-color, #666);
      display: flex;
      gap: 8px;
    }
    .hud-row-shortcuts {
      display: flex;
      gap: 6px;
    }
    .hud-shortcut-btn {
      text-decoration: none;
      padding: 4px 8px;
      font-size: 12px;
      border-radius: 4px;
      background: transparent;
      color: #0b57d0;
      border: 1px solid #0b57d0;
      font-weight: bold;
      transition: all 0.2s;
    }
    .hud-shortcut-btn:hover {
      background: #0b57d0;
      color: #fff;
    }
    
    .hud-no-results {
      padding: 30px;
      text-align: center;
      color: var(--light-text-color, #666);
      font-size: 15px;
    }
  `
  document.head.appendChild(styleNode)

  const container = document.createElement('div')
  container.className = 'parsha-picker hud-container'

  const palette = document.createElement('div')
  palette.className = 'hud-palette'

  // Search Box
  const searchWrapper = document.createElement('div')
  searchWrapper.className = 'hud-search-wrapper'
  searchWrapper.innerHTML = `
    <span class="hud-search-icon">🔍</span>
    <input type="text" class="hud-search-input" placeholder="חפש פרשה, חג, או תאריך (עברי או לועזי)..." autocomplete="off" autofocus>
    <span class="hud-kbd-hint">↑↓ Enter</span>
  `
  const searchInput = searchWrapper.querySelector('.hud-search-input') as HTMLInputElement

  // Quick jumps area
  const quickJumps = document.createElement('div')
  quickJumps.className = 'hud-quickjumps'
  
  // Results Container
  const resultsList = document.createElement('ul')
  resultsList.className = 'hud-results'

  palette.appendChild(searchWrapper)
  palette.appendChild(quickJumps)
  palette.appendChild(resultsList)
  container.appendChild(palette)

  // Load all leinings for current + next year
  const currentYear = new HDate().getFullYear()
  const leiningDates = [
    ...generator.forHebrewYear(currentYear),
    ...generator.forHebrewYear(currentYear + 1)
  ]

  interface FlattenedReading {
    date: LeiningDate
    inst: LeiningInstance
    titleHe: string
    titleEn: string
    englishDateStr: string
    hebrewDateStr: string
    type: 'torah' | 'holiday' | 'megillah'
  }

  const allReadings: FlattenedReading[] = []
  leiningDates.forEach((ld) => {
    ld.leinings.forEach((inst) => {
      const hDate = new HDate(ld.date)
      let type: 'torah' | 'holiday' | 'megillah' = 'holiday'
      if (inst.isParsha) type = 'torah'
      else if (inst.id === LeiningInstanceId.Megillah) type = 'megillah'

      allReadings.push({
        date: ld,
        inst,
        titleHe: cleanReadingTitle(inst),
        titleEn: inst.date.title.en,
        englishDateStr: formatEnglishDate(ld.date),
        hebrewDateStr: formatHebrewDateString(ld.date),
        type
      })
    })
  })

  // Generate Quick Jumps
  const setupQuickJumps = () => {
    const today = new Date()
    
    // Find this Shabbat
    const thisShabbatItem = allReadings.find((r) => r.date.date >= today && r.type === 'torah')
    // Find next Shabbat
    let nextShabbatItem: FlattenedReading | undefined
    if (thisShabbatItem) {
      nextShabbatItem = allReadings.find((r) => r.date.date > thisShabbatItem.date.date && r.type === 'torah')
    }
    // Find upcoming holiday
    const upcomingHolidayItem = allReadings.find((r) => r.date.date >= today && r.type === 'holiday')

    quickJumps.innerHTML = '<span class="hud-quickjumps-label">קיצורי דרך מהירים</span>'
    const grid = document.createElement('div')
    grid.className = 'hud-quickjumps-grid'

    const appendQuickCard = (title: string, reading: FlattenedReading | undefined, desc: string) => {
      if (!reading) return
      const card = document.createElement('a')
      card.className = 'hud-quick-card'
      card.href = `#/run/${reading.inst.runs[0].id}`
      card.innerHTML = `
        <span class="hud-quick-title">${title}</span>
        <span class="hud-quick-desc" style="font-weight: bold; color: #0b57d0;">${reading.titleHe}</span>
        <span class="hud-quick-desc">${reading.hebrewDateStr}</span>
      `
      grid.appendChild(card)
    }

    appendQuickCard('השבת הקרובה', thisShabbatItem, 'שבת הקרובה')
    appendQuickCard('השבת הבאה', nextShabbatItem, 'שבת הבאה')
    appendQuickCard('החג הקרוב', upcomingHolidayItem, 'החג הקרוב')

    quickJumps.appendChild(grid)
  }

  setupQuickJumps()

  // Active highlighting index
  let highlightedIndex = -1

  const getVisibleRows = (): HTMLElement[] => {
    return Array.from(resultsList.querySelectorAll('.hud-row')) as HTMLElement[]
  }

  const updateHighlight = (direction: 'up' | 'down') => {
    const rows = getVisibleRows()
    if (!rows.length) return

    if (direction === 'down') {
      highlightedIndex = (highlightedIndex + 1) % rows.length
    } else {
      highlightedIndex = (highlightedIndex - 1 + rows.length) % rows.length
    }

    rows.forEach((row, idx) => {
      const active = idx === highlightedIndex
      row.classList.toggle('is-highlighted', active)
      if (active) {
        row.scrollIntoView({ block: 'nearest' })
      }
    })
  }

  const triggerSelection = () => {
    const rows = getVisibleRows()
    if (highlightedIndex >= 0 && highlightedIndex < rows.length) {
      const mainLink = rows[highlightedIndex].querySelector('a')
      if (mainLink) {
        mainLink.click()
      }
    }
  }

  // Key Listeners on search field
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      updateHighlight('down')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      updateHighlight('up')
    } else if (e.key === 'Enter') {
      e.preventDefault()
      triggerSelection()
    }
  })

  const getBadgeClassAndText = (type: 'torah' | 'holiday' | 'megillah') => {
    switch(type) {
      case 'torah': return { className: 'mod-torah', text: 'תורה' }
      case 'holiday': return { className: 'mod-holiday', text: 'חג' }
      case 'megillah': return { className: 'mod-megillah', text: 'מגילה' }
    }
  }

  // Search function
  const performSearch = (query: string) => {
    resultsList.innerHTML = ''
    highlightedIndex = -1

    if (!query.trim()) {
      quickJumps.style.display = 'block'
      return // Keep list empty if no query, showing just quick cards
    }

    quickJumps.style.display = 'none'

    // Use fuzzy search helper
    const matches = fuzzy(allReadings, query, (r) => [
      r.titleHe,
      r.titleEn,
      r.hebrewDateStr,
      r.englishDateStr
    ])

    if (!matches.length) {
      resultsList.innerHTML = `<div class="hud-no-results">לא נמצאו תוצאות עבור "${query}"</div>`
      return
    }

    // Render matching items (cap at 8 for sleek HUD layout)
    const topMatches = matches.slice(0, 8)
    topMatches.forEach((match) => {
      const reading = match.item
      const row = document.createElement('li')
      row.className = 'hud-row'

      // Click on row triggers main jump
      row.addEventListener('click', (e) => {
        const target = e.target as HTMLElement
        if (target.tagName === 'A') return // Let button clicks handle themselves
        const firstRun = reading.inst.runs[0]
        location.hash = `#/run/${firstRun.id}`
      })

      const left = document.createElement('div')
      left.className = 'hud-row-left'

      const badgeInfo = getBadgeClassAndText(reading.type)
      const badge = document.createElement('span')
      badge.className = `hud-badge ${badgeInfo.className}`
      badge.textContent = badgeInfo.text

      const info = document.createElement('div')
      info.className = 'hud-row-info'

      const title = document.createElement('span')
      title.className = 'hud-row-title'
      title.textContent = reading.titleHe

      const meta = document.createElement('span')
      meta.className = 'hud-row-meta'
      meta.innerHTML = `
        <span>${reading.hebrewDateStr}</span>
        <span>|</span>
        <span>${reading.englishDateStr}</span>
      `

      info.appendChild(title)
      info.appendChild(meta)
      left.appendChild(badge)
      left.appendChild(info)

      // Shortcuts
      const shortcutsContainer = document.createElement('div')
      shortcutsContainer.className = 'hud-row-shortcuts'

      const shortcuts = getReadingShortcuts(reading.inst)
      shortcuts.forEach((sc) => {
        const btn = document.createElement('a')
        btn.href = sc.url
        btn.className = 'hud-shortcut-btn'
        btn.textContent = sc.label
        shortcutsContainer.appendChild(btn)
      })

      row.appendChild(left)
      row.appendChild(shortcutsContainer)
      resultsList.appendChild(row)
    })
  }

  searchInput.addEventListener('input', () => {
    performSearch(searchInput.value)
  })

  return {
    node: container,
    onMount: () => {
      console.log('HUD Mounted')
      setTimeout(() => searchInput.focus(), 50)
    },
    onDestroy: () => {
      styleNode.remove()
    }
  }
}
