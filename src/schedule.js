let _schedule

export default {
  fetch: async () => {
    if (!_schedule) {
      const res = await fetch('/data/schedule.json')
      _schedule = await res.json()
    }

    return _schedule
  },
}
