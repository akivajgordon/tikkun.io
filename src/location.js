const toc = require('../build/table-of-contents.json')
const estherToc = require('../build/table-of-contents-esther.json')
const rosh1Toc = require('../build/table-of-contents-rosh-1.json')
const rosh2Toc = require('../build/table-of-contents-rosh-2.json')

const tocFromScroll = {
  torah: toc,
  esther: estherToc,
  'rosh-1': rosh1Toc,
  'rosh-2': rosh2Toc
}

module.exports = ({ ref: { b: book, c: chapter, v: verse }, scroll }) => {
  const { p: pageNumber, l: lineNumber } = tocFromScroll[scroll][book][chapter][verse]

  return { pageNumber, lineNumber }
}
