let alreadyInFlight = false
const oneAtATime = async (promise: () => Promise<unknown>) => {
  if (alreadyInFlight) return Promise.resolve()
  alreadyInFlight = true
  const val = await promise()
  alreadyInFlight = false
  return val
}

interface Fetcher<T> {
  fetch: () => Promise<T>
  render: (content: T) => void
}

const InfiniteScroller = {
  new: <T>({
    container,
    fetchPreviousContent,
    fetchNextContent,
  }: {
    container: HTMLElement
    fetchPreviousContent: Fetcher<T>
    fetchNextContent: Fetcher<T>
  }) => ({
    attach: () =>
      container.addEventListener('scroll', () => {
        const scrollView = container

        const hiddenAboveHeight = scrollView.scrollTop
        const visibleHeight = scrollView.clientHeight

        const hiddenBelowHeight =
          scrollView.scrollHeight -
          (scrollView.clientHeight + scrollView.scrollTop)

        if (hiddenAboveHeight < 0.5 * visibleHeight) {
          oneAtATime(() =>
            fetchPreviousContent.fetch().then((fetched) => {
              if (!fetched) return

              const belowHeight = scrollView.scrollHeight - scrollView.scrollTop

              fetchPreviousContent.render(fetched)

              scrollView.scrollTop = scrollView.scrollHeight - belowHeight
            })
          )
        } else if (hiddenBelowHeight < 0.5 * visibleHeight) {
          oneAtATime(() =>
            fetchNextContent.fetch().then((fetched) => {
              if (fetched) fetchNextContent.render(fetched)
            })
          )
        }
      }),
  }),
}

export default InfiniteScroller
