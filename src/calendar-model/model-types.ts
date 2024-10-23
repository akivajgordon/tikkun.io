import { RefWithScroll, ScrollName } from '../ref.ts'

/**
 * Describes a single date that contains one or more leinings (in separate davenings).
 *
 * This is used as a container of leinings.
 * In the UI, it's only used directly in the picker.
 *
 * The following days can contain multiple leinings:
 *  - תשעה באב
 *  - יום כיפור
 *  - שמחת תורה
 *
 * We currently do not list שבת מנחה as a separate leining in the UI.
 */
export interface LeiningDate {
  /** The calendar date (including year) being described. */
  date: Date

  /** The URL-safe string (describing the date) that identifies this instance. */
  id: string

  /** The user-friendly title displayed in the picker UI. */
  title: string

  /** The ordered list of leinings on this date. */
  leinings: LeiningInstance[]
}

export function isLeiningDate(obj: unknown): obj is LeiningDate {
  if (typeof obj !== 'object' || !obj) return false
  const { date, leinings } = obj as LeiningDate
  return date instanceof Date && Array.isArray(leinings)
}

/**
 * The minyan that contains a leining.
 * The enum values are used in UI.
 */
export enum LeiningInstanceId {
  Shacharis = 'שחרית',
  Mincha = 'מנחה',
  Maariv = 'מעריב',
  Megillah = 'מגילה',
}

/**
 * Describes a single leining (during a single davening).
 * A single instance may contain multiple ספרי תורה, and possibly also a הפטרה.
 */
export interface LeiningInstance {
  /** The date that this is leined on. */
  date: LeiningDate

  /** The minyan that this is leined in. */
  id: LeiningInstanceId

  /**
   * True if this is a regular פרשת השבוע.
   * If true, the ספר תורה should scroll through all of חומש.
   */
  isParsha: boolean

  /** The near-contiguous runs within this ספר.  This will usually have exactly 1 entry. */
  runs: LeiningRun[]
}

export function isLeiningInstance(obj: unknown): obj is LeiningInstance {
  if (typeof obj !== 'object' || !obj) return false
  const { date, id, runs } = obj as LeiningInstance
  return (
    typeof date === 'object' && typeof id === 'string' && Array.isArray(runs)
  )
}

/**
 * The עלייה or context that a leining run is leined as.
 * The enum values are used in UI.
 */
export enum LeiningRunType {
  /** The main group of 3-8 עלייות */
  Main = 'Main',
  /** The 7th עלייה when leined from a separate ספר תורה (either חנוכה or ארבע פרשיות) */
  LastAliyah = 'שביעי',
  /** The מפטיר, when not leined from the end of the פרשה. */
  Maftir = 'מפטיר',
  Haftarah = 'הפטרה',
  Megillah = 'מגילה',
}

/** A near-contiguous group of עליות from a single ספר תורה (or קלף). */
export interface LeiningRun {
  /** The leining containing this run. */
  leining: LeiningInstance

  type: LeiningRunType

  /** The URL-safe string that uniquely identifies this instance, including date, minyan, and index. */
  id: string

  /** The ספר being leined from (either `torah` or a נביא). */
  scroll: ScrollName

  /**
   * The עליות contained within this run.
   *  - For `Main`, this can have any length between 3 and 8.
   *  - For `Haftarah`, this can have multiple entries when there are skips.
   *  - For all other types, this will have exactly 1 entry.
   * The entries may overlap (eg, ראש חודש), or have gaps (eg, תענית).
   */
  aliyot: LeiningAliyah[]
}

export function isLeiningRun(obj: unknown): obj is LeiningRun {
  if (typeof obj !== 'object' || !obj) return false
  const { leining, type, aliyot } = obj as LeiningRun
  return (
    typeof leining === 'object' &&
    typeof type === 'string' &&
    Array.isArray(aliyot)
  )
}

export interface LeiningAliyah {
  /**
   * The index of this Aliyah (1 through 7).
   * Unset in leinings that consist of one Aliyah (הפטרה or מגילה).
   */
  index?: number | 'Maftir'
  start: RefWithScroll
  end: RefWithScroll
}
