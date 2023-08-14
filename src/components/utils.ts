const htmlToElement = (html: string) => {
  const template = document.createElement('template')
  html = html.trim() // Never return a text node of whitespace as the result
  template.innerHTML = html
  return template.content.firstElementChild
}

type KeyType = string | { key: string; ctrl: boolean }

const getKeys = (key: KeyType) => {
  if (typeof key === 'string') return { key, ctrl: false }

  return key
}

const whenKey =
  (key: KeyType, callback: (e: KeyboardEvent) => void) =>
  (e: KeyboardEvent) => {
    const { key: k, ctrl } = getKeys(key)

    if (e.ctrlKey === ctrl && e.key === k && !e.repeat) callback(e)
  }

const purgeNode = (node: Node) => {
  while (node.firstChild) node.removeChild(node.firstChild)
}

export default {
  htmlToElement,
  whenKey,
  purgeNode,
}
