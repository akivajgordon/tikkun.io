const ancestorOf = (
  node: Node | HTMLElement,
  options: { matching: (n: typeof node) => n is HTMLElement },
): HTMLElement | null => {
  if (!node) return null

  if (options.matching(node)) return node

  return ancestorOf(node.parentNode, options)
}

// const onSelectionEnd = (callback: (selection: Selection) => void) => {
const onHighlightIntentComplete = (
  node: Node,
  callback: (selection: Selection) => void,
) => {
  let lastMouseUpAt: number
  let lastSelectionStartAt: number
  node.addEventListener('pointerup', () => {
    const previousLastMouseUp = lastMouseUpAt
    lastMouseUpAt = Date.now()
    if (lastSelectionStartAt > (previousLastMouseUp || 0)) {
      const selection = window.getSelection()
      if (selection.isCollapsed) return

      callback(selection)
    }
  })
  node.addEventListener('selectstart', () => {
    lastSelectionStartAt = Date.now()
  })
}

const book = document.querySelector('.tikkun-book')

export const watchForHighlighting = () =>
  onHighlightIntentComplete(book, (selection) => {
    const isLine = (node: Node | HTMLElement): node is HTMLElement =>
      'dataset' in node && node.dataset.class === 'line'
    const isPage = (node: Node | HTMLElement): node is HTMLElement => {
      if (!('classList' in node)) return false
      return [...node.classList].includes('tikkun-page')
    }

    const lineOf = (node: Node) => ancestorOf(node, { matching: isLine })
    const pageOf = (node: Node) => ancestorOf(node, { matching: isPage })

    const anchorLine = lineOf(selection.anchorNode)

    const focusLine = lineOf(selection.focusNode)

    const anchorPage = pageOf(anchorLine)
    const focusPage = pageOf(focusLine)

    const anchor = {
      page: (anchorPage && anchorPage.dataset['page-number']) || 0,
      line: anchorLine.dataset['line-index'],
      offset: selection.anchorOffset,
      node: selection.anchorNode,
    }
    const focus = {
      page: (focusPage && focusPage.dataset['page-number']) || 0,
      line: focusLine.dataset['line-index'],
      offset: selection.focusOffset,
      node: selection.focusNode,
    }

    let selectionStart = anchor
    let selectionEnd = focus

    if (
      focus.page < anchor.page ||
      (focus.page === anchor.page && focus.line < anchor.line) ||
      (focus.page === anchor.page &&
        focus.line === anchor.line &&
        focus.offset < anchor.offset)
    ) {
      selectionStart = focus
      selectionEnd = anchor
    }

    const startLine = lineOf(selectionStart.node)
    const endLine = lineOf(selectionEnd.node)

    const allLines = [
      ...startLine.parentElement.querySelectorAll<HTMLElement>(
        '[data-class=line]',
      ),
    ]

    const firstLineIndex = allLines.findIndex((node) => node === startLine)
    const lastLineIndex = allLines.findIndex((node) => node === endLine)

    const selectedLines = allLines.filter(
      (_node, index) => index >= firstLineIndex && index <= lastLineIndex,
    )

    const isStartAndEndSameNode = selectedLines.length === 1

    const fragmentOf = (line: HTMLElement) =>
      line.querySelector('.fragment.mod-annotations-on')

    const textContentOf = (line: HTMLElement) => fragmentOf(line).textContent

    const highlight = (line: HTMLElement, start: number, end: number) => {
      // return // can use this early return to "turn off" the highlighting feature until it's ready.
      const textContent = textContentOf(line)
      fragmentOf(line).innerHTML = [
        textContent.slice(0, start),
        `<mark style="background:orange; color:black;">${textContent.slice(
          start,
          end,
        )}</mark>`,
        textContent.slice(end),
      ].join('')
    }

    if (isStartAndEndSameNode) {
      highlight(selectedLines[0], selectionStart.offset, selectionEnd.offset)
    } else {
      highlight(
        selectedLines[0],
        selectionStart.offset,
        textContentOf(selectedLines[0]).length,
      )

      selectedLines
        .slice(1, -1)
        .forEach((line) => highlight(line, 0, textContentOf(line).length))

      highlight(selectedLines[selectedLines.length - 1], 0, selectionEnd.offset)
    }

    selection.collapseToEnd()

    // // SEE https://developer.mozilla.org/en-US/docs/Web/API/Selection/setBaseAndExtent FOR HOW TO PROGRAMMATICALLY SELECT TO EXTEND THE SELECTION TO WORD BOUNDARIES
    // console.log(selectionStart)
    // console.log(selectionEnd)
  })
