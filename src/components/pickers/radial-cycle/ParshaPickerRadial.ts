import { LeiningGenerator } from '../../../calendar-model/generator.ts'
import { HDate } from '@hebcal/hdate'
import { LeiningDate, LeiningInstance, LeiningRun, LeiningInstanceId, LeiningRunType } from '../../../calendar-model/model-types.ts'
import { getReadingShortcuts, formatEnglishDate, cleanReadingTitle, formatHebrewDateString } from '../utils.ts'

export default (generator: LeiningGenerator) => {
  const styleNode = document.createElement('style')
  styleNode.textContent = `
    .radial-picker-container {
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
    
    .radial-wheel-pane {
      flex: 1.5;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      background: var(--light-accent-color, #fafafa);
      border-left: 1px solid var(--medium-accent-color, #eee);
      overflow: hidden;
    }
    
    .radial-details-pane {
      flex: 1;
      padding: 25px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      overflow-y: auto;
      background: var(--paper-color, #fff);
    }
    
    .radial-details-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--light-text-color, #888);
      font-size: 14px;
      text-align: center;
    }
    
    .radial-details-title {
      font-size: 22px;
      font-weight: bold;
      color: var(--text-color, #111);
      border-bottom: 2px solid #0b57d0;
      padding-bottom: 10px;
    }
    
    .radial-details-meta {
      font-size: 14px;
      color: var(--light-text-color, #555);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .radial-details-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 15px;
    }
    
    .radial-action-btn {
      text-decoration: none;
      padding: 10px 15px;
      font-size: 14px;
      border-radius: 8px;
      background: #0b57d0;
      color: #fff;
      font-weight: bold;
      text-align: center;
      transition: background 0.2s;
    }
    .radial-action-btn:hover {
      background: #0842a0;
    }
    .radial-action-btn.mod-secondary {
      background: transparent;
      color: #0b57d0;
      border: 1px solid #0b57d0;
    }
    .radial-action-btn.mod-secondary:hover {
      background: rgba(11, 87, 208, 0.05);
    }
    
    /* SVG styles */
    .wheel-month-arc {
      fill: var(--paper-color, #fff);
      stroke: var(--medium-accent-color, #ddd);
      stroke-width: 1;
      transition: fill 0.2s;
      cursor: pointer;
    }
    .wheel-month-arc:hover {
      fill: var(--light-accent-color, #f5f5f5);
    }
    .wheel-month-text {
      font-size: 10px;
      font-weight: bold;
      fill: var(--text-color, #444);
      pointer-events: none;
      text-anchor: middle;
      dominant-baseline: middle;
    }
    
    .wheel-reading-point {
      fill: #0b57d0;
      stroke: #fff;
      stroke-width: 1.5;
      cursor: pointer;
      transition: r 0.2s, fill 0.2s;
    }
    .wheel-reading-point:hover {
      r: 8;
      fill: #0842a0;
    }
    .wheel-reading-point.is-selected {
      r: 10;
      fill: #ea4335;
      stroke: #fff;
      stroke-width: 2;
    }
    .wheel-reading-point.is-holiday {
      fill: #f9ab00;
    }
    .wheel-reading-point.is-holiday:hover {
      fill: #e37400;
    }
    .wheel-reading-point.is-holiday.is-selected {
      fill: #ea4335;
    }
    
    /* Labels for readings, visible on zoom */
    .wheel-reading-label {
      font-size: 7px;
      fill: var(--text-color, #333);
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease, font-size 0.2s;
      font-weight: bold;
      direction: ltr; /* Keep LTR layout for text-anchor consistency */
    }
    
    /* Zoom-specific label visibility */
    .zoom-q1 .q1-label { opacity: 1; }
    .zoom-q2 .q2-label { opacity: 1; }
    .zoom-q3 .q3-label { opacity: 1; }
    .zoom-q4 .q4-label { opacity: 1; }
    
    .wheel-reading-label.is-selected {
      opacity: 1 !important;
      fill: #ea4335;
      font-size: 9px;
    }
    
    .wheel-center-circle {
      cursor: pointer;
      transition: fill 0.2s;
    }
    .wheel-center-circle:hover {
      fill: var(--light-accent-color, #f0f0f0);
    }
    
    .wheel-center-label {
      font-size: 15px;
      font-weight: bold;
      fill: var(--text-color, #111);
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none;
    }
    .wheel-center-sublabel {
      font-size: 10px;
      fill: var(--light-text-color, #666);
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none;
    }
    
    .radial-year-controls {
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
    .radial-year-btn {
      padding: 5px 10px;
      border: 1px solid var(--heavy-accent-color, #999);
      border-radius: 4px;
      background: transparent;
      color: var(--text-color, #333);
      cursor: pointer;
      font-weight: bold;
    }
    
    .wheel-connector-line {
      stroke: var(--medium-accent-color, #eee);
      stroke-width: 1;
      stroke-dasharray: 2,2;
    }
    
    /* Zoom instructions overlay */
    .radial-zoom-hint {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0,0,0,0.6);
      color: #fff;
      font-size: 11px;
      padding: 4px 8px;
      border-radius: 4px;
      pointer-events: none;
      font-family: inherit;
    }
    
    /* Mobile Responsiveness */
    @media (max-width: 768px) {
      .radial-picker-container {
        flex-direction: column;
        height: calc(100vh - var(--header-height) - 100px);
      }
      
      .radial-wheel-pane {
        flex: 1.3;
        border-left: none;
        border-bottom: 1px solid var(--medium-accent-color, #eee);
        min-height: 280px;
      }
      
      .radial-details-pane {
        flex: 1;
        padding: 15px;
      }
      
      .radial-details-title {
        font-size: 18px;
      }
      
      .radial-zoom-hint {
        font-size: 9px;
        padding: 2px 6px;
      }
      
      /* Scale text sizes up inside SVG for mobile screen rendering */
      .wheel-reading-label {
        font-size: 8.5px;
      }
      .wheel-reading-label.is-selected {
        font-size: 10.5px;
      }
      .wheel-month-text {
        font-size: 11.5px;
      }
      .wheel-center-label {
        font-size: 16px;
      }
      .wheel-center-sublabel {
        font-size: 11px;
      }
    }
  `
  document.head.appendChild(styleNode)

  const outerContainer = document.createElement('div')
  outerContainer.className = 'parsha-picker'
  outerContainer.style.display = 'flex'
  outerContainer.style.flexDirection = 'column'

  let currentHebrewYear = new HDate().getFullYear()
  let selectedReading: { date: LeiningDate; inst: LeiningInstance } | null = null
  let zoomState: 'full' | 'q1' | 'q2' | 'q3' | 'q4' = 'full'

  // Helper to describe SVG path for annular sector
  const describeAnnularSector = (
    cx: number,
    cy: number,
    r1: number,
    r2: number,
    startAngleDeg: number,
    endAngleDeg: number
  ): string => {
    const startAngleRad = (startAngleDeg * Math.PI) / 180
    const endAngleRad = (endAngleDeg * Math.PI) / 180

    const p1 = {
      x: cx + r2 * Math.cos(startAngleRad),
      y: cy + r2 * Math.sin(startAngleRad)
    }
    const p2 = {
      x: cx + r2 * Math.cos(endAngleRad),
      y: cy + r2 * Math.sin(endAngleRad)
    }
    const p3 = {
      x: cx + r1 * Math.cos(endAngleRad),
      y: cy + r1 * Math.sin(endAngleRad)
    }
    const p4 = {
      x: cx + r1 * Math.cos(startAngleRad),
      y: cy + r1 * Math.sin(startAngleRad)
    }

    const largeArcFlag = Math.abs(endAngleDeg - startAngleDeg) > 180 ? 1 : 0

    return [
      `M ${p1.x} ${p1.y}`,
      `A ${r2} ${r2} 0 ${largeArcFlag} 1 ${p2.x} ${p2.y}`,
      `L ${p3.x} ${p3.y}`,
      `A ${r1} ${r1} 0 ${largeArcFlag} 0 ${p4.x} ${p4.y}`,
      'Z'
    ].join(' ')
  }

  // Get quadrant from normalized angle in degrees (0 to 360, where 0 is 3 o'clock, 90 is 6 o'clock, etc.)
  const getQuadrant = (angleDeg: number): 'q1' | 'q2' | 'q3' | 'q4' => {
    const norm = ((angleDeg % 360) + 360) % 360
    if (norm >= 0 && norm < 90) return 'q4'     // Bottom-Right
    if (norm >= 90 && norm < 180) return 'q3'   // Bottom-Left
    if (norm >= 180 && norm < 270) return 'q2'  // Top-Left
    return 'q1'                                 // Top-Right (270 to 360)
  }

  // Smoothly animate SVG viewBox
  const animateViewBox = (
    svg: SVGSVGElement,
    targetX: number,
    targetY: number,
    targetW: number,
    targetH: number,
    duration = 350
  ) => {
    const startTime = performance.now()
    const startVal = svg.viewBox.baseVal
    const startX = startVal.x
    const startY = startVal.y
    const startW = startVal.width
    const startH = startVal.height

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      // Ease in out quad
      const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2

      const x = startX + (targetX - startX) * ease
      const y = startY + (targetY - startY) * ease
      const w = startW + (targetW - startW) * ease
      const h = startH + (targetH - startH) * ease

      svg.setAttribute('viewBox', `${x} ${y} ${w} ${h}`)

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }
    requestAnimationFrame(step)
  }

  const render = () => {
    outerContainer.innerHTML = ''

    // Year Control Bar
    const yearBar = document.createElement('div')
    yearBar.className = 'radial-year-controls'

    const prevBtn = document.createElement('button')
    prevBtn.className = 'radial-year-btn'
    prevBtn.textContent = `« ${currentHebrewYear - 1}`
    prevBtn.addEventListener('click', () => {
      currentHebrewYear--
      selectedReading = null
      zoomState = 'full'
      render()
    })

    const yearTitle = document.createElement('span')
    yearTitle.textContent = `Radial Cycle Wheel — Year ${currentHebrewYear}`
    yearTitle.style.fontWeight = 'bold'

    const nextBtn = document.createElement('button')
    nextBtn.className = 'radial-year-btn'
    nextBtn.textContent = `${currentHebrewYear + 1} »`
    nextBtn.addEventListener('click', () => {
      currentHebrewYear++
      selectedReading = null
      zoomState = 'full'
      render()
    })

    yearBar.appendChild(prevBtn)
    yearBar.appendChild(yearTitle)
    yearBar.appendChild(nextBtn)
    outerContainer.appendChild(yearBar)

    // Master Container
    const container = document.createElement('div')
    container.className = 'radial-picker-container'

    const wheelPane = document.createElement('div')
    wheelPane.className = 'radial-wheel-pane'

    const hintOverlay = document.createElement('div')
    hintOverlay.className = 'radial-zoom-hint'
    hintOverlay.textContent = 'לחץ על חודש כדי להתמקד | לחץ במרכז כדי לצאת'
    wheelPane.appendChild(hintOverlay)

    const detailsPane = document.createElement('div')
    detailsPane.className = 'radial-details-pane'

    container.appendChild(wheelPane)
    container.appendChild(detailsPane)
    outerContainer.appendChild(container)

    // Fetch calendar dates
    const yearDates = generator.forHebrewYear(currentHebrewYear)
    if (!yearDates.length) return

    const totalMs = yearDates[yearDates.length - 1].date.getTime() - yearDates[0].date.getTime()

    // Group readings by month
    const readingsByMonth: Record<number, { date: LeiningDate; inst: LeiningInstance; angleDeg: number }[]> = {}
    const monthsPresent = new Set<number>()
    const allReadings: { date: LeiningDate; inst: LeiningInstance; angleDeg: number; quad: 'q1' | 'q2' | 'q3' | 'q4' }[] = []

    yearDates.forEach((ld) => {
      ld.leinings.forEach((inst) => {
        const msFromStart = ld.date.getTime() - yearDates[0].date.getTime()
        const ratio = msFromStart / (totalMs || 1)
        const angleDeg = -90 - ratio * 360 // Counter-clockwise
        
        const hdate = new HDate(ld.date)
        const month = hdate.getMonth()
        monthsPresent.add(month)

        const quad = getQuadrant(angleDeg)
        const item = { date: ld, inst, angleDeg, quad }
        allReadings.push(item)

        if (!readingsByMonth[month]) {
          readingsByMonth[month] = []
        }
        readingsByMonth[month].push(item)
      })
    })

    // Setup SVG
    const svgNS = 'http://www.w3.org/2000/svg'
    const svg = document.createElementNS(svgNS, 'svg')
    svg.setAttribute('width', '100%')
    svg.setAttribute('height', '100%')
    
    // Initial viewBox
    svg.setAttribute('viewBox', '0 0 500 500')
    svg.setAttribute('class', `zoom-${zoomState}`)
    wheelPane.appendChild(svg)

    const cx = 250
    const cy = 250
    const rCenter = 70
    const rReading = 125
    const rMonthInner = 170
    const rMonthOuter = 205

    const sortedMonths = Array.from(monthsPresent).sort((a, b) => {
      const firstReadingA = readingsByMonth[a][0].date.date.getTime()
      const firstReadingB = readingsByMonth[b][0].date.date.getTime()
      return firstReadingA - firstReadingB
    })

    const numMonths = sortedMonths.length
    const degPerMonth = 360 / numMonths

    const monthNamesHeb: Record<number, string> = {
      1: 'ניסן', 2: 'אייר', 3: 'סיון', 4: 'תמוז', 5: 'אב', 6: 'אלול',
      7: 'תשרי', 8: 'חשון', 9: 'כסלו', 10: 'טבת', 11: 'שבט', 12: 'אדר', 13: 'אדר ב׳'
    }

    // Zoom maps
    const zoomTargets = {
      full: { x: 0, y: 0, w: 500, h: 500 },
      q1: { x: 230, y: 50, w: 220, h: 220 },     // Top-Right
      q2: { x: 50, y: 50, w: 220, h: 220 },      // Top-Left
      q3: { x: 50, y: 230, w: 220, h: 220 },     // Bottom-Left
      q4: { x: 230, y: 230, w: 220, h: 220 }     // Bottom-Right
    }

    // Restore previous zoom instantly without animation
    if (zoomState !== 'full') {
      const t = zoomTargets[zoomState]
      svg.setAttribute('viewBox', `${t.x} ${t.y} ${t.w} ${t.h}`)
    }

    const triggerZoom = (targetState: 'full' | 'q1' | 'q2' | 'q3' | 'q4') => {
      if (zoomState === targetState) return
      zoomState = targetState
      
      // Update class on SVG for CSS transition of label opacities
      svg.setAttribute('class', `zoom-${zoomState}`)
      
      const t = zoomTargets[zoomState]
      animateViewBox(svg, t.x, t.y, t.w, t.h)
    }

    // Render month segments
    sortedMonths.forEach((month, index) => {
      const startAngle = -90 - index * degPerMonth
      const endAngle = -90 - (index + 1) * degPerMonth
      const midAngle = (startAngle + endAngle) / 2

      // Draw month annular sector
      const path = document.createElementNS(svgNS, 'path')
      path.setAttribute('d', describeAnnularSector(cx, cy, rMonthInner, rMonthOuter, startAngle, endAngle))
      path.setAttribute('class', 'wheel-month-arc')
      
      // Zoom to quadrant on month click
      path.addEventListener('click', (e) => {
        e.stopPropagation()
        const quad = getQuadrant(midAngle)
        triggerZoom(quad)
      })
      
      svg.appendChild(path)

      // Month label
      const midAngleRad = (midAngle * Math.PI) / 180
      const rText = (rMonthInner + rMonthOuter) / 2
      const tx = cx + rText * Math.cos(midAngleRad)
      const ty = cy + rText * Math.sin(midAngleRad)

      const text = document.createElementNS(svgNS, 'text')
      text.setAttribute('x', tx.toString())
      text.setAttribute('y', ty.toString())
      text.setAttribute('class', 'wheel-month-text')
      text.textContent = monthNamesHeb[month] || `Month ${month}`
      
      let rot = midAngle
      if (rot < -90 && rot > -270) {
        rot += 180
      }
      text.setAttribute('transform', `rotate(${rot}, ${tx}, ${ty})`)
      svg.appendChild(text)

      // Connectors
      const line = document.createElementNS(svgNS, 'line')
      const startRad = (startAngle * Math.PI) / 180
      line.setAttribute('x1', (cx + rCenter * Math.cos(startRad)).toString())
      line.setAttribute('y1', (cy + rCenter * Math.sin(startRad)).toString())
      line.setAttribute('x2', (cx + rMonthOuter * Math.cos(startRad)).toString())
      line.setAttribute('y2', (cy + rMonthOuter * Math.sin(startRad)).toString())
      line.setAttribute('class', 'wheel-connector-line')
      svg.appendChild(line)
    })

    // Draw readings as points & labels
    allReadings.forEach((reading) => {
      const angleRad = (reading.angleDeg * Math.PI) / 180
      const rx = cx + rReading * Math.cos(angleRad)
      const ry = cy + rReading * Math.sin(angleRad)

      const isSelected = selectedReading && selectedReading.date.id === reading.date.id && selectedReading.inst.id === reading.inst.id

      // 1. Draw reading node circle
      const dot = document.createElementNS(svgNS, 'circle')
      dot.setAttribute('cx', rx.toString())
      dot.setAttribute('cy', ry.toString())
      dot.setAttribute('r', '5')
      
      const isHoliday = !reading.inst.isParsha
      let className = 'wheel-reading-point'
      if (isHoliday) className += ' is-holiday'
      if (isSelected) className += ' is-selected'
      dot.setAttribute('class', className)

      // Tooltip
      const titleEl = document.createElementNS(svgNS, 'title')
      titleEl.textContent = `${cleanReadingTitle(reading.inst)} (${formatHebrewDateString(reading.date.date)})`
      dot.appendChild(titleEl)

      // Click node selects reading
      dot.addEventListener('click', (e) => {
        e.stopPropagation()
        selectedReading = reading
        
        // Ensure we are zoomed in to the quadrant of this reading so they see the label clearly
        triggerZoom(reading.quad)
        
        svg.querySelectorAll('.wheel-reading-point').forEach(d => d.classList.remove('is-selected'))
        dot.classList.add('is-selected')
        
        svg.querySelectorAll('.wheel-reading-label').forEach(l => l.classList.remove('is-selected'))
        const labelEl = svg.querySelector(`#label-${reading.date.id}-${reading.inst.id}`)
        if (labelEl) labelEl.classList.add('is-selected')

        showDetails(reading.date, reading.inst)
      })

      svg.appendChild(dot)

      // 2. Draw reading text label (visible on zoom)
      const rLabel = rReading - 14 // Place text slightly inside the dot orbit to stay away from month rings
      const lx = cx + rLabel * Math.cos(angleRad)
      const ly = cy + rLabel * Math.sin(angleRad)

      // Decide alignment to avoid overlapping center circle or outer month arcs
      // If on the right side of circle (cos > 0), text aligns 'start' (goes right, towards dot)
      // If on the left side of circle (cos < 0), text aligns 'end' (goes left, towards dot)
      const cos = Math.cos(angleRad)
      const textAnchor = cos > 0 ? 'end' : 'start' // Swap default to push text slightly towards center but aligned safely

      const label = document.createElementNS(svgNS, 'text')
      label.setAttribute('id', `label-${reading.date.id}-${reading.inst.id}`)
      label.setAttribute('x', lx.toString())
      label.setAttribute('y', ly.toString())
      
      let labelClass = `wheel-reading-label ${reading.quad}-label`
      if (isSelected) labelClass += ' is-selected'
      label.setAttribute('class', labelClass)
      
      // Push text anchor to prevent overlaying
      label.setAttribute('text-anchor', textAnchor)
      label.textContent = cleanReadingTitle(reading.inst)
      
      svg.appendChild(label)
    })

    // Center Circle (Reset zoom button)
    const centerGroup = document.createElementNS(svgNS, 'g')
    svg.appendChild(centerGroup)

    const centerCircle = document.createElementNS(svgNS, 'circle')
    centerCircle.setAttribute('cx', cx.toString())
    centerCircle.setAttribute('cy', cy.toString())
    centerCircle.setAttribute('r', rCenter.toString())
    centerCircle.setAttribute('fill', 'var(--paper-color, #fff)')
    centerCircle.setAttribute('stroke', 'var(--medium-accent-color, #ccc)')
    centerCircle.setAttribute('stroke-width', '1')
    centerCircle.setAttribute('class', 'wheel-center-circle')
    
    // Click center circle zooms back out
    centerCircle.addEventListener('click', (e) => {
      e.stopPropagation()
      triggerZoom('full')
    })
    centerGroup.appendChild(centerCircle)

    const centerText = document.createElementNS(svgNS, 'text')
    centerText.setAttribute('x', cx.toString())
    centerText.setAttribute('y', (cy - 10).toString())
    centerText.setAttribute('class', 'wheel-center-label')
    centerText.textContent = 'מחזור השנה'
    centerGroup.appendChild(centerText)

    const centerSubtext = document.createElementNS(svgNS, 'text')
    centerSubtext.setAttribute('x', cx.toString())
    centerSubtext.setAttribute('y', (cy + 15).toString())
    centerSubtext.setAttribute('class', 'wheel-center-sublabel')
    centerSubtext.textContent = `שנת ${currentHebrewYear}`
    centerGroup.appendChild(centerSubtext)

    // Details Pane rendering
    const showDetails = (ld: LeiningDate, inst: LeiningInstance) => {
      detailsPane.innerHTML = ''
      const details = document.createElement('div')
      details.style.display = 'flex'
      details.style.flexDirection = 'column'
      details.style.gap = '15px'

      const title = document.createElement('div')
      title.className = 'radial-details-title'
      title.textContent = cleanReadingTitle(inst)

      const hDate = new HDate(ld.date)
      const meta = document.createElement('div')
      meta.className = 'radial-details-meta'
      meta.innerHTML = `
        <span><strong>תאריך עברי:</strong> ${formatHebrewDateString(ld.date)} ${currentHebrewYear}</span>
        <span><strong>תאריך לועזי:</strong> ${formatEnglishDate(ld.date)}</span>
        <span><strong>קריאה בציבור:</strong> ${ld.title.he}</span>
        <span><strong>סוג קריאה:</strong> ${inst.isParsha ? 'פרשת השבוע' : 'מועד/חג'}</span>
      `

      const actions = document.createElement('div')
      actions.className = 'radial-details-actions'

      const shortcuts = getReadingShortcuts(inst)
      shortcuts.forEach((sc) => {
        const btn = document.createElement('a')
        btn.href = sc.url
        btn.className = `radial-action-btn ${sc.type !== LeiningRunType.Main ? 'mod-secondary' : ''}`
        btn.textContent = sc.label
        actions.appendChild(btn)
      })

      details.appendChild(title)
      details.appendChild(meta)
      details.appendChild(actions)
      detailsPane.appendChild(details)
    }

    const clearDetails = () => {
      detailsPane.innerHTML = '<div class="radial-details-placeholder">לחץ על אחת מהנקודות בגלגל כדי להציג פרטים קריאה</div>'
    }

    if (selectedReading) {
      showDetails(selectedReading.date, selectedReading.inst)
    } else {
      clearDetails()
    }
  }

  render()

  return {
    node: outerContainer,
    onMount: () => {
      console.log('Radial Cycle Mounted')
    },
    onDestroy: () => {
      styleNode.remove()
    }
  }
}
