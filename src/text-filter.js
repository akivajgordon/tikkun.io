const ketiv = (text) => text
  .replace('#(פ)', '')
  .split(' ')
  .map((maqafSeparatedWord) => maqafSeparatedWord
    .split('־')
    .map(word => {
      const parts = word.split('#')

      if (parts.length <= 1) {
        return parts[0]
      }

      return parts
        .slice(1)
        .map(bracketed => bracketed.slice(1, -1))
        .join(' ')
    })
    .join('־')
  )
  .join(' ')

const kri = (text) => text
  .replace(/־/g, ' ')
  .replace('#(פ)', '')
  .split(' ')
  .map((word) => {
    const parts = word.split('#')

    return parts[0]
  })
  .join(' ')
  .replace(/[^א-ת\s]/g, '')

module.exports = ({ text, annotated }) => annotated ? ketiv(text) : kri(text)
