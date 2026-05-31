import { LeiningGenerator } from '../../../calendar-model/generator.ts'
import { HDate } from '@hebcal/hdate'
import { LeiningDate, LeiningInstance, LeiningRun, LeiningInstanceId, LeiningRunType } from '../../../calendar-model/model-types.ts'
import { getReadingShortcuts, formatEnglishDate, cleanReadingTitle, formatHebrewDateString } from '../utils.ts'

export default (generator: LeiningGenerator) => {
  const styleNode = document.createElement('style')
  styleNode.textContent = `
    .terminal-container {
      direction: ltr; /* Terminal is traditionally LTR, but we will print Hebrew text inside it nicely */
      font-family: 'Courier New', Courier, monospace;
      background: #0c0c0c;
      color: #00ff00;
      border: 2px solid #333;
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
      padding: 20px;
      height: calc(100vh - var(--header-height) - 120px);
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }
    
    .terminal-screen {
      flex: 1;
      overflow-y: auto;
      margin-bottom: 15px;
      padding-right: 10px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .terminal-line {
      line-height: 1.4;
      white-space: pre-wrap;
      word-break: break-all;
      font-size: 13px;
    }
    
    .terminal-line.mod-input {
      color: #00ffff;
      font-weight: bold;
    }
    
    .terminal-line.mod-error {
      color: #ff3333;
    }
    
    .terminal-line.mod-success {
      color: #ffff00;
    }
    
    .terminal-line.mod-header {
      color: #ffffff;
      border-bottom: 1px dashed #333;
      padding-bottom: 4px;
      margin-bottom: 4px;
    }
    
    .terminal-link {
      color: #00ff00;
      text-decoration: underline;
      cursor: pointer;
      font-weight: bold;
    }
    .terminal-link:hover {
      color: #ffffff;
      background: #003300;
    }
    
    .terminal-input-line {
      display: flex;
      align-items: center;
      gap: 8px;
      border-top: 1px solid #222;
      padding-top: 10px;
    }
    
    .terminal-prompt {
      color: #00ffff;
      font-weight: bold;
      font-size: 14px;
    }
    
    .terminal-input {
      flex: 1;
      background: transparent;
      border: none;
      color: #00ff00;
      font-family: inherit;
      font-size: 14px;
      outline: none;
    }
    
    /* Control bar for year */
    .terminal-year-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #1a1a1a;
      border: 1px solid #333;
      padding: 6px 15px;
      border-radius: 6px;
      margin-bottom: 12px;
      direction: ltr;
    }
    .terminal-year-btn {
      padding: 3px 8px;
      border: 1px solid #444;
      border-radius: 4px;
      background: #222;
      color: #00ff00;
      cursor: pointer;
      font-weight: bold;
      font-family: inherit;
      font-size: 11px;
    }
    .terminal-year-btn:hover {
      background: #333;
      color: #fff;
    }
    .terminal-year-title {
      font-weight: bold;
      font-size: 12px;
      color: #888;
    }
    
    /* RTL helper inside terminal */
    .terminal-rtl {
      direction: rtl;
      text-align: right;
      display: inline-block;
      width: 100%;
    }
  `
  document.head.appendChild(styleNode)

  const outerContainer = document.createElement('div')
  outerContainer.className = 'parsha-picker'
  outerContainer.style.display = 'flex'
  outerContainer.style.flexDirection = 'column'

  let currentHebrewYear = new HDate().getFullYear()
  let commandHistory: string[] = []
  let historyIndex = -1

  const render = () => {
    outerContainer.innerHTML = ''

    // Year Control Bar
    const yearBar = document.createElement('div')
    yearBar.className = 'terminal-year-bar'

    const prevBtn = document.createElement('button')
    prevBtn.className = 'terminal-year-btn'
    prevBtn.textContent = `PREV_YEAR (${currentHebrewYear - 1})`
    prevBtn.addEventListener('click', () => {
      currentHebrewYear--
      log(`[SYS] Calibrating terminal to year ${currentHebrewYear}...`, 'success')
      render()
    })

    const yearTitle = document.createElement('span')
    yearTitle.className = 'terminal-year-title'
    yearTitle.textContent = `SYS_STATUS: ACTIVE | YEAR: ${currentHebrewYear}`

    const nextBtn = document.createElement('button')
    nextBtn.className = 'terminal-year-btn'
    nextBtn.textContent = `NEXT_YEAR (${currentHebrewYear + 1})`
    nextBtn.addEventListener('click', () => {
      currentHebrewYear++
      log(`[SYS] Calibrating terminal to year ${currentHebrewYear}...`, 'success')
      render()
    })

    yearBar.appendChild(prevBtn)
    yearBar.appendChild(yearTitle)
    yearBar.appendChild(nextBtn)
    outerContainer.appendChild(yearBar)

    // Terminal Box
    const termContainer = document.createElement('div')
    termContainer.className = 'terminal-container'

    const screen = document.createElement('div')
    screen.className = 'terminal-screen'

    const inputLine = document.createElement('div')
    inputLine.className = 'terminal-input-line'
    inputLine.innerHTML = `
      <span class="terminal-prompt">guest@tikkun:~$</span>
      <input type="text" class="terminal-input" autofocus autocomplete="off" spellcheck="false">
    `

    termContainer.appendChild(screen)
    termContainer.appendChild(inputLine)
    outerContainer.appendChild(termContainer)

    const input = inputLine.querySelector('.terminal-input') as HTMLInputElement

    // Helper to print to screen
    const log = (text: string, type: 'input' | 'error' | 'success' | 'header' | 'normal' = 'normal', isRtl = false) => {
      const line = document.createElement('div')
      line.className = `terminal-line mod-${type}`
      if (isRtl) {
        line.innerHTML = `<span class="terminal-rtl">${text}</span>`
      } else {
        line.innerHTML = text
      }
      screen.appendChild(line)
      screen.scrollTop = screen.scrollHeight
    }

    // Welcome Message
    log('================================================================', 'header')
    log(' TIKKUN.IO PORTION SELECTOR TERMINAL v9.0', 'header')
    log(` CURRENT YEAR SATELLITE: HEBREW_CALENDAR_${currentHebrewYear}`, 'header')
    log(' TYPE "help" OR CLICK GREEN LINKS TO BROWSE COMMANDS.', 'header')
    log('================================================================', 'header')

    // Database retrieval
    const getYearData = () => generator.forHebrewYear(currentHebrewYear)

    const bookNamesHeb = ['בראשית', 'שמות', 'ויקרא', 'במדבר', 'דברים']
    const monthNamesHeb: Record<number, string> = {
      7: 'תשרי', 8: 'חשון', 9: 'כסלו', 10: 'טבת', 11: 'שבט', 12: 'אדר', 13: 'אדר ב׳',
      1: 'ניסן', 2: 'אייר', 3: 'סיון', 4: 'תמוז', 5: 'אב', 6: 'אלול'
    }
    const seasonNames = ['ימים נוראים', 'סוכות ושמיני עצרת', 'חנוכה ופורים', 'פסח', 'שבועות', 'תעניות', 'ראש חודש']

    // Execute command logic
    const executeCommand = (rawCmd: string) => {
      const cmd = rawCmd.trim()
      if (!cmd) return

      log(`guest@tikkun:~$ ${cmd}`, 'input')
      commandHistory.push(cmd)
      historyIndex = commandHistory.length

      const args = cmd.split(' ')
      const action = args[0].toLowerCase()

      if (action === 'help') {
        log('AVAILABLE COMMANDS:')
        log('  <span class="terminal-link" data-cmd="help">help</span>                      - Show this screen')
        log('  <span class="terminal-link" data-cmd="ls">ls</span>                        - List main root catalogs')
        log('  <span class="terminal-link" data-cmd="ls torah">ls torah</span>                  - List the Five Books of Moses')
        log('  <span class="terminal-link" data-cmd="ls book 1">ls book &lt;1-5/name&gt;</span>       - List portions inside a specific book')
        log('  <span class="terminal-link" data-cmd="ls holidays">ls holidays</span>               - List holiday seasons')
        log('  <span class="terminal-link" data-cmd="ls season פסח">ls season &lt;name&gt;</span>          - List readings in a holiday season')
        log('  <span class="terminal-link" data-cmd="ls megillot">ls megillot</span>               - List Megillot scroll readings')
        log('  <span class="terminal-link" data-cmd="search בראשית">search &lt;query&gt;</span>            - Find parshiot or holidays matching query')
        log('  <span class="terminal-link" data-cmd="show בראשית">show &lt;name&gt;</span>               - Print metadata details of a portion')
        log('  <span class="terminal-link" data-cmd="clear">clear</span>                     - Clear the screen terminal console')
      } else if (action === 'clear' || action === 'cls') {
        screen.innerHTML = ''
      } else if (action === 'ls' || action === 'list') {
        const sub = args[1]?.toLowerCase()
        if (!sub) {
          log('ROOT CATALOGS:')
          log('  [1] <span class="terminal-link" data-cmd="ls torah">Torah (חומשי תורה)</span>')
          log('  [2] <span class="terminal-link" data-cmd="ls holidays">Holidays & Seasons (מועדים וחגים)</span>')
          log('  [3] <span class="terminal-link" data-cmd="ls megillot">Megillot Scrolls (מגילות המועדים)</span>')
        } else if (sub === 'torah') {
          log('THE FIVE BOOKS OF MOSES:')
          bookNamesHeb.forEach((bName, i) => {
            log(`  [${i + 1}] <span class="terminal-link" data-cmd="ls book ${i + 1}">${bName}</span>`)
          })
        } else if (sub === 'book') {
          const bookQuery = args.slice(2).join(' ')
          if (!bookQuery) {
            log('[ERR] Specify book number (1-5) or name (e.g., "ls book 1" or "ls book בראשית")', 'error')
            return
          }

          let bookNum = parseInt(bookQuery)
          if (isNaN(bookNum)) {
            bookNum = bookNamesHeb.indexOf(bookQuery) + 1
          }

          if (bookNum < 1 || bookNum > 5) {
            log(`[ERR] Book "${bookQuery}" not found. Choose 1-5 or names: ${bookNamesHeb.join(', ')}`, 'error')
            return
          }

          log(`PORTIONS INSIDE ${bookNamesHeb[bookNum - 1]}:`)
          const yearDates = getYearData()
          const portions: string[] = []

          yearDates.forEach((ld) => {
            ld.leinings.forEach((inst) => {
              if (inst.isParsha) {
                const b = inst.runs[0].aliyot[0].start.b
                if (b === bookNum) {
                  const title = cleanReadingTitle(inst)
                  if (!portions.includes(title)) {
                    portions.push(title)
                    log(`  - <span class="terminal-link" data-cmd="show ${title}">${title}</span> (${formatHebrewDateString(ld.date)})`)
                  }
                }
              }
            })
          })
        } else if (sub === 'holidays') {
          log('HOLIDAY SEASONS:')
          seasonNames.forEach((sName) => {
            log(`  - <span class="terminal-link" data-cmd="ls season ${sName}">${sName}</span>`)
          })
        } else if (sub === 'season') {
          const seasonQuery = args.slice(2).join(' ')
          if (!seasonQuery || !seasonNames.includes(seasonQuery)) {
            log(`[ERR] Specify valid season: ${seasonNames.join(', ')}`, 'error')
            return
          }

          log(`READINGS IN "${seasonQuery}":`)
          const yearDates = getYearData()
          const readings: string[] = []

          yearDates.forEach((ld) => {
            ld.leinings.forEach((inst) => {
              if (!inst.isParsha && inst.id !== LeiningInstanceId.Megillah) {
                const name = inst.date.title.he
                let match = false
                if (seasonQuery === 'ימים נוראים' && (name.includes('ראש השנה') || name.includes('כיפור') || name.includes('כפור'))) match = true
                else if (seasonQuery === 'סוכות ושמיני עצרת' && (name.includes('סוכות') || name.includes('שמיני עצרת') || name.includes('שמחת תורה') || name.includes('הושענא רבא'))) match = true
                else if (seasonQuery === 'חנוכה ופורים' && (name.includes('חנוכה') || name.includes('פורים') || name.includes('שבת שקלים') || name.includes('שבת זכור'))) match = true
                else if (seasonQuery === 'פסח' && (name.includes('פסח') || name.includes('שבת הגדול') || name.includes('שבת פרה') || name.includes('שבת החודש'))) match = true
                else if (seasonQuery === 'שבועות' && name.includes('שבועות')) match = true
                else if (seasonQuery === 'תעניות' && (name.includes('תענית') || name.includes('עשרה בטבת') || name.includes('שבעה עשר') || name.includes('איכה') || name.includes('צום') || name.includes('תשעה באב'))) match = true
                else if (seasonQuery === 'ראש חודש' && name.includes('ראש חודש')) match = true

                if (match) {
                  const title = cleanReadingTitle(inst)
                  const key = `${title}:${ld.id}`
                  if (!readings.includes(key)) {
                    readings.push(key)
                    log(`  - <span class="terminal-link" data-cmd="show ${title}">${title}</span> (${formatHebrewDateString(ld.date)})`)
                  }
                }
              }
            })
          })
        } else if (sub === 'megillot') {
          log('MEGILLOT SCROLL READINGS:')
          const yearDates = getYearData()
          const megillots: string[] = []
          yearDates.forEach((ld) => {
            ld.leinings.forEach((inst) => {
              if (inst.id === LeiningInstanceId.Megillah) {
                const title = cleanReadingTitle(inst)
                megillots.push(title)
                log(`  - <span class="terminal-link" data-cmd="show ${title}">${title}</span> (${formatHebrewDateString(ld.date)})`)
              }
            })
          })
          if (megillots.length === 0) {
            log('  No Megillah readings found for this year.')
          }
        } else {
          log(`[ERR] Unknown catalog: "${sub}". Use "ls" to see catalogs.`, 'error')
        }
      } else if (action === 'search' || action === 'find') {
        const query = args.slice(1).join(' ')
        if (!query) {
          log('[ERR] Specify search query (e.g., "search בראשית" or "find Pesach")', 'error')
          return
        }

        log(`SEARCH RESULTS FOR "${query}":`)
        const yearDates = getYearData()
        let count = 0

        yearDates.forEach((ld) => {
          ld.leinings.forEach((inst) => {
            const title = cleanReadingTitle(inst)
            const titleEn = ld.title.en
            const dateHeb = formatHebrewDateString(ld.date)
            const dateEng = formatEnglishDate(ld.date)

            if (
              title.includes(query) ||
              titleEn.toLowerCase().includes(query.toLowerCase()) ||
              dateHeb.includes(query) ||
              dateEng.toLowerCase().includes(query.toLowerCase())
            ) {
              count++
              log(`  [${count}] <span class="terminal-link" data-cmd="show ${title}">${title}</span>`)
              log(`      Type: ${inst.isParsha ? 'Torah Portion' : 'Holiday'} | Date: ${dateHeb} (${dateEng})`)
            }
          })
        })

        if (count === 0) {
          log('  No matches found. Try another term.')
        }
      } else if (action === 'show') {
        const portionQuery = args.slice(1).join(' ')
        if (!portionQuery) {
          log('[ERR] Specify portion or holiday name (e.g., "show בראשית")', 'error')
          return
        }

        const yearDates = getYearData()
        let found: { date: LeiningDate; inst: LeiningInstance } | null = null

        for (const ld of yearDates) {
          for (const inst of ld.leinings) {
            const title = cleanReadingTitle(inst)
            if (title.toLowerCase() === portionQuery.toLowerCase()) {
              found = { date: ld, inst }
              break
            }
          }
          if (found) break
        }

        if (!found) {
          log(`[ERR] Portion or reading "${portionQuery}" not found in year ${currentHebrewYear}.`, 'error')
          return
        }

        const { date, inst } = found
        log(`PORTION DETAILS: ${cleanReadingTitle(inst)}`, 'header')
        log(`  Hebrew Date:   ${formatHebrewDateString(date.date)} ${currentHebrewYear}`)
        log(`  Gregorian:     ${formatEnglishDate(date.date)}`)
        log(`  Category:      ${inst.isParsha ? 'Torah Book Section' : 'Holiday Leining'}`)
        log(`  Leining Title: ${date.title.he}`)
        log('----------------------------------------------------------------')
        log('SELECT SHORTCUT JUMPS:')

        const shortcuts = getReadingShortcuts(inst)
        shortcuts.forEach((sc) => {
          log(`  - <a href="${sc.url}" style="color:#ffff00; text-decoration:underline;">[JUMP TO ${sc.label.toUpperCase()}]</a>`)
        })
      } else {
        log(`[ERR] Command not recognized: "${action}". Type "help" for options.`, 'error')
      }
    }

    // Listeners for terminal inputs
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = input.value
        input.value = ''
        executeCommand(val)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (commandHistory.length > 0 && historyIndex > 0) {
          historyIndex--
          input.value = commandHistory[historyIndex]
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
          historyIndex++
          input.value = commandHistory[historyIndex]
        } else {
          historyIndex = commandHistory.length
          input.value = ''
        }
      }
    })

    // Click on links inside screen
    screen.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if (target.classList.contains('terminal-link')) {
        const cmd = target.getAttribute('data-cmd')
        if (cmd) {
          executeCommand(cmd)
        }
      }
    })

    // Auto-focus input on terminal shell click
    termContainer.addEventListener('click', () => {
      input.focus()
    })
  }

  render()

  return {
    node: outerContainer,
    onMount: () => {
      console.log('Terminal HUD Mounted')
    },
    onDestroy: () => {
      styleNode.remove()
    }
  }
}
