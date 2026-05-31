import { LeiningGenerator } from '../../../calendar-model/generator.ts'
import { HDate } from '@hebcal/hdate'
import { LeiningDate, LeiningInstance, LeiningRunType } from '../../../calendar-model/model-types.ts'
import { getReadingShortcuts, formatEnglishDate, cleanReadingTitle, formatHebrewDateString } from '../utils.ts'

export default (generator: LeiningGenerator) => {
  const styleNode = document.createElement('style')
  styleNode.textContent = `
    .kanban-picker-container {
      direction: rtl;
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      border: 1px solid var(--medium-accent-color, #ddd);
      border-radius: 12px;
      overflow: hidden;
      background: var(--paper-color, #fff);
      box-shadow: 0 4px 16px rgba(0,0,0,0.05);
      height: calc(100vh - var(--header-height) - 120px);
      position: relative;
    }
    
    .kanban-board {
      display: flex;
      flex: 1;
      overflow-x: auto;
      overflow-y: hidden;
      padding: 20px;
      gap: 15px;
      background: var(--light-accent-color, #f4f5f7);
      scroll-behavior: smooth;
    }
    
    .kanban-column {
      width: 260px;
      min-width: 260px;
      background: var(--paper-color, #fff);
      border-radius: 8px;
      border: 1px solid var(--medium-accent-color, #e1e4e8);
      display: flex;
      flex-direction: column;
      max-height: 100%;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    
    .kanban-column-header {
      padding: 12px 16px;
      font-weight: bold;
      font-size: 15px;
      border-bottom: 2px solid var(--light-accent-color, #e1e4e8);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--paper-color, #fafbfc);
      border-radius: 8px 8px 0 0;
      color: var(--text-color, #172b4d);
    }
    
    .kanban-column-badge {
      background: #ebecf0;
      color: #42526e;
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 10px;
      font-weight: normal;
    }
    
    .kanban-cards-list {
      padding: 10px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
    }
    
    .kanban-card {
      background: var(--paper-color, #fff);
      border: 1px solid var(--medium-accent-color, #e1e4e8);
      border-radius: 6px;
      padding: 12px;
      cursor: pointer;
      transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
      user-select: none;
      display: flex;
      flex-direction: column;
      gap: 6px;
      position: relative;
    }
    
    .kanban-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.08);
      border-color: #0b57d0;
    }
    
    .kanban-card.is-selected {
      border: 2px solid #0b57d0;
      background: rgba(11, 87, 208, 0.02);
    }
    
    .kanban-card-title {
      font-weight: bold;
      font-size: 14px;
      color: var(--text-color, #172b4d);
    }
    
    .kanban-card-date {
      font-size: 11px;
      color: var(--light-text-color, #5e6c84);
    }
    
    .kanban-card-tag {
      align-self: flex-start;
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: bold;
      background: #deebff;
      color: #0747a6;
    }
    .kanban-card-tag.mod-holiday {
      background: #fffae6;
      color: #b78103;
    }
    
    /* Bottom Details Drawer */
    .kanban-drawer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--paper-color, #fff);
      border-top: 1px solid var(--medium-accent-color, #ccc);
      box-shadow: 0 -4px 16px rgba(0,0,0,0.1);
      transform: translateY(100%);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      max-height: 200px;
      direction: rtl;
    }
    
    .kanban-drawer.is-open {
      transform: translateY(0);
    }
    
    .kanban-drawer-header {
      padding: 12px 20px;
      border-bottom: 1px solid var(--light-accent-color, #eee);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--light-accent-color, #fafafa);
    }
    
    .kanban-drawer-title {
      font-weight: bold;
      font-size: 16px;
      color: var(--text-color, #333);
    }
    
    .kanban-drawer-close {
      cursor: pointer;
      font-size: 18px;
      color: var(--light-text-color, #888);
      border: none;
      background: transparent;
    }
    
    .kanban-drawer-body {
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex: 1;
      overflow-y: auto;
    }
    
    .kanban-drawer-meta {
      font-size: 13px;
      color: var(--light-text-color, #555);
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .kanban-drawer-actions {
      display: flex;
      gap: 10px;
    }
    
    .kanban-action-btn {
      text-decoration: none;
      padding: 8px 16px;
      font-size: 13px;
      border-radius: 6px;
      background: #0b57d0;
      color: #fff;
      font-weight: bold;
      text-align: center;
      white-space: nowrap;
    }
    .kanban-action-btn:hover {
      background: #0842a0;
    }
    .kanban-action-btn.mod-secondary {
      background: transparent;
      color: #0b57d0;
      border: 1px solid #0b57d0;
    }
    .kanban-action-btn.mod-secondary:hover {
      background: rgba(11, 87, 208, 0.05);
    }
    
    .kanban-year-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--paper-color, #fff);
      border: 1px solid var(--medium-accent-color, #eee);
      padding: 8px 15px;
      border-radius: 8px;
      margin-bottom: 12px;
      direction: ltr;
    }
    .kanban-year-btn {
      padding: 5px 10px;
      border: 1px solid var(--heavy-accent-color, #999);
      border-radius: 4px;
      background: transparent;
      color: var(--text-color, #333);
      cursor: pointer;
      font-weight: bold;
    }
  `
  document.head.appendChild(styleNode)

  const outerContainer = document.createElement('div')
  outerContainer.className = 'parsha-picker'
  outerContainer.style.display = 'flex'
  outerContainer.style.flexDirection = 'column'

  let currentHebrewYear = new HDate().getFullYear()
  let selectedKey: string | null = null

  const monthNamesHeb: Record<number, string> = {
    7: 'תשרי', 8: 'חשון', 9: 'כסלו', 10: 'טבת', 11: 'שבט', 12: 'אדר', 13: 'אדר ב׳',
    1: 'ניסן', 2: 'אייר', 3: 'סיון', 4: 'תמוז', 5: 'אב', 6: 'אלול'
  }

  const monthOrder = [7, 8, 9, 10, 11, 12, 13, 1, 2, 3, 4, 5, 6] // Chronological from Tishrei

  const render = () => {
    outerContainer.innerHTML = ''

    // Year Control Bar
    const yearBar = document.createElement('div')
    yearBar.className = 'kanban-year-controls'

    const prevBtn = document.createElement('button')
    prevBtn.className = 'kanban-year-btn'
    prevBtn.textContent = `« ${currentHebrewYear - 1}`
    prevBtn.addEventListener('click', () => {
      currentHebrewYear--
      selectedKey = null
      render()
    })

    const yearTitle = document.createElement('span')
    yearTitle.textContent = `Kanban Month Board — Year ${currentHebrewYear}`
    yearTitle.style.fontWeight = 'bold'

    const nextBtn = document.createElement('button')
    nextBtn.className = 'kanban-year-btn'
    nextBtn.textContent = `${currentHebrewYear + 1} »`
    nextBtn.addEventListener('click', () => {
      currentHebrewYear++
      selectedKey = null
      render()
    })

    yearBar.appendChild(prevBtn)
    yearBar.appendChild(yearTitle)
    yearBar.appendChild(nextBtn)
    outerContainer.appendChild(yearBar)

    // Master Container
    const container = document.createElement('div')
    container.className = 'kanban-picker-container'

    const board = document.createElement('div')
    board.className = 'kanban-board'

    const drawer = document.createElement('div')
    drawer.className = 'kanban-drawer'
    drawer.innerHTML = `
      <div class="kanban-drawer-header">
        <div class="kanban-drawer-title" id="drawer-title"></div>
        <button class="kanban-drawer-close" id="drawer-close">×</button>
      </div>
      <div class="kanban-drawer-body" id="drawer-body"></div>
    `

    container.appendChild(board)
    container.appendChild(drawer)
    outerContainer.appendChild(container)

    const closeBtn = drawer.querySelector('#drawer-close')!
    closeBtn.addEventListener('click', () => {
      drawer.classList.remove('is-open')
      board.querySelectorAll('.kanban-card').forEach(c => c.classList.remove('is-selected'))
      selectedKey = null
    })

    // Fetch calendar dates
    const yearDates = generator.forHebrewYear(currentHebrewYear)

    // Group readings by month
    const columnsData: Record<number, { date: LeiningDate; inst: LeiningInstance }[]> = {}
    monthOrder.forEach(m => {
      columnsData[m] = []
    })

    yearDates.forEach((ld) => {
      ld.leinings.forEach((inst) => {
        const hdate = new HDate(ld.date)
        const month = hdate.getMonth()
        if (columnsData[month]) {
          columnsData[month].push({ date: ld, inst })
        }
      })
    })

    // Render columns
    monthOrder.forEach((month) => {
      const items = columnsData[month]
      if (!items || (items.length === 0 && month === 13)) {
        // Skip Adar II if it doesn't exist in this year
        return
      }

      const col = document.createElement('div')
      col.className = 'kanban-column'

      const header = document.createElement('div')
      header.className = 'kanban-column-header'
      header.innerHTML = `
        <span>${monthNamesHeb[month]}</span>
        <span class="kanban-column-badge">${items.length} קריאות</span>
      `

      const list = document.createElement('div')
      list.className = 'kanban-cards-list'

      items.forEach(({ date, inst }) => {
        const card = document.createElement('div')
        const cardId = `${date.id}:${inst.id}`
        card.className = `kanban-card ${selectedKey === cardId ? 'is-selected' : ''}`
        
        const isHoliday = !inst.isParsha
        const tagText = isHoliday ? 'חג/מועד' : 'פרשה'
        const tagClass = isHoliday ? 'kanban-card-tag mod-holiday' : 'kanban-card-tag'

        card.innerHTML = `
          <div class="kanban-card-title">${cleanReadingTitle(inst)}</div>
          <div class="kanban-card-date">${formatHebrewDateString(date.date)}</div>
          <div class="${tagClass}">${tagText}</div>
        `

        card.addEventListener('click', () => {
          board.querySelectorAll('.kanban-card').forEach(c => c.classList.remove('is-selected'))
          card.classList.add('is-selected')
          selectedKey = cardId
          openDrawer(date, inst)
        })

        list.appendChild(card)
      })

      col.appendChild(header)
      col.appendChild(list)
      board.appendChild(col)
    })

    const openDrawer = (ld: LeiningDate, inst: LeiningInstance) => {
      const dTitle = drawer.querySelector('#drawer-title')!
      const dBody = drawer.querySelector('#drawer-body')!

      dTitle.textContent = cleanReadingTitle(inst)
      
      dBody.innerHTML = `
        <div class="kanban-drawer-meta">
          <span><strong>תאריך עברי:</strong> ${formatHebrewDateString(ld.date)} ${currentHebrewYear}</span>
          <span><strong>תאריך לועזי:</strong> ${formatEnglishDate(ld.date)}</span>
          <span><strong>קריאה בציבור:</strong> ${ld.title.he}</span>
        </div>
        <div class="kanban-drawer-actions" id="drawer-actions"></div>
      `

      const actionsContainer = dBody.querySelector('#drawer-actions')!
      const shortcuts = getReadingShortcuts(inst)
      
      shortcuts.forEach((sc) => {
        const btn = document.createElement('a')
        btn.href = sc.url
        btn.className = `kanban-action-btn ${sc.type !== LeiningRunType.Main ? 'mod-secondary' : ''}`
        btn.textContent = sc.label
        actionsContainer.appendChild(btn)
      })

      drawer.classList.add('is-open')
    }

    // Restore drawer if selection was active
    if (selectedKey) {
      const [dateId, instId] = selectedKey.split(':')
      const activeItem = yearDates
        .flatMap(ld => ld.leinings.map(inst => ({ date: ld, inst })))
        .find(item => item.date.id === dateId && item.inst.id === instId)
      if (activeItem) {
        openDrawer(activeItem.date, activeItem.inst)
      }
    }
  }

  render()

  return {
    node: outerContainer,
    onMount: () => {
      console.log('Kanban Board Mounted')
    },
    onDestroy: () => {
      styleNode.remove()
    }
  }
}
