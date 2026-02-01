import utils from './utils'

const { htmlToElement } = utils

const setSelected = (list, adjustSelected) => {
  const items = [...list.querySelectorAll('[data-target-class="list-item"]')]

  const selectedIndex = Math.max(items.findIndex(item => item.getAttribute('data-selected') === 'true'), 0)

  const selected = items[selectedIndex]

  selected.removeAttribute('data-selected')
  selected.setAttribute('aria-selected', 'false')

  const nextIndex = (adjustSelected(selectedIndex) + items.length) % items.length

  items[nextIndex].setAttribute('data-selected', 'true')
  items[nextIndex].setAttribute('aria-selected', 'true')
}

export { setSelected }

const getSelected = (list) => list.querySelector('[data-target-class="list-item"][data-selected="true"]')

export { getSelected }

const SelectList = (items, el, onSelect) => {
  const list = htmlToElement(`
    <ol class="list"></ol>
  `)

  items.forEach(item => {
    const listItem = htmlToElement('<li class="list-item" data-target-class="list-item" role="option" aria-selected="false"></li>')
    listItem.appendChild(item)
    listItem.addEventListener('click', () => {
      onSelect(listItem)
    })
    list.appendChild(listItem)
  })

  const firstItem = list.querySelector('[data-target-class="list-item"]')
  firstItem.setAttribute('data-selected', 'true')
  firstItem.setAttribute('aria-selected', 'true')

  return list
}

export default SelectList
