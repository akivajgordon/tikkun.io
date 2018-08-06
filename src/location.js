// import toc from '../build/table-of-contents.json'
const toc = require('../build/table-of-contents.json')

module.exports = ({ b: book, c: chapter, v: verse }) => {
  const { p: pageNumber, l: lineNumber } = toc[book][chapter][verse]

  return { pageNumber, lineNumber }
}
