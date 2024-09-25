type Schedule = {
  label: string
  datetime: string
  date: string
}[]

let _schedule: Schedule

export default {
  fetch: async () => {
    if (!_schedule) {
      _schedule = (await import('./data/schedule.json')).default
    }

    return _schedule
  },
}
