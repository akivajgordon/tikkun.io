let alreadyInFlight = false
const oneAtATime = (promise) => {
  if (alreadyInFlight) return Promise.resolve()
  alreadyInFlight = true
  return promise()
    .then((val) => {
      alreadyInFlight = false
      return val
    })
}

const InfiniteScroller = {
  new: ({ container, fetchPreviousContent, fetchNextContent }) => ({
    attach: () => container.addEventListener('scroll', (e) => {
      const scrollView = e.target

      const hiddenAboveHeight = scrollView.scrollTop
      const height = scrollView.clientHeight

      const hiddenBelowHeight = scrollView.scrollHeight - (scrollView.clientHeight + scrollView.scrollTop)

      if (hiddenAboveHeight < 0.5 * height) {
        oneAtATime(() => fetchPreviousContent.fetch())
          .then((content) => {
            if (!content) return

            const belowHeight = scrollView.scrollHeight - scrollView.scrollTop

            fetchPreviousContent.render(container, content)

            scrollView.scrollTop = scrollView.scrollHeight - belowHeight
          })
      } else if (hiddenBelowHeight < 0.5 * height) {
        oneAtATime(() => fetchNextContent.fetch())
          .then((content) => {
            if (content) fetchNextContent.render(container, content)
          })
      }
    })
  })
}

module.exports = InfiniteScroller
