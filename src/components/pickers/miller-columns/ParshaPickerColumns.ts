import { LeiningGenerator } from '../../../calendar-model/generator.ts'
import { HDate } from '@hebcal/hdate'
import { LeiningDate, LeiningInstance, LeiningInstanceId, LeiningRunType } from '../../../calendar-model/model-types.ts'
import { getReadingShortcuts, formatEnglishDate, cleanReadingTitle, formatHebrewDateString } from '../utils.ts'

export default (generator: LeiningGenerator) => {
  const styleNode = document.createElement('style')
  styleNode.textContent = `
    .miller-container {
      direction: rtl;
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      border: 1px solid var(--medium-accent-color, #ddd);
      border-radius: 12px;
      overflow: hidden;
      background: var(--paper-color, #fff);
      box-shadow: 0 4px 16px rgba(0,0,0,0.05);
      height: calc(100vh - var(--header-height) - 120px);
    }
    
    /* Each column pane */
    .miller-column {
      flex: 1;
      border-left: 1px solid var(--medium-accent-color, #eee);
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      min-width: 130px;
    }
    .miller-column:last-child {
      border-left: none;
      flex: 1.2; /* Make details pane slightly wider */
      background: var(--light-accent-color, #fafafa);
      min-width: 180px;
    }
    
    .miller-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .miller-item {
      padding: 10px 15px;
      font-size: 14px;
      cursor: pointer;
      user-select: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--light-accent-color, #f5f5f5);
      color: var(--text-color, #333);
    }
    .miller-item:hover {
      background: var(--light-accent-color, #f0f0f0);
    }
    .miller-item.is-selected {
      background: #0b57d0;
      color: #fff !important;
      font-weight: bold;
    }
    .miller-item-arrow {
      font-size: 10px;
      color: var(--light-text-color, #999);
    }
    .miller-item.is-selected .miller-item-arrow {
      color: #fff;
    }
    
    /* Details pane */
    .miller-details {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .miller-details-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--light-text-color, #888);
      font-size: 14px;
      text-align: center;
    }
    .miller-details-title {
      font-size: 20px;
      font-weight: bold;
      color: var(--text-color, #111);
      border-bottom: 2px solid #0b57d0;
      padding-bottom: 8px;
    }
    .miller-details-meta {
      font-size: 13px;
      color: var(--light-text-color, #555);
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .miller-details-actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 10px;
    }
    .miller-action-btn {
      text-decoration: none;
      padding: 8px 15px;
      font-size: 14px;
      border-radius: 6px;
      background: #0b57d0;
      color: #fff;
      font-weight: bold;
      text-align: center;
      transition: background 0.2s;
    }
    .miller-action-btn:hover {
      background: #0842a0;
    }
    .miller-action-btn.mod-secondary {
      background: transparent;
      color: #0b57d0;
      border: 1px solid #0b57d0;
    }
    .miller-action-btn.mod-secondary:hover {
      background: rgba(11, 87, 208, 0.05);
    }

    .miller-year-controls {
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
    .miller-year-btn {
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

  const render = () => {
    outerContainer.innerHTML = ''

    // Year Control Bar
    const yearBar = document.createElement('div')
    yearBar.className = 'miller-year-controls'

    const prevBtn = document.createElement('button')
    prevBtn.className = 'miller-year-btn'
    prevBtn.textContent = `« ${currentHebrewYear - 1}`
    prevBtn.addEventListener('click', () => {
      currentHebrewYear--
      render()
    })

    const yearTitle = document.createElement('span')
    yearTitle.textContent = `Cascading Columns — Year ${currentHebrewYear}`
    yearTitle.style.fontWeight = 'bold'

    const nextBtn = document.createElement('button')
    nextBtn.className = 'miller-year-btn'
    nextBtn.textContent = `${currentHebrewYear + 1} »`
    nextBtn.addEventListener('click', () => {
      currentHebrewYear++
      render()
    })

    yearBar.appendChild(prevBtn)
    yearBar.appendChild(yearTitle)
    yearBar.appendChild(nextBtn)
    outerContainer.appendChild(yearBar)

    // Master Container
    const container = document.createElement('div')
    container.className = 'miller-container'

    const col1 = document.createElement('div')
    col1.className = 'miller-column'

    const col2 = document.createElement('div')
    col2.className = 'miller-column'

    const col3 = document.createElement('div')
    col3.className = 'miller-column'

    const colDetails = document.createElement('div')
    colDetails.className = 'miller-column'

    container.appendChild(col1)
    container.appendChild(col2)
    container.appendChild(col3)
    container.appendChild(colDetails)
    outerContainer.appendChild(container)

    // Fetch calendar dates
    const yearDates = generator.forHebrewYear(currentHebrewYear)

    // Flatten and index data
    const torahReadings: Record<number, { date: LeiningDate; inst: LeiningInstance }[]> = {
      1: [], 2: [], 3: [], 4: [], 5: []
    }
    const holidaySeasons: Record<string, { date: LeiningDate; inst: LeiningInstance }[]> = {
      'ימים נוראים': [],
      'סוכות ושמיני עצרת': [],
      'חנוכה ופורים': [],
      'פסח': [],
      'שבועות': [],
      'תעניות': [],
      'ראש חודש': []
    }
    const megillotList: { date: LeiningDate; inst: LeiningInstance }[] = []

    yearDates.forEach((ld) => {
      ld.leinings.forEach((inst) => {
        if (inst.isParsha) {
          const bookNum = inst.runs[0].aliyot[0].start.b
          if (torahReadings[bookNum]) {
            torahReadings[bookNum].push({ date: ld, inst })
          }
        } else if (inst.id === LeiningInstanceId.Megillah) {
          megillotList.push({ date: ld, inst })
        } else {
          // Classify Holidays
          const name = inst.date.title.he
          if (name.includes('ראש השנה') || name.includes('כיפור') || name.includes('כפור')) {
            holidaySeasons['ימים נוראים'].push({ date: ld, inst })
          } else if (name.includes('סוכות') || name.includes('שמיני עצרת') || name.includes('שמחת תורה') || name.includes('הושענא רבא')) {
            holidaySeasons['סוכות ושמיני עצרת'].push({ date: ld, inst })
          } else if (name.includes('חנוכה') || name.includes('פורים') || name.includes('שבת שקלים') || name.includes('שבת זכור')) {
            holidaySeasons['חנוכה ופורים'].push({ date: ld, inst })
          } else if (name.includes('פסח') || name.includes('שבת הגדול') || name.includes('שבת פרה') || name.includes('שבת החודש')) {
            holidaySeasons['פסח'].push({ date: ld, inst })
          } else if (name.includes('שבועות')) {
            holidaySeasons['שבועות'].push({ date: ld, inst })
          } else if (
            name.includes('תענית') ||
            name.includes('עשרה בטבת') ||
            name.includes('שבעה עשר') ||
            name.includes('איכה') ||
            name.includes('צום') ||
            name.includes('תשעה באב')
          ) {
            holidaySeasons['תעניות'].push({ date: ld, inst })
          } else {
            // Default to 'ראש חודש' (which now also catches other unmatched special days/Shabbatot)
            holidaySeasons['ראש חודש'].push({ date: ld, inst })
          }
        }
      })
    })

    // Rendering functions
    const showDetails = (ld: LeiningDate, inst: LeiningInstance) => {
      colDetails.innerHTML = ''
      const details = document.createElement('div')
      details.className = 'miller-details'

      const title = document.createElement('div')
      title.className = 'miller-details-title'
      title.textContent = cleanReadingTitle(inst)

      const meta = document.createElement('div')
      meta.className = 'miller-details-meta'
      meta.innerHTML = `
        <span><strong>תאריך עברי:</strong> ${formatHebrewDateString(ld.date)} ${currentHebrewYear}</span>
        <span><strong>תאריך לועזי:</strong> ${formatEnglishDate(ld.date)}</span>
        <span><strong>קריאה:</strong> ${ld.title.he}</span>
      `

      const actions = document.createElement('div')
      actions.className = 'miller-details-actions'

      const shortcuts = getReadingShortcuts(inst)
      shortcuts.forEach((sc) => {
        const btn = document.createElement('a')
        btn.href = sc.url
        btn.className = `miller-action-btn ${sc.type !== LeiningRunType.Main ? 'mod-secondary' : ''}`
        btn.textContent = sc.label
        actions.appendChild(btn)
      })

      details.appendChild(title)
      details.appendChild(meta)
      details.appendChild(actions)
      colDetails.appendChild(details)
    }

    const clearDetails = () => {
      colDetails.innerHTML = '<div class="miller-details-placeholder">בחר פריט כדי להציג פרטים</div>'
    }

    const renderColumn3 = (items: { date: LeiningDate; inst: LeiningInstance }[]) => {
      col3.innerHTML = ''
      clearDetails()
      const list = document.createElement('ul')
      list.className = 'miller-list'

      items.forEach(({ date, inst }) => {
        const item = document.createElement('li')
        item.className = 'miller-item'
        item.textContent = cleanReadingTitle(inst)
        
        item.addEventListener('click', () => {
          col3.querySelectorAll('.miller-item').forEach(i => i.classList.remove('is-selected'))
          item.classList.add('is-selected')
          showDetails(date, inst)
        })

        list.appendChild(item)
      })
      col3.appendChild(list)
    }

    const renderColumn2 = (type: 'torah' | 'holiday' | 'megillah') => {
      col2.innerHTML = ''
      col3.innerHTML = ''
      clearDetails()
      
      const list = document.createElement('ul')
      list.className = 'miller-list'

      if (type === 'torah') {
        const booksList = [
          { id: 1, name: 'ספר בראשית' },
          { id: 2, name: 'ספר שמות' },
          { id: 3, name: 'ספר ויקרא' },
          { id: 4, name: 'ספר במדבר' },
          { id: 5, name: 'ספר דברים' }
        ]
        booksList.forEach((b) => {
          const item = document.createElement('li')
          item.className = 'miller-item'
          item.innerHTML = `<span>${b.name}</span><span class="miller-item-arrow">◀</span>`
          item.addEventListener('click', () => {
            col2.querySelectorAll('.miller-item').forEach(i => i.classList.remove('is-selected'))
            item.classList.add('is-selected')
            renderColumn3(torahReadings[b.id])
          })
          list.appendChild(item)
        })
      } else if (type === 'holiday') {
        Object.keys(holidaySeasons).forEach((seasonName) => {
          const items = holidaySeasons[seasonName]
          if (!items.length) return

          const item = document.createElement('li')
          item.className = 'miller-item'
          item.innerHTML = `<span>${seasonName}</span><span class="miller-item-arrow">◀</span>`
          item.addEventListener('click', () => {
            col2.querySelectorAll('.miller-item').forEach(i => i.classList.remove('is-selected'))
            item.classList.add('is-selected')
            renderColumn3(items)
          })
          list.appendChild(item)
        })
      } else if (type === 'megillah') {
        const item = document.createElement('li')
        item.className = 'miller-item'
        item.innerHTML = `<span>מגילות המועדים</span><span class="miller-item-arrow">◀</span>`
        item.addEventListener('click', () => {
          col2.querySelectorAll('.miller-item').forEach(i => i.classList.remove('is-selected'))
          item.classList.add('is-selected')
          renderColumn3(megillotList)
        })
        list.appendChild(item)
      }

      col2.appendChild(list)
    }

    // Render Column 1 (Root categories)
    const categories: { id: 'torah' | 'holiday' | 'megillah'; name: string }[] = [
      { id: 'torah', name: 'תורה וחומשים' },
      { id: 'holiday', name: 'מועדים וחגים' },
      { id: 'megillah', name: 'מגילות המועדים' }
    ]
    
    const list1 = document.createElement('ul')
    list1.className = 'miller-list'

    categories.forEach((cat) => {
      const item = document.createElement('li')
      item.className = 'miller-item'
      item.innerHTML = `<span>${cat.name}</span><span class="miller-item-arrow">◀</span>`
      item.addEventListener('click', () => {
        col1.querySelectorAll('.miller-item').forEach(i => i.classList.remove('is-selected'))
        item.classList.add('is-selected')
        renderColumn2(cat.id)
      })
      list1.appendChild(item)
    })
    col1.appendChild(list1)

    clearDetails()
  }

  render()

  return {
    node: outerContainer,
    onMount: () => {
      console.log('Miller Columns Mounted')
    },
    onDestroy: () => {
      styleNode.remove()
    }
  }
}
