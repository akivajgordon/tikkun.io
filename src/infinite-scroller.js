const insertBefore = (parent, child) => {
  parent.insertAdjacentElement('afterbegin', child)
}

const insertAfter = (parent, child) => {
  parent.insertAdjacentElement('beforeend', child)
}

const generateText = () => {
  const str = 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ilorem Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quae labore rerum corporis, rem quia, eius earum, in nihil aperiam molestiae dolor blanditiis placeat architecto! Voluptatem at consectetur deserunt delectus corrupti.lorem Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corporis odio aut totam. Architecto fuga laudantium nesciunt dolores natus repellat nisi. Possimus expedita quam, maiores quaerat adipisci deserunt itaque impedit commodi? Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sunt, quidem. Voluptates, officiis veniam. Reiciendis veritatis ex porro voluptatum unde neque recusandae saepe fugit voluptates ad labore, quidem eum, accusamus tempore'

  if (Math.random() < 0.5) return str

  return str + str
}

const makeBlock = () => {
  const block = document.createElement('div')
  block.innerHTML = generateText()

  block.classList.add('block')

  return block
}

const delay = (timeout, callback) => new Promise((resolve, reject) => {
  setTimeout(() => resolve(callback()), timeout)
})

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

const loadContent = () => oneAtATime(() => delay(1000, makeBlock))

// const container = document.querySelector('.infinite-scroll-view')

// const InfiniteScroller = ({
const InfiniteScroller = {
  new: ({ container }) => ({
    attach: () => container.addEventListener('scroll', (e) => {
      console.log('yo')
      const scrollView = e.target

      const hiddenAboveHeight = scrollView.scrollTop
      const height = scrollView.clientHeight

      const hiddenBelowHeight = scrollView.scrollHeight - (scrollView.clientHeight + scrollView.scrollTop)

      if (hiddenAboveHeight < 3 * height) {
        loadContent()
          .then((content) => {
            const belowHeight = scrollView.scrollHeight - scrollView.scrollTop

            insertBefore(container, content)
            scrollView.scrollTop = scrollView.scrollHeight - belowHeight
          })
      } else if (hiddenBelowHeight < height) {
        loadContent()
          .then((content) => {
            insertAfter(container, content)
          })
      }
    })
  })
}

module.exports = InfiniteScroller
