const toc = require('../build/table-of-contents.json')
const estherToc = require('../build/table-of-contents-esther.json')
const holydaysToc = require('../build/table-of-contents-holydays.json')

const tocFromScroll = {
  torah: toc,
  esther: estherToc,
  ...holydaysToc
}

module.exports = ({ ref: { b: book, c: chapter, v: verse }, scroll }) => {
  const { p: pageNumber, l: lineNumber } = tocFromScroll[scroll][book][chapter][verse]

  return { pageNumber, lineNumber }
}
