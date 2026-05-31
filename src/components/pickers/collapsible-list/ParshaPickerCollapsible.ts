import { LeiningGenerator } from '../../../calendar-model/generator.ts'
import { HDate } from '@hebcal/hdate'
import { LeiningDate, LeiningInstance, LeiningInstanceId } from '../../../calendar-model/model-types.ts'
import { getReadingShortcuts, formatEnglishDate, cleanReadingTitle, formatHebrewDateString } from '../utils.ts'

export default (generator: LeiningGenerator) => {
  const styleNode = document.createElement('style')
  styleNode.textContent = `
    .collapsible-container {
      direction: rtl;
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 15px;
      color: var(--text-color, #333);
    }
    .collapsible-header {
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: var(--paper-color, #fafafa);
      padding: 15px;
      border-radius: 8px;
      border: 1px solid var(--medium-accent-color, #ddd);
      margin-bottom: 20px;
    }
    .collapsible-year-switcher {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }
    .collapsible-year-title {
      font-size: 18px;
      font-weight: bold;
      color: var(--text-color, #111);
    }
    .collapsible-btn {
      padding: 6px 14px;
      border: 1px solid var(--heavy-accent-color, #ccc);
      background: var(--paper-color, #fff);
      color: var(--text-color, #333);
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      user-select: none;
    }
    .collapsible-btn:hover {
      background: var(--light-accent-color, #f0f0f0);
    }
    .collapsible-date-jump {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
    }
    .collapsible-date-input {
      padding: 5px 8px;
      border: 1px solid var(--heavy-accent-color, #ccc);
      border-radius: 6px;
      font-size: 14px;
      background: var(--paper-color, #fff);
      color: var(--text-color, #333);
    }
    .collapsible-group {
      margin-bottom: 12px;
      border: 1px solid var(--medium-accent-color, #ddd);
      border-radius: 8px;
      overflow: hidden;
      background: var(--paper-color, #fff);
    }
    .collapsible-group-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 15px;
      background: var(--light-accent-color, #f5f5f5);
      cursor: pointer;
      user-select: none;
      font-weight: bold;
      font-size: 16px;
      border-bottom: 1px solid var(--medium-accent-color, #ddd);
    }
    .collapsible-group.is-collapsed .collapsible-group-header {
      border-bottom-color: transparent;
    }
    .collapsible-group.is-collapsed .collapsible-group-content {
      display: none;
    }
    .collapsible-group-arrow {
      font-size: 12px;
      transition: transform 0.2s;
      transform: rotate(90deg);
    }
    .collapsible-group.is-collapsed .collapsible-group-arrow {
      transform: rotate(0deg);
    }
    .collapsible-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .collapsible-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 15px;
      border-bottom: 1px solid var(--light-accent-color, #eee);
    }
    .collapsible-item:last-child {
      border-bottom: none;
    }
    .collapsible-item-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .collapsible-item-title {
      font-size: 16px;
      font-weight: bold;
      color: var(--text-color, #222);
    }
    .collapsible-item-date {
      font-size: 12px;
      color: var(--light-text-color, #777);
      display: flex;
      gap: 8px;
    }
    .collapsible-shortcuts {
      display: flex;
      gap: 8px;
    }
    .collapsible-shortcut-btn {
      text-decoration: none;
      padding: 5px 10px;
      font-size: 13px;
      border-radius: 4px;
      border: 1px solid #0b57d0;
      color: #0b57d0;
      background: transparent;
      font-weight: 500;
      transition: all 0.2s;
    }
    .collapsible-shortcut-btn:hover {
      background: #0b57d0;
      color: #fff;
    }
  `
  document.head.appendChild(styleNode)

  const container = document.createElement('div')
  container.className = 'parsha-picker collapsible-container'

  let currentHebrewYear = new HDate().getFullYear()
  let collapsedStates: Record<string, boolean> = {
    'book-1': false, // Open Genesis by default
    'book-2': true,
    'book-3': true,
    'book-4': true,
    'book-5': true,
    'holidays': false,
    'megillot': true
  }

  const render = () => {
    container.innerHTML = ''

    // Create Header controls
    const header = document.createElement('div')
    header.className = 'collapsible-header'

    const yearSwitcher = document.createElement('div')
    yearSwitcher.className = 'collapsible-year-switcher'

    const prevBtn = document.createElement('button')
    prevBtn.className = 'collapsible-btn'
    prevBtn.textContent = `שנה קודמת (${currentHebrewYear - 1})`
    prevBtn.addEventListener('click', () => {
      currentHebrewYear--
      render()
    })

    const yearTitle = document.createElement('span')
    yearTitle.className = 'collapsible-year-title'
    yearTitle.textContent = `שנת ${currentHebrewYear}`

    const nextBtn = document.createElement('button')
    nextBtn.className = 'collapsible-btn'
    nextBtn.textContent = `שנה הבאה (${currentHebrewYear + 1})`
    nextBtn.addEventListener('click', () => {
      currentHebrewYear++
      render()
    })

    yearSwitcher.appendChild(prevBtn)
    yearSwitcher.appendChild(yearTitle)
    yearSwitcher.appendChild(nextBtn)
    header.appendChild(yearSwitcher)

    // Date Jumper
    const dateJump = document.createElement('div')
    dateJump.className = 'collapsible-date-jump'

    const dateLabel = document.createElement('span')
    dateLabel.textContent = 'קפוץ לתאריך:'

    const dateInput = document.createElement('input')
    dateInput.type = 'date'
    dateInput.className = 'collapsible-date-input'
    dateInput.addEventListener('change', () => {
      if (!dateInput.value) return
      const dateParts = dateInput.value.split('-')
      const date = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]))
      const leiningDate = generator.createLeiningDate(new HDate(date))
      if (leiningDate && leiningDate.leinings.length) {
        const run = leiningDate.leinings[0].runs[0]
        location.hash = `#/run/${run.id}`
      } else {
        alert('אין קריאת תורה בתאריך זה.')
      }
    })

    dateJump.appendChild(dateLabel)
    dateJump.appendChild(dateInput)
    header.appendChild(dateJump)
    container.appendChild(header)

    // Generate calendar data
    const yearDates = generator.forHebrewYear(currentHebrewYear)

    // Group by category
    const books: Record<number, { name: string; leinings: { date: LeiningDate; inst: LeiningInstance }[] }> = {
      1: { name: 'ספר בראשית', leinings: [] },
      2: { name: 'ספר שמות', leinings: [] },
      3: { name: 'ספר ויקרא', leinings: [] },
      4: { name: 'ספר במדבר', leinings: [] },
      5: { name: 'ספר דברים', leinings: [] }
    }
    const holidays: { date: LeiningDate; inst: LeiningInstance }[] = []
    const megillot: { date: LeiningDate; inst: LeiningInstance }[] = []

    yearDates.forEach((ld) => {
      ld.leinings.forEach((inst) => {
        if (inst.isParsha) {
          const bookNum = inst.runs[0].aliyot[0].start.b
          if (books[bookNum]) {
            books[bookNum].leinings.push({ date: ld, inst })
          }
        } else {
          if (inst.id === LeiningInstanceId.Megillah) {
            megillot.push({ date: ld, inst })
          } else {
            holidays.push({ date: ld, inst })
          }
        }
      })
    })

    // Helper to append group
    const createGroup = (groupId: string, groupName: string, items: { date: LeiningDate; inst: LeiningInstance }[]) => {
      if (!items.length) return

      const groupEl = document.createElement('div')
      groupEl.className = `collapsible-group ${collapsedStates[groupId] ? 'is-collapsed' : ''}`

      const groupHeader = document.createElement('div')
      groupHeader.className = 'collapsible-group-header'
      groupHeader.innerHTML = `
        <span>${groupName} (${items.length})</span>
        <span class="collapsible-group-arrow">◀</span>
      `
      groupHeader.addEventListener('click', () => {
        collapsedStates[groupId] = !collapsedStates[groupId]
        groupEl.classList.toggle('is-collapsed', collapsedStates[groupId])
      })

      const groupContent = document.createElement('div')
      groupContent.className = 'collapsible-group-content'

      const list = document.createElement('ul')
      list.className = 'collapsible-list'

      items.forEach(({ date, inst }) => {
        const item = document.createElement('li')
        item.className = 'collapsible-item'

        const itemInfo = document.createElement('div')
        itemInfo.className = 'collapsible-item-info'

        const itemTitle = document.createElement('span')
        itemTitle.className = 'collapsible-item-title'
        itemTitle.textContent = cleanReadingTitle(inst)

        const itemDate = document.createElement('span')
        itemDate.className = 'collapsible-item-date'
        itemDate.innerHTML = `
          <span>${formatHebrewDateString(date.date)}</span>
          <span>|</span>
          <span>${formatEnglishDate(date.date, true)}</span>
        `

        itemInfo.appendChild(itemTitle)
        itemInfo.appendChild(itemDate)

        const shortcutsContainer = document.createElement('div')
        shortcutsContainer.className = 'collapsible-shortcuts'

        const shortcuts = getReadingShortcuts(inst)
        shortcuts.forEach((sc) => {
          const link = document.createElement('a')
          link.href = sc.url
          link.className = 'collapsible-shortcut-btn'
          link.textContent = sc.label
          shortcutsContainer.appendChild(link)
        })

        item.appendChild(itemInfo)
        item.appendChild(shortcutsContainer)
        list.appendChild(item)
      })

      groupContent.appendChild(list)
      groupEl.appendChild(groupHeader)
      groupEl.appendChild(groupContent)
      container.appendChild(groupEl)
    }

    // Render Torah books
    for (let i = 1; i <= 5; i++) {
      createGroup(`book-${i}`, books[i].name, books[i].leinings)
    }

    // Render Holidays
    createGroup('holidays', 'חגים ומועדים', holidays)

    // Render Megillot
    createGroup('megillot', 'חמש מגילות', megillot)
  }

  render()

  return {
    node: container,
    onMount: () => {
      console.log('Collapsible List Mounted')
    },
    onDestroy: () => {
      styleNode.remove()
    }
  }
}
