import test from 'ava'

const textFilter = ({text}) => text
  .replace('#(פ)', '')
  .split(' ')
  .map((word) => {
    const parts = word.split('#')

    if (parts.length <= 1) {
      return parts[0]
    }

    return parts[1].slice(1, -1)
  })
  .join(' ')

test('simple annotated text remains untouched', t => {
  t.is(
    textFilter({
      text: 'בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃',
      annotated: true
    }),
    'בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃'
  )
})

test('annotated text removes PETUCHA', t => {
  t.is(
    textFilter({
      text: 'וַֽיְהִי־בֹ֖קֶר י֥וֹם אֶחָֽד׃#(פ)',
      annotated: true
    }),
    'וַֽיְהִי־בֹ֖קֶר י֥וֹם אֶחָֽד׃'
  )
})

test('annotated text shows KETIV version', t => {
  t.is(
    textFilter({
      text: 'וּבַבְּהֵמָ֛ה וּבְכָל־הָרֶ֛מֶשׂ הָרֹמֵ֥שׂ עַל־הָאָ֖רֶץ הוצא#[הַיְצֵ֣א] אִתָּ֑ךְ',
      annotated: true
    }),
    'וּבַבְּהֵמָ֛ה וּבְכָל־הָרֶ֛מֶשׂ הָרֹמֵ֥שׂ עַל־הָאָ֖רֶץ הַיְצֵ֣א אִתָּ֑ךְ'
  )
})
