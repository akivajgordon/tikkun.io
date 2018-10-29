import utils from './utils'

const { htmlToElement } = utils

const setSelected = (list, adjustSelected) => {
  const items = [...list.querySelectorAll('[data-target-class="list-item"]')]

  const selectedIndex = Math.max(items.findIndex(item => item.getAttribute('data-selected') === 'true'), 0)

  const selected = items[selectedIndex]

  selected.removeAttribute('data-selected')

  const nextIndex = (adjustSelected(selectedIndex) + items.length) % items.length

  items[nextIndex].setAttribute('data-selected', 'true')
}

export { setSelected }

const getSelected = (list) => list.querySelector('[data-target-class="list-item"][data-selected="true"]')

export { getSelected }

const SelectList = (items, el, onSelect) => {
  const list = htmlToElement(`
    <ol class="list"></ol>
  `)

  items.forEach(item => {
    const listItem = htmlToElement('<li class="list-item" data-target-class="list-item"></li>')
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
