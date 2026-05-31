import { LeiningInstance, LeiningRun } from '../../calendar-model/model-types.ts'
import { LeiningRunType, LeiningInstanceId } from '../../calendar-model/model-types.ts'
import { Locale } from '@hebcal/hdate'
import { HDate } from '@hebcal/hdate'
import { toTitleCase } from '../../calendar-model/hebcal-conversions.ts'

export interface ReadingShortcut {
  label: string
  url: string
  type: LeiningRunType
}

const HEBREW_MONTHS_MAP: Record<string, string> = {
  'Tishrei': 'תשרי',
  'Cheshvan': 'חשוון',
  'Kislev': 'כסלו',
  'Tevet': 'טבת',
  'Sh\'vat': 'שבט',
  'Shvat': 'שבט',
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

/** Gets the Hebrew month name translation. */
export function getHebrewMonthName(englishMonthName: string): string {
  return HEBREW_MONTHS_MAP[englishMonthName] ?? englishMonthName
}

/** Formats a Gregorian Date or HDate into a clean traditional Hebrew date string (e.g., "כ״ה בתשרי"). */
export function formatHebrewDateString(date: Date | HDate): string {
  const hDate = date instanceof HDate ? date : new HDate(date)
  return `${hDate.getDate()} ב${getHebrewMonthName(hDate.getMonthName())}`
}

/** Helper to get shortcuts (Main, Maftir, Haftara, Megillah) for a leining instance. */
export function getReadingShortcuts(instance: LeiningInstance): ReadingShortcut[] {
  const shortcuts: ReadingShortcut[] = []
  
  for (const run of instance.runs) {
    const url = `#/run/${run.id}`
    if (run.type === LeiningRunType.Main) {
      shortcuts.push({ label: 'קריאה', url, type: run.type })
    } else if (run.type === LeiningRunType.Maftir) {
      shortcuts.push({ label: 'מפטיר', url, type: run.type })
    } else if (run.type === LeiningRunType.Haftarah) {
      shortcuts.push({ label: 'הפטרה', url, type: run.type })
    } else if (run.type === LeiningRunType.Megillah) {
      shortcuts.push({ label: 'מגילה', url, type: run.type })
    }
  }
  
  return shortcuts
}

const englishDateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric'
})

const englishShortDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric'
})

/** Formats a standard JS Date into a clean English string. */
export function formatEnglishDate(date: Date, short = false): string {
  return short ? englishShortDateFormatter.format(date) : englishDateFormatter.format(date)
}

/** Formats a date title or instance name in a clean way. */
export function cleanReadingTitle(instance: LeiningInstance): string {
  if (instance.id === LeiningInstanceId.Megillah) {
    return Locale.gettext(toTitleCase(instance.runs[0].scroll), 'he-x-nonikud')
  }

  let title = instance.date.title.he.replace('פרשת ', '')
  if (instance.id !== LeiningInstanceId.Shacharis) {
    title += ` (${instance.id === LeiningInstanceId.Mincha ? 'מנחה' : 'ערבית'})`
  }
  return title
}
