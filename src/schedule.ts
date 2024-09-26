import { HebrewCalendar } from '@hebcal/core'

type Schedule = {
  label: string
  datetime: Date
  date: string
}[]

let _schedule: Schedule

export function fetch() {
  return (_schedule ??= calculateSchedule())
}

function calculateSchedule(): Schedule {
  const events = HebrewCalendar.calendar({
    year: new Date().getFullYear() - 1,
    numYears: 2,
    sedrot: true,
    noHolidays: true,
  })
  return events.map((event) => ({
    date: dateFormat.format(event.date.greg()),
    datetime: event.date.greg(),
    label: event.render('he-x-NoNikud').replace('פרשת ', ''),
  }))
}

const dateFormat = new Intl.DateTimeFormat(undefined, {
  month: 'long',
  day: 'numeric',
})
