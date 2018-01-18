import test from 'ava'

const textFilter = require('./text-filter')

test('simple annotated text remains untouched', t => {
  t.is(
    textFilter({
      text: 'בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃',
      annotated: true
    }),
    'בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃'
  )
})

test('simple unannotated text removes everything but simple letters', t => {
  t.is(
    textFilter({
      text: 'בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃',
      annotated: false
    }),
    'בראשית ברא אלהים את השמים ואת הארץ'
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

test('KRI replaces dashes with spaces', t => {
  t.is(
    textFilter({
      text: 'אֱלֹהִים֩ אֶת־חַיַּ֨ת הָאָ֜רֶץ לְמִינָ֗הּ וְאֶת־הַבְּהֵמָה֙ לְמִינָ֔הּ',
      annotated: false
    }),
    'אלהים את חית הארץ למינה ואת הבהמה למינה'
  )
})

test('KRI removes PETUCHA', t => {
  t.is(
    textFilter({
      text: 'וַֽיְהִי־עֶ֥רֶב וַֽיְהִי־בֹ֖קֶר י֥וֹם הַשִּׁשִּֽׁי׃#(פ)',
      annotated: false
    }),
    'ויהי ערב ויהי בקר יום הששי'
  )
})

test('unannotated text shows KRI version', t => {
  t.is(
    textFilter({
      text: 'וּבַבְּהֵמָ֛ה וּבְכָל־הָרֶ֛מֶשׂ הָרֹמֵ֥שׂ עַל־הָאָ֖רֶץ הוצא#[הַיְצֵ֣א] אִתָּ֑ךְ',
      annotated: false
    }),
    'ובבהמה ובכל הרמש הרמש על הארץ הוצא אתך'
  )
})
