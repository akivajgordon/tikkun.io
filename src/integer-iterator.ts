export default {
  new: ({ startingAt }: { startingAt: number }) => {
    let previousCount = 0
    let nextCount = 0

    return {
      previous: () => {
        previousCount += 1
        return startingAt - previousCount
      },
      next: () => {
        nextCount += 1
        return startingAt + nextCount
      },
    }
  },
}
