import { LeiningGenerator } from '../../../calendar-model/generator.ts'
import { HDate } from '@hebcal/hdate'
import { LeiningDate, LeiningInstance, LeiningRunType } from '../../../calendar-model/model-types.ts'
import { getReadingShortcuts, formatEnglishDate, cleanReadingTitle } from '../utils.ts'

const HEBREW_MONTHS_MAP: Record<string, string> = {
  'Tishrei': 'תשרי',
  'Cheshvan': 'חשוון',
  'Kislev': 'כסלו',
  'Tevet': 'טבת',
  'Sh\'vat': 'שבט',
  'Adar': 'אדר',
  'Adar I': 'אדר א׳',
  'Adar II': 'אדר ב׳',
  'Nisan': 'ניסן',
  'Iyar': 'אייר',
  'Iyyar': 'אייר',
  'Sivan': 'סיוון',
  'Tammuz': 'תמוז',
  'Tamuz': 'תמוז',
  'Av': 'אב',
  'Elul': 'אלול'
}

export default (generator: LeiningGenerator) => {
  const styleNode = document.createElement('style')
  styleNode.textContent = `
    .timeline-container {
      direction: rtl;
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      height: calc(100vh - var(--header-height) - 60px);
      overflow: hidden;
      background: var(--paper-color, #fdfdfd);
    }
    
    /* Side Navbar */
    .timeline-nav {
      width: 75px;
      border-left: 1px solid var(--medium-accent-color, #eee);
      background: var(--paper-color, #fafafa);
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px 0;
      gap: 8px;
      user-select: none;
    }
    .timeline-nav-item {
      font-size: 13px;
      font-weight: bold;
      padding: 6px 4px;
      width: 85%;
      text-align: center;
      border-radius: 6px;
      cursor: pointer;
      color: var(--light-text-color, #666);
      border: 1px solid transparent;
      transition: all 0.2s;
    }
    .timeline-nav-item:hover {
      background: var(--light-accent-color, #f0f0f0);
      color: var(--text-color, #111);
    }
    .timeline-nav-item.is-active {
      background: #0b57d0;
      color: #fff;
      border-color: #0b57d0;
    }

    /* Scrollable list */
    .timeline-cards {
      flex: 1;
      overflow-y: auto;
      padding: 15px;
      display: flex;
      flex-direction: column;
      gap: 15px;
      scroll-behavior: smooth;
    }
    
    /* Reading card */
    .timeline-card {
      display: flex;
      flex-shrink: 0;
      background: var(--paper-color, #fff);
      border: 1px solid var(--medium-accent-color, #ddd);
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 6px rgba(0,0,0,0.04);
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }
    .timeline-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
    
    /* Month Marker for groups */
    .timeline-month-header {
      font-size: 18px;
      font-weight: bold;
      color: #0b57d0;
      border-bottom: 2px solid #0b57d0;
      padding-bottom: 6px;
      margin-top: 15px;
      margin-bottom: 5px;
    }
    .timeline-month-header:first-child {
      margin-top: 0;
    }
    
    /* Card Left Column: Date Block */
    .timeline-card-date {
      width: 70px;
      background: var(--light-accent-color, #f5f5f5);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-left: 1px solid var(--medium-accent-color, #eee);
      padding: 10px;
    }
    .timeline-date-num {
      font-size: 24px;
      font-weight: 900;
      color: var(--text-color, #222);
    }
    .timeline-date-name {
      font-size: 11px;
      color: var(--light-text-color, #666);
      text-align: center;
    }
    
    /* Card Right Column: Content */
    .timeline-card-content {
      flex: 1;
      padding: 12px 15px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 10px;
    }
    .timeline-card-top {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .timeline-card-title {
      font-size: 18px;
      font-weight: bold;
      color: var(--text-color, #111);
    }
    .timeline-card-subtitle {
      font-size: 12px;
      color: var(--light-text-color, #666);
      display: flex;
      gap: 8px;
    }
    
    /* Badge icons */
    .timeline-badge {
      display: inline-block;
      background: #e8f0fe;
      color: #1a73e8;
      font-size: 11px;
      font-weight: bold;
      padding: 2px 6px;
      border-radius: 10px;
      align-self: flex-start;
    }
    
    .timeline-card-actions {
      display: flex;
      gap: 8px;
    }
    .timeline-action-btn {
      text-decoration: none;
      padding: 6px 12px;
      font-size: 13px;
      border-radius: 5px;
      background: #0b57d0;
      color: #fff;
      font-weight: bold;
      text-align: center;
      transition: background 0.2s;
    }
    .timeline-action-btn:hover {
      background: #0842a0;
    }
    .timeline-action-btn.mod-secondary {
      background: transparent;
      color: #0b57d0;
      border: 1px solid #0b57d0;
    }
    .timeline-action-btn.mod-secondary:hover {
      background: rgba(11, 87, 208, 0.05);
    }
    
    .timeline-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 15px;
      background: var(--paper-color, #fff);
      border-bottom: 1px solid var(--medium-accent-color, #eee);
      direction: ltr;
    }
    .timeline-controls-btn {
      padding: 5px 12px;
      border: 1px solid var(--heavy-accent-color, #999);
      border-radius: 4px;
      background: transparent;
      color: var(--text-color, #333);
      cursor: pointer;
    }
  `
  document.head.appendChild(styleNode)

  const outerContainer = document.createElement('div')
  outerContainer.style.display = 'flex'
  outerContainer.style.flexDirection = 'column'
  outerContainer.className = 'parsha-picker'

  let currentHebrewYear = new HDate().getFullYear()

  const render = () => {
    outerContainer.innerHTML = ''

    // Controls bar
    const controlsBar = document.createElement('div')
    controlsBar.className = 'timeline-controls'

    const prevBtn = document.createElement('button')
    prevBtn.className = 'timeline-controls-btn'
    prevBtn.textContent = `« ${currentHebrewYear - 1}`
    prevBtn.addEventListener('click', () => {
      currentHebrewYear--
      render()
    })

    const yearTitle = document.createElement('span')
    yearTitle.textContent = `Hebrew Year ${currentHebrewYear}`
    yearTitle.style.fontWeight = 'bold'

    const nextBtn = document.createElement('button')
    nextBtn.className = 'timeline-controls-btn'
    nextBtn.textContent = `${currentHebrewYear + 1} »`
    nextBtn.addEventListener('click', () => {
      currentHebrewYear++
      render()
    })

    controlsBar.appendChild(prevBtn)
    controlsBar.appendChild(yearTitle)
    controlsBar.appendChild(nextBtn)
    outerContainer.appendChild(controlsBar)

    // Split view container
    const splitContainer = document.createElement('div')
    splitContainer.className = 'timeline-container'

    const navBar = document.createElement('div')
    navBar.className = 'timeline-nav'

    const cardsContainer = document.createElement('div')
    cardsContainer.className = 'timeline-cards'

    // Generate calendar leinings
    const yearDates = generator.forHebrewYear(currentHebrewYear)

    // Map month occurrences to elements
    const monthSectionElements: Record<string, HTMLElement> = {}
    const navItems: HTMLElement[] = []

    // Group leining dates by Hebrew Month
    const groupedByMonth: Record<string, { date: LeiningDate; inst: LeiningInstance }[]> = {}
    
    yearDates.forEach((ld) => {
      ld.leinings.forEach((inst) => {
        const hDate = new HDate(ld.date)
        const rawMonth = hDate.getMonthName()
        const cleanMonth = HEBREW_MONTHS_MAP[rawMonth] || rawMonth
        
        if (!groupedByMonth[cleanMonth]) {
          groupedByMonth[cleanMonth] = []
        }
        groupedByMonth[cleanMonth].push({ date: ld, inst })
      })
    })

    // Render months
    Object.entries(groupedByMonth).forEach(([monthName, items]) => {
      if (!items.length) return

      // Create vertical month group header in list
      const monthHeader = document.createElement('div')
      monthHeader.className = 'timeline-month-header'
      monthHeader.textContent = monthName
      cardsContainer.appendChild(monthHeader)
      monthSectionElements[monthName] = monthHeader

      // Create Nav Item
      const navItem = document.createElement('div')
      navItem.className = 'timeline-nav-item'
      navItem.textContent = monthName
      navItem.addEventListener('click', () => {
        // Highlight active nav item
        navBar.querySelectorAll('.timeline-nav-item').forEach((n) => n.classList.remove('is-active'))
        navItem.classList.add('is-active')

        // Scroll list
        monthHeader.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
      navBar.appendChild(navItem)
      navItems.push(navItem)

      // Render cards for this month
      items.forEach(({ date, inst }) => {
        const card = document.createElement('div')
        card.className = 'timeline-card'

        // Left pane: Date display
        const hDate = new HDate(date.date)
        const dayNames = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']
        const dayName = dayNames[date.date.getDay()]
        const cardDate = document.createElement('div')
        cardDate.className = 'timeline-card-date'
        cardDate.innerHTML = `
          <span class="timeline-date-num">${hDate.getDate()}</span>
          <span class="timeline-date-name">יום ${dayName}</span>
        `

        // Right pane: Content
        const cardContent = document.createElement('div')
        cardContent.className = 'timeline-card-content'

        const cardTop = document.createElement('div')
        cardTop.className = 'timeline-card-top'

        // Badges / Labels
        let badgeText = ''
        if (!inst.isParsha) {
          badgeText = 'חג/מועד'
        } else if (inst.runs.some(r => r.type === LeiningRunType.Maftir)) {
          badgeText = 'שבת מיוחדת'
        }

        const title = document.createElement('div')
        title.className = 'timeline-card-title'
        title.textContent = cleanReadingTitle(inst)

        const subtitle = document.createElement('div')
        subtitle.className = 'timeline-card-subtitle'
        subtitle.innerHTML = `
          <span>${formatEnglishDate(date.date, true)}</span>
          <span>|</span>
          <span>${date.title.he}</span>
        `

        cardTop.appendChild(title)
        cardTop.appendChild(subtitle)
        if (badgeText) {
          const badge = document.createElement('span')
          badge.className = 'timeline-badge'
          badge.textContent = badgeText
          cardTop.appendChild(badge)
        }

        cardContent.appendChild(cardTop)

        // Action Buttons
        const actions = document.createElement('div')
        actions.className = 'timeline-card-actions'

        const shortcuts = getReadingShortcuts(inst)
        shortcuts.forEach((sc) => {
          const btn = document.createElement('a')
          btn.href = sc.url
          btn.className = `timeline-action-btn ${sc.type !== LeiningRunType.Main ? 'mod-secondary' : ''}`
          btn.textContent = sc.label
          actions.appendChild(btn)
        })

        cardContent.appendChild(actions)

        card.addEventListener('click', (e) => {
          if ((e.target as HTMLElement).tagName === 'A') return
          const mainRun = inst.runs[0]
          if (mainRun) {
            location.hash = `#/run/${mainRun.id}`
          }
        })

        card.appendChild(cardDate)
        card.appendChild(cardContent)
        cardsContainer.appendChild(card)
      })
    })

    // Add scroll spy to highlight active month in sidebar
    cardsContainer.addEventListener('scroll', () => {
      let currentMonth = ''
      const containerTop = cardsContainer.getBoundingClientRect().top + 20

      Object.entries(monthSectionElements).forEach(([monthName, headerEl]) => {
        const rect = headerEl.getBoundingClientRect()
        if (rect.top <= containerTop) {
          currentMonth = monthName
        }
      })

      if (currentMonth) {
        navBar.querySelectorAll('.timeline-nav-item').forEach((nav) => {
          const active = nav.textContent === currentMonth
          nav.classList.toggle('is-active', active)
        })
      }
    })

    // Select first month as active initially
    if (navItems.length) {
      navItems[0].classList.add('is-active')
    }

    splitContainer.appendChild(navBar)
    splitContainer.appendChild(cardsContainer)
    outerContainer.appendChild(splitContainer)
  }

  render()

  return {
    node: outerContainer,
    onMount: () => {
      console.log('Timeline Flow Mounted')
    },
    onDestroy: () => {
      styleNode.remove()
    }
  }
}
