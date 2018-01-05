const letters = [
    {glyph: 'א', value: 1},
    {glyph: 'ב', value: 2},
    {glyph: 'ג', value: 3},
    {glyph: 'ד', value: 4},
    {glyph: 'ה', value: 5},
    {glyph: 'ו', value: 6},
    {glyph: 'ז', value: 7},
    {glyph: 'ח', value: 8},
    {glyph: 'ט', value: 9},
    {glyph: 'י', value: 10},
    {glyph: 'כ', value: 20},
    {glyph: 'ל', value: 30},
    {glyph: 'מ', value: 40},
    {glyph: 'נ', value: 50},
    {glyph: 'ס', value: 60},
    {glyph: 'ע', value: 70},
    {glyph: 'פ', value: 80},
    {glyph: 'צ', value: 90},
    {glyph: 'ק', value: 100},
    {glyph: 'ר', value: 200},
    {glyph: 'ש', value: 300},
    {glyph: 'ת', value: 400}
]
  .reduce((map, letter) => Object.assign(map, {[letter.value]: letter.glyph}), {})

module.exports = (n) => letters[n]
