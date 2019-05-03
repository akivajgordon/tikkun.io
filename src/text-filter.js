const NUN_HAFUCHA = '׆'

const ketiv = (text) => text
  .replace('#(פ)', '')
  .replace(`#(${NUN_HAFUCHA})`, ` ${NUN_HAFUCHA}`)
  .split(' ')
  .map((maqafSeparatedWord) => maqafSeparatedWord
    .split('־')
    .map(word => {
      const parts = word.split('#')

      if (parts.length <= 1) {
        // i.e. there is no `#`, so just take the word
        return parts[0]
      }

      return `{${parts
        .slice(1)
        .map(bracketed => bracketed.slice(1, -1))
        .join(' ')}}`
    })
    .join('־')
  )
  .join(' ')

const kri = (text) => text
  .replace(/־/g, ' ')
  .replace('#(פ)', '')
  .replace(`#(${NUN_HAFUCHA})`, ` ${NUN_HAFUCHA}`)
  .split(' ')
  .map((word) => {
    const parts = word.split('#')

    return parts[0]
  })
  .join(' ')
  .replace(new RegExp(`[^א-ת\\s${NUN_HAFUCHA}]`, 'g'), '')

module.exports = ({ text, annotated }) => annotated ? ketiv(text) : kri(text)
