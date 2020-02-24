const toc = require('../build/table-of-contents.json')
const estherToc = require('../build/table-of-contents-esther.json')

module.exports = ({ ref: { b: book, c: chapter, v: verse }, scroll }) => {
  const { p: pageNumber, l: lineNumber } = (scroll === 'torah' ? toc : estherToc)[book][chapter][verse]

  return { pageNumber, lineNumber }
}
