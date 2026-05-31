import { LeiningGenerator } from '../../../calendar-model/generator.ts'
import { HDate } from '@hebcal/hdate'
import { LeiningDate, LeiningInstance, LeiningRun, LeiningRunType } from '../../../calendar-model/model-types.ts'
import { getReadingShortcuts, formatEnglishDate, cleanReadingTitle, formatHebrewDateString } from '../utils.ts'

const isLeapYear = (year: number): boolean => {
  const test13 = new HDate(1, 13, year)
  return test13.getFullYear() === year
}

const getDaysInHebrewMonth = (monthNum: number, year: number): number => {
  const test30 = new HDate(30, monthNum, year)
  if (test30.getMonth() !== monthNum) return 29
  return 30
}

const getHebrewMonthNames = (year: number): { num: number; name: string }[] => {
  const leap = isLeapYear(year)
  if (leap) {
    return [
      { num: 1, name: 'תשרי' },
      { num: 2, name: 'חשוון' },
      { num: 3, name: 'כסלו' },
      { num: 4, name: 'טבת' },
      { num: 5, name: 'שבט' },
      { num: 6, name: 'אדר א׳' },
      { num: 7, name: 'אדר ב׳' },
      { num: 8, name: 'ניסן' },
      { num: 9, name: 'אייר' },
      { num: 10, name: 'סיוון' },
      { num: 11, name: 'תמוז' },
      { num: 12, name: 'אב' },
      { num: 13, name: 'אלול' }
    ]
  } else {
    return [
      { num: 1, name: 'תשרי' },
      { num: 2, name: 'חשוון' },
      { num: 3, name: 'כסלו' },
      { num: 4, name: 'טבת' },
      { num: 5, name: 'שבט' },
      { num: 6, name: 'אדר' },
      { num: 7, name: 'ניסן' },
      { num: 8, name: 'אייר' },
      { num: 9, name: 'סיוון' },
      { num: 10, name: 'תמוז' },
      { num: 11, name: 'אב' },
      { num: 12, name: 'אלול' }
    ]
  }
}

export default (generator: LeiningGenerator) => {
  const styleNode = document.createElement('style')
  styleNode.textContent = `
    .cal-container {
      direction: rtl;
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 500px;
      margin: 0 auto;
      padding: 15px;
      color: var(--text-color, #333);
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    
    .cal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--paper-color, #fff);
      border: 1px solid var(--medium-accent-color, #eee);
      padding: 10px 15px;
      border-radius: 10px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.02);
    }
    .cal-month-switcher {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .cal-header-title {
      font-size: 18px;
      font-weight: bold;
      color: var(--text-color, #111);
    }
    .cal-btn {
      padding: 6px 12px;
      border: 1px solid var(--heavy-accent-color, #999);
      border-radius: 6px;
      background: transparent;
      color: var(--text-color, #333);
      cursor: pointer;
      font-weight: bold;
      user-select: none;
    }
    .cal-btn:hover {
      background: var(--light-accent-color, #f5f5f5);
    }

    /* Calendar Grid */
    .cal-grid-wrapper {
      border: 1px solid var(--medium-accent-color, #ddd);
      border-radius: 12px;
      overflow: hidden;
      background: var(--paper-color, #fff);
      box-shadow: 0 4px 12px rgba(0,0,0,0.04);
    }
    .cal-weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      background: var(--light-accent-color, #f5f5f5);
      border-bottom: 1px solid var(--medium-accent-color, #ddd);
      padding: 8px 0;
      text-align: center;
      font-weight: bold;
      font-size: 13px;
      color: var(--light-text-color, #666);
    }
    .cal-days {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      padding: 8px;
      gap: 6px;
    }
    .cal-cell {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      font-size: 14px;
      font-weight: 500;
      border-radius: 50%;
      cursor: default;
      user-select: none;
      color: var(--text-color, #444);
    }
    .cal-cell.is-empty {
      visibility: hidden;
    }
    .cal-cell.is-leining {
      cursor: pointer;
      background: rgba(11, 87, 208, 0.06);
      border: 1.5px dashed #0b57d0;
      font-weight: bold;
      color: #0b57d0;
    }
    .cal-cell.is-leining:hover {
      background: rgba(11, 87, 208, 0.15);
    }
    .cal-cell.is-active {
      background: #0b57d0 !important;
      color: #fff !important;
      border-style: solid !important;
      box-shadow: 0 2px 6px rgba(11, 87, 208, 0.3);
    }
    
    /* Details drawer */
    .cal-drawer {
      border: 1px solid var(--medium-accent-color, #ddd);
      border-radius: 12px;
      background: var(--paper-color, #fff);
      padding: 15px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.04);
      display: none;
      flex-direction: column;
      gap: 12px;
      animation: cal-drawer-in 0.25s ease-out;
    }
    .cal-drawer.is-visible {
      display: flex;
    }
    @keyframes cal-drawer-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .cal-drawer-title {
      font-size: 18px;
      font-weight: bold;
      color: var(--text-color, #111);
      border-bottom: 1px solid var(--medium-accent-color, #eee);
      padding-bottom: 8px;
    }
    .cal-drawer-meta {
      font-size: 13px;
      color: var(--light-text-color, #666);
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .cal-drawer-actions {
      display: flex;
      gap: 8px;
      margin-top: 5px;
    }
    .cal-action-btn {
      text-decoration: none;
      padding: 6px 14px;
      font-size: 13px;
      border-radius: 6px;
      background: #0b57d0;
      color: #fff;
      font-weight: bold;
      text-align: center;
      transition: background 0.2s;
    }
    .cal-action-btn:hover {
      background: #0842a0;
    }
    .cal-action-btn.mod-secondary {
      background: transparent;
      color: #0b57d0;
      border: 1px solid #0b57d0;
    }
    .cal-action-btn.mod-secondary:hover {
      background: rgba(11, 87, 208, 0.05);
    }
  `
  document.head.appendChild(styleNode)

  const container = document.createElement('div')
  container.className = 'parsha-picker cal-container'

  // State variables
  const today = new HDate()
  let currentHebrewYear = today.getFullYear()
  
  // Find current month index inside Hebrew Month list
  const initialMonthsList = getHebrewMonthNames(currentHebrewYear)
  let currentMonthIndex = initialMonthsList.findIndex(m => m.num === today.getMonth())
  if (currentMonthIndex === -1) currentMonthIndex = 0

  // Details drawer element
  const drawer = document.createElement('div')
  drawer.className = 'cal-drawer'
  drawer.innerHTML = `
    <div class="cal-drawer-title"></div>
    <div class="cal-drawer-meta"></div>
    <div class="cal-drawer-actions"></div>
  `

  const render = () => {
    container.innerHTML = ''

    // Fetch months for currently selected year
    const monthsList = getHebrewMonthNames(currentHebrewYear)
    
    // Safe bounds checking on index
    if (currentMonthIndex >= monthsList.length) {
      currentMonthIndex = monthsList.length - 1
    } else if (currentMonthIndex < 0) {
      currentMonthIndex = 0
    }

    const activeMonth = monthsList[currentMonthIndex]

    // Year switcher
    const header = document.createElement('div')
    header.className = 'cal-header'

    const prevYearBtn = document.createElement('button')
    prevYearBtn.className = 'cal-btn'
    prevYearBtn.textContent = `« ${currentHebrewYear - 1}`
    prevYearBtn.addEventListener('click', () => {
      currentHebrewYear--
      render()
    })

    const monthSwitcher = document.createElement('div')
    monthSwitcher.className = 'cal-month-switcher'

    const prevMonthBtn = document.createElement('button')
    prevMonthBtn.className = 'cal-btn'
    prevMonthBtn.textContent = '◀'
    prevMonthBtn.addEventListener('click', () => {
      if (currentMonthIndex > 0) {
        currentMonthIndex--
      } else {
        currentHebrewYear--
        currentMonthIndex = getHebrewMonthNames(currentHebrewYear).length - 1
      }
      render()
    })

    const title = document.createElement('span')
    title.className = 'cal-header-title'
    title.textContent = `${activeMonth.name} ${currentHebrewYear}`

    const nextMonthBtn = document.createElement('button')
    nextMonthBtn.className = 'cal-btn'
    nextMonthBtn.textContent = '▶'
    nextMonthBtn.addEventListener('click', () => {
      if (currentMonthIndex < monthsList.length - 1) {
        currentMonthIndex++
      } else {
        currentHebrewYear++
        currentMonthIndex = 0
      }
      render()
    })

    const nextYearBtn = document.createElement('button')
    nextYearBtn.className = 'cal-btn'
    nextYearBtn.textContent = `${currentHebrewYear + 1} »`
    nextYearBtn.addEventListener('click', () => {
      currentHebrewYear++
      render()
    })

    monthSwitcher.appendChild(prevMonthBtn)
    monthSwitcher.appendChild(title)
    monthSwitcher.appendChild(nextMonthBtn)

    header.appendChild(prevYearBtn)
    header.appendChild(monthSwitcher)
    header.appendChild(nextYearBtn)
    container.appendChild(header)

    // Render grid wrapper
    const gridWrapper = document.createElement('div')
    gridWrapper.className = 'cal-grid-wrapper'

    const weekdays = document.createElement('div')
    weekdays.className = 'cal-weekdays'
    const weekdayNames = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש']
    weekdayNames.forEach(w => {
      const cell = document.createElement('span')
      cell.textContent = w
      weekdays.appendChild(cell)
    })
    gridWrapper.appendChild(weekdays)

    const daysContainer = document.createElement('div')
    daysContainer.className = 'cal-days'

    // Find day of week of the 1st of this month
    const firstDayHDate = new HDate(1, activeMonth.num, currentHebrewYear)
    const dayOfWeek = firstDayHDate.greg().getDay() // 0 = Sun, 1 = Mon ... 6 = Sat

    // Blank cells
    for (let i = 0; i < dayOfWeek; i++) {
      const emptyCell = document.createElement('div')
      emptyCell.className = 'cal-cell is-empty'
      daysContainer.appendChild(emptyCell)
    }

    // Generate calendar data for this year
    const yearDates = generator.forHebrewYear(currentHebrewYear)

    // Map month-day key to leinings
    const leiningMap: Record<string, { date: LeiningDate; inst: LeiningInstance }> = {}
    yearDates.forEach((ld) => {
      ld.leinings.forEach((inst) => {
        const hd = new HDate(ld.date)
        if (hd.getMonth() === activeMonth.num) {
          leiningMap[hd.getDate()] = { date: ld, inst }
        }
      })
    })

    const daysInMonth = getDaysInHebrewMonth(activeMonth.num, currentHebrewYear)

    // Draw days
    for (let day = 1; day <= daysInMonth; day++) {
      const cell = document.createElement('div')
      cell.className = 'cal-cell'
      cell.textContent = String(day)

      const leining = leiningMap[day]
      if (leining) {
        cell.classList.add('is-leining')
        cell.addEventListener('click', () => {
          // Toggle active style
          daysContainer.querySelectorAll('.cal-cell').forEach(c => c.classList.remove('is-active'))
          cell.classList.add('is-active')

          // Display details
          showLeiningDetails(leining.date, leining.inst)
        })
      }

      daysContainer.appendChild(cell)
    }

    gridWrapper.appendChild(daysContainer)
    container.appendChild(gridWrapper)

    // Append drawer (hidden initially until clicked)
    drawer.classList.remove('is-visible')
    container.appendChild(drawer)
  }

  const showLeiningDetails = (ld: LeiningDate, inst: LeiningInstance) => {
    const dTitle = drawer.querySelector('.cal-drawer-title')!
    dTitle.textContent = cleanReadingTitle(inst)

    const dMeta = drawer.querySelector('.cal-drawer-meta')!
    const hDate = new HDate(ld.date)
    dMeta.innerHTML = `
      <span><strong>תאריך עברי:</strong> ${formatHebrewDateString(ld.date)} ${currentHebrewYear}</span>
      <span><strong>תאריך לועזי:</strong> ${formatEnglishDate(ld.date)}</span>
      <span><strong>תיאור קריאה:</strong> ${ld.title.he}</span>
    `

    const dActions = drawer.querySelector('.cal-drawer-actions')!
    dActions.innerHTML = ''

    const shortcuts = getReadingShortcuts(inst)
    shortcuts.forEach((sc) => {
      const btn = document.createElement('a')
      btn.href = sc.url
      btn.className = `cal-action-btn ${sc.type !== LeiningRunType.Main ? 'mod-secondary' : ''}`
      btn.textContent = sc.label
      dActions.appendChild(btn)
    })

    drawer.classList.add('is-visible')
  }

  render()

  return {
    node: container,
    onMount: () => {
      console.log('Calendar Grid Mounted')
    },
    onDestroy: () => {
      styleNode.remove()
    }
  }
}
