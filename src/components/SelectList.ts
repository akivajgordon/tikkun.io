import utils from './utils.ts'

const { htmlToElement } = utils

const setSelected = (
  list: Element,
  adjustSelected: (index: number) => number,
) => {
  const items = [...list.querySelectorAll('[data-target-class="list-item"]')]

  const selectedIndex = Math.max(
    items.findIndex((item) => item.getAttribute('data-selected') === 'true'),
    0,
  )

  const selected = items[selectedIndex]

  selected.removeAttribute('data-selected')

  const nextIndex =
    (adjustSelected(selectedIndex) + items.length) % items.length

  items[nextIndex].setAttribute('data-selected', 'true')
}

export { setSelected }

const getSelected = (list: Element) =>
  list.querySelector('[data-target-class="list-item"][data-selected="true"]')

export { getSelected }

const SelectList = (
  items: Element[],
  _el: Element,
  onSelect: (el: ChildNode) => void,
) => {
  const list = htmlToElement(`
    <ol class="list"></ol>
  `)

  items.forEach((item) => {
    const listItem = htmlToElement(
      '<li class="list-item" data-target-class="list-item"></li>',
    )
    listItem.appendChild(item)
    listItem.addEventListener('click', () => {
      onSelect(listItem)
    })
    list.appendChild(listItem)
  })

  list
    .querySelector('[data-target-class="list-item"]')
    .setAttribute('data-selected', 'true')

  return list
}

export default SelectList
