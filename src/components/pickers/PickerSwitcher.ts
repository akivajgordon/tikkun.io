import { LeiningGenerator } from '../../calendar-model/generator.ts'
import OriginalPicker from '../ParshaPicker.ts'
import PickerCollapsible from './collapsible-list/ParshaPickerCollapsible.ts'
import PickerTimeline from './timeline-flow/ParshaPickerTimeline.ts'
import PickerHUD from './command-palette/ParshaPickerHUD.ts'
import PickerMap from './chumash-map/ParshaPickerMap.ts'
import PickerCalendar from './calendar-grid/ParshaPickerCalendar.ts'
import PickerColumns from './miller-columns/ParshaPickerColumns.ts'

export type PickerVersion = 'original' | 'collapsible' | 'timeline' | 'hud' | 'chumash-map' | 'calendar' | 'columns'

const PICKER_VERSIONS: { id: PickerVersion; name: string; factory: typeof OriginalPicker }[] = [
  { id: 'original', name: 'Original', factory: OriginalPicker },
  { id: 'collapsible', name: 'V1: Collapsible List', factory: PickerCollapsible },
  { id: 'timeline', name: 'V2: Timeline Flow', factory: PickerTimeline },
  { id: 'hud', name: 'V3: Command Palette', factory: PickerHUD },
  { id: 'chumash-map', name: 'V4: Chumash Map', factory: PickerMap },
  { id: 'calendar', name: 'V5: Calendar Grid', factory: PickerCalendar },
  { id: 'columns', name: 'V6: Columns Cascade', factory: PickerColumns }
]

export class PickerSwitcher {
  private activeVersion: PickerVersion = 'original'
  private onSwitchCallback: (() => void) | null = null

  constructor() {
    const saved = localStorage.getItem('selected-picker-version') as PickerVersion
    if (saved && PICKER_VERSIONS.some((p) => p.id === saved)) {
      this.activeVersion = saved
    }
  }

  getActiveVersion(): PickerVersion {
    return this.activeVersion
  }

  getActiveFactory(): typeof OriginalPicker {
    const p = PICKER_VERSIONS.find((pv) => pv.id === this.activeVersion)
    return p ? p.factory : OriginalPicker
  }

  onSwitch(callback: () => void) {
    this.onSwitchCallback = callback
  }

  renderBar(): HTMLElement {
    const bar = document.createElement('div')
    bar.className = 'picker-switcher-bar'
    bar.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 8px;
      padding: 10px 15px;
      background: var(--paper-color, #fff);
      border-bottom: 1px solid var(--medium-accent-color, #ccc);
      position: sticky;
      top: 0;
      z-index: 10000;
      direction: ltr;
      font-family: sans-serif;
    `

    const title = document.createElement('span')
    title.textContent = 'Picker Design:'
    title.style.cssText = `
      font-weight: bold;
      font-size: 13px;
      margin-right: 5px;
      color: var(--text-color, #333);
    `
    bar.appendChild(title)

    PICKER_VERSIONS.forEach((v) => {
      const btn = document.createElement('button')
      btn.textContent = v.name
      btn.style.cssText = `
        padding: 5px 10px;
        border: 1px solid var(--heavy-accent-color, #999);
        background: ${this.activeVersion === v.id ? '#0b57d0' : 'transparent'};
        color: ${this.activeVersion === v.id ? '#fff' : 'var(--text-color, #333)'};
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        font-weight: ${this.activeVersion === v.id ? 'bold' : 'normal'};
        transition: all 0.2s;
      `

      btn.addEventListener('click', () => {
        if (this.activeVersion === v.id) return
        this.activeVersion = v.id
        localStorage.setItem('selected-picker-version', v.id)

        // Refresh buttons
        bar.querySelectorAll('button').forEach((b, idx) => {
          const active = PICKER_VERSIONS[idx].id === v.id
          b.style.background = active ? '#0b57d0' : 'transparent'
          b.style.color = active ? '#fff' : 'var(--text-color, #333)'
          b.style.fontWeight = active ? 'bold' : 'normal'
        })

        if (this.onSwitchCallback) {
          this.onSwitchCallback()
        }
      })

      bar.appendChild(btn)
    })

    return bar
  }
}
