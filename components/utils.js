const htmlToElement = (html) => {
  const template = document.createElement('template')
  html = html.trim() // Never return a text node of whitespace as the result
  template.innerHTML = html
  return template.content.firstChild
}

const whenKey = (key, callback) => e => {
  if (e.key === key) callback(e)
}

const purgeNode = (node) => {
  while (node.firstChild) node.removeChild(node.firstChild)
}

export default {
  htmlToElement,
  whenKey,
  purgeNode
}
