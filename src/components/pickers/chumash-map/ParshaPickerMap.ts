import { LeiningGenerator } from '../../../calendar-model/generator.ts'
import { HDate } from '@hebcal/hdate'
import { LeiningDate, LeiningInstance, LeiningRun, LeiningRunType } from '../../../calendar-model/model-types.ts'
import { getReadingShortcuts, formatEnglishDate, cleanReadingTitle, formatHebrewDateString } from '../utils.ts'
import { Locale } from '@hebcal/hdate'

export default (generator: LeiningGenerator) => {
  const styleNode = document.createElement('style')
  styleNode.textContent = `
    .map-outer-container {
      direction: rtl;
      font-family: system-ui, -apple-system, sans-serif;
      padding: 15px;
      background: var(--paper-color, #fcfcfc);
      height: calc(100vh - var(--header-height) - 60px);
      overflow-y: auto;
    }
    .map-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--paper-color, #fff);
      border: 1px solid var(--medium-accent-color, #eee);
      padding: 10px 15px;
      border-radius: 8px;
      margin-bottom: 15px;
      direction: ltr;
    }
    .map-controls-btn {
      padding: 6px 12px;
      border: 1px solid var(--heavy-accent-color, #999);
      border-radius: 5px;
      background: transparent;
      color: var(--text-color, #333);
      cursor: pointer;
      font-weight: bold;
    }
    .map-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 12px;
      align-items: start;
    }
    @media (max-width: 768px) {
      .map-grid {
        grid-template-columns: 1fr;
        gap: 15px;
      }
    }
    .map-column {
      border: 1px solid var(--medium-accent-color, #ddd);
      border-radius: 10px;
      background: var(--paper-color, #fff);
      box-shadow: 0 2px 8px rgba(0,0,0,0.03);
      overflow: hidden;
    }
    .map-column-header {
      background: #0b57d0;
      color: #fff;
      padding: 10px;
      text-align: center;
      font-weight: bold;
      font-size: 16px;
    }
    .map-tiles {
      display: flex;
      flex-direction: column;
      padding: 10px;
      gap: 8px;
    }
    .map-tile {
      border: 1px solid var(--medium-accent-color, #eee);
      border-radius: 6px;
      padding: 8px 10px;
      background: var(--paper-color, #fafafa);
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .map-tile:hover {
      border-color: #0b57d0;
      background: rgba(11, 87, 208, 0.02);
    }
    .map-tile-name {
      font-weight: bold;
      font-size: 14px;
      color: var(--text-color, #222);
    }
    .map-tile-date {
      font-size: 11px;
      color: var(--light-text-color, #777);
    }
    
    /* Details Popover / Modal */
    .map-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.4);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 20000;
      padding: 15px;
    }
    .map-overlay.is-visible {
      display: flex;
    }
    .map-popover {
      background: var(--paper-color, #fff);
      border-radius: 12px;
      width: 100%;
      max-width: 480px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      animation: map-popover-in 0.2s ease-out;
    }
    @keyframes map-popover-in {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .map-popover-header {
      background: #f5f5f5;
      border-bottom: 1px solid var(--medium-accent-color, #eee);
      padding: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .map-popover-title {
      font-size: 18px;
      font-weight: bold;
      color: var(--text-color, #111);
    }
    .map-popover-close {
      background: transparent;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: var(--light-text-color, #999);
    }
    .map-popover-body {
      padding: 15px;
      overflow-y: auto;
      max-height: 350px;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    
    /* Aliyot list */
    .map-aliyot-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
      border: 1px solid var(--medium-accent-color, #eee);
      border-radius: 6px;
      padding: 8px;
      background: var(--light-accent-color, #fafafa);
    }
    .map-aliyah-row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      padding: 4px 6px;
      border-bottom: 1px solid var(--light-accent-color, #eee);
    }
    .map-aliyah-row:last-child {
      border-bottom: none;
    }
    .map-aliyah-label {
      font-weight: bold;
      color: #0b57d0;
    }
    .map-aliyah-range {
      direction: ltr;
      color: var(--light-text-color, #555);
    }
    
    .map-popover-footer {
      padding: 12px 15px;
      border-top: 1px solid var(--medium-accent-color, #eee);
      background: #fafafa;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
  `
  document.head.appendChild(styleNode)

  const outerContainer = document.createElement('div')
  outerContainer.className = 'parsha-picker map-outer-container'

  // Popover Overlay
  const overlay = document.createElement('div')
  overlay.className = 'map-overlay'
  overlay.innerHTML = `
    <div class="map-popover">
      <div class="map-popover-header">
        <span class="map-popover-title">פרשת בראשית</span>
        <button class="map-popover-close">×</button>
      </div>
      <div class="map-popover-body">
        <div class="map-popover-meta"></div>
        <div class="map-aliyot-list"></div>
      </div>
      <div class="map-popover-footer"></div>
    </div>
  `
  const popoverClose = overlay.querySelector('.map-popover-close')!
  popoverClose.addEventListener('click', () => overlay.classList.remove('is-visible'))
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('is-visible')
  })
  document.body.appendChild(overlay)

  let currentHebrewYear = new HDate().getFullYear()

  const showDetails = (ld: LeiningDate, inst: LeiningInstance) => {
    const popoverTitle = overlay.querySelector('.map-popover-title')!
    popoverTitle.textContent = cleanReadingTitle(inst)

    const popoverMeta = overlay.querySelector('.map-popover-meta')!
    const hDate = new HDate(ld.date)
    popoverMeta.innerHTML = `
      <div style="font-size: 14px; color: var(--light-text-color, #666); margin-bottom: 10px;">
        <strong>תאריך עברי:</strong> ${formatHebrewDateString(ld.date)} ${currentHebrewYear}<br>
        <strong>תאריך לועזי:</strong> ${formatEnglishDate(ld.date)}
      </div>
    `

    // Populating Aliyot
    const aliyotList = overlay.querySelector('.map-aliyot-list')!
    aliyotList.innerHTML = ''
    
    const mainRun = inst.runs.find(r => r.type === LeiningRunType.Main)
    if (mainRun) {
      mainRun.aliyot.forEach((al) => {
        const row = document.createElement('div')
        row.className = 'map-aliyah-row'
        
        const label = document.createElement('span')
        label.className = 'map-aliyah-label'
        const aliyahLabels = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שביעי']
        const idx = Number(al.index)
        label.textContent = isNaN(idx) ? `עליה ${al.index ?? ''}` : aliyahLabels[idx - 1] || `עליה ${al.index ?? ''}`

        const range = document.createElement('span')
        range.className = 'map-aliyah-range'
        // Format: Ch:Vs - Ch:Vs
        range.textContent = `${al.start.c}:${al.start.v} - ${al.end.c}:${al.end.v}`

        row.appendChild(label)
        row.appendChild(range)
        aliyotList.appendChild(row)
      })
    }

    // Populating footer buttons
    const footer = overlay.querySelector('.map-popover-footer')!
    footer.innerHTML = ''

    const shortcuts = getReadingShortcuts(inst)
    shortcuts.forEach((sc) => {
      const btn = document.createElement('a')
      btn.href = sc.url
      btn.className = 'timeline-action-btn' // reuse V2 styles or inline
      btn.style.cssText = `
        text-decoration: none;
        padding: 6px 12px;
        font-size: 13px;
        border-radius: 5px;
        background: ${sc.type === LeiningRunType.Main ? '#0b57d0' : 'transparent'};
        color: ${sc.type === LeiningRunType.Main ? '#fff' : '#0b57d0'};
        border: 1px solid #0b57d0;
        font-weight: bold;
        text-align: center;
      `
      btn.textContent = sc.label
      btn.addEventListener('click', () => overlay.classList.remove('is-visible'))
      footer.appendChild(btn)
    })

    overlay.classList.add('is-visible')
  }

  const render = () => {
    outerContainer.innerHTML = ''

    // Header control bar
    const controlsBar = document.createElement('div')
    controlsBar.className = 'map-controls'

    const prevBtn = document.createElement('button')
    prevBtn.className = 'map-controls-btn'
    prevBtn.textContent = `« ${currentHebrewYear - 1}`
    prevBtn.addEventListener('click', () => {
      currentHebrewYear--
      render()
    })

    const yearTitle = document.createElement('span')
    yearTitle.textContent = `Chumash Map — Year ${currentHebrewYear}`
    yearTitle.style.fontWeight = 'bold'

    const nextBtn = document.createElement('button')
    nextBtn.className = 'map-controls-btn'
    nextBtn.textContent = `${currentHebrewYear + 1} »`
    nextBtn.addEventListener('click', () => {
      currentHebrewYear++
      render()
    })

    controlsBar.appendChild(prevBtn)
    controlsBar.appendChild(yearTitle)
    controlsBar.appendChild(nextBtn)
    outerContainer.appendChild(controlsBar)

    // Books grid
    const grid = document.createElement('div')
    grid.className = 'map-grid'

    const books: Record<number, { name: string; leinings: { date: LeiningDate; inst: LeiningInstance }[] }> = {
      1: { name: 'ספר בראשית', leinings: [] },
      2: { name: 'ספר שמות', leinings: [] },
      3: { name: 'ספר ויקרא', leinings: [] },
      4: { name: 'ספר במדבר', leinings: [] },
      5: { name: 'ספר דברים', leinings: [] }
    }

    const yearDates = generator.forHebrewYear(currentHebrewYear)
    yearDates.forEach((ld) => {
      ld.leinings.forEach((inst) => {
        if (inst.isParsha) {
          const bookNum = inst.runs[0].aliyot[0].start.b
          if (books[bookNum]) {
            books[bookNum].leinings.push({ date: ld, inst })
          }
        }
      })
    })

    // Render columns
    for (let i = 1; i <= 5; i++) {
      const column = document.createElement('div')
      column.className = 'map-column'

      const header = document.createElement('div')
      header.className = 'map-column-header'
      header.textContent = books[i].name
      column.appendChild(header)

      const tiles = document.createElement('div')
      tiles.className = 'map-tiles'

      books[i].leinings.forEach(({ date, inst }) => {
        const tile = document.createElement('div')
        tile.className = 'map-tile'
        
        const name = document.createElement('span')
        name.className = 'map-tile-name'
        name.textContent = cleanReadingTitle(inst)

        const tileDate = document.createElement('span')
        tileDate.className = 'map-tile-date'
        tileDate.textContent = formatHebrewDateString(date.date)

        tile.appendChild(name)
        tile.appendChild(tileDate)

        tile.addEventListener('click', () => showDetails(date, inst))
        tiles.appendChild(tile)
      })

      column.appendChild(tiles)
      grid.appendChild(column)
    }

    outerContainer.appendChild(grid)
  }

  render()

  return {
    node: outerContainer,
    onMount: () => {
      console.log('Chumash Map Mounted')
    },
    onDestroy: () => {
      styleNode.remove()
      overlay.remove()
    }
  }
}
