const NUN_HAFUCHA = '׆'

const ketiv = (text: string) =>
  text
    .replace('#(פ)', '')
    .replace(`(${NUN_HAFUCHA})#`, `${NUN_HAFUCHA} `)
    .replace(`#(${NUN_HAFUCHA})`, ` ${NUN_HAFUCHA}`)
    .split(' ')
    .map((maqafSeparatedWord) =>
      maqafSeparatedWord
        .split('־')
        .map((word) => {
          const parts = word.split('#')

          if (parts.length <= 1) {
            // i.e. there is no `#`, so just take the word
            return parts[0]
          }
          return parts.slice(1)
        })
        .join('־'),
    )
    .join(' ')
    .replace(/\[/g, '{')
    .replace(/\]/g, '}')

const kri = (text: string) =>
  text
    .replace('#(פ)', '')
    .replace(`(${NUN_HAFUCHA})#`, `${NUN_HAFUCHA} `)
    .replace(`#(${NUN_HAFUCHA})`, ` ${NUN_HAFUCHA}`)
    .replace(/־/g, ' ')
    .replace(/#\[.+?\]/g, ' ')
    .replace(new RegExp(`[^א-ת\\s${NUN_HAFUCHA}]`, 'g'), '')
    .replace(/\s{2,}/g, ' ')

export default ({ text, annotated }: { text: string; annotated: boolean }) =>
  annotated ? ketiv(text) : kri(text)
