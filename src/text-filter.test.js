import test from 'ava'
import textFilter from './text-filter'

test('simple annotated text remains untouched', (t) => {
  t.is(
    textFilter({
      text: 'בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃',
      annotated: true,
    }),
    'בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃',
  )
})

test('simple unannotated text removes everything but simple letters', (t) => {
  t.is(
    textFilter({
      text: 'בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃',
      annotated: false,
    }),
    'בראשית ברא אלהים את השמים ואת הארץ',
  )
})

test('annotated text removes PETUCHA', (t) => {
  t.is(
    textFilter({
      text: 'וַֽיְהִי־בֹ֖קֶר י֥וֹם אֶחָֽד׃#(פ)',
      annotated: true,
    }),
    'וַֽיְהִי־בֹ֖קֶר י֥וֹם אֶחָֽד׃',
  )
})

test('annotated text shows KETIV version', (t) => {
  t.is(
    textFilter({
      text: 'וּבַבְּהֵמָ֛ה וּבְכָל־הָרֶ֛מֶשׂ הָרֹמֵ֥שׂ עַל־הָאָ֖רֶץ הוצא#[הַיְצֵ֣א] אִתָּ֑ךְ',
      annotated: true,
    }),
    'וּבַבְּהֵמָ֛ה וּבְכָל־הָרֶ֛מֶשׂ הָרֹמֵ֥שׂ עַל־הָאָ֖רֶץ {הַיְצֵ֣א} אִתָּ֑ךְ',
  )
})

test('KRI replaces dashes with spaces', (t) => {
  t.is(
    textFilter({
      text: 'אֱלֹהִים֩ אֶת־חַיַּ֨ת הָאָ֜רֶץ לְמִינָ֗הּ וְאֶת־הַבְּהֵמָה֙ לְמִינָ֔הּ',
      annotated: false,
    }),
    'אלהים את חית הארץ למינה ואת הבהמה למינה',
  )
})

test('KRI removes PETUCHA', (t) => {
  t.is(
    textFilter({
      text: 'וַֽיְהִי־עֶ֥רֶב וַֽיְהִי־בֹ֖קֶר י֥וֹם הַשִּׁשִּֽׁי׃#(פ)',
      annotated: false,
    }),
    'ויהי ערב ויהי בקר יום הששי',
  )
})

test('unannotated text shows KRI version', (t) => {
  t.is(
    textFilter({
      text: 'וּבַבְּהֵמָ֛ה וּבְכָל־הָרֶ֛מֶשׂ הָרֹמֵ֥שׂ עַל־הָאָ֖רֶץ הוצא#[הַיְצֵ֣א] אִתָּ֑ךְ',
      annotated: false,
    }),
    'ובבהמה ובכל הרמש הרמש על הארץ הוצא אתך',
  )
})

test('KRI does not take parts from the KETIV', (t) => {
  t.is(
    textFilter({
      text: 'לֵאָ֖ה בגד#[בָּ֣א גָ֑ד] וַתִּקְרָ֥א אֶת־שְׁמ֖וֹ גָּֽד׃ וַתֵּ֗לֶד זִלְפָּה֙',
      annotated: false,
    }),
    'לאה בגד ותקרא את שמו גד ותלד זלפה',
  )
})

test('keeps SOF PASUK for KETIV', (t) => {
  t.is(
    textFilter({
      text: 'הַשָּׂדֶ֔ה וְצ֥וּדָה לִּ֖י צידה#[צָֽיִד]׃ וַעֲשֵׂה־לִ֨י מַטְעַמִּ֜ים כַּאֲשֶׁ֥ר',
      annotated: true,
    }),
    'הַשָּׂדֶ֔ה וְצ֥וּדָה לִּ֖י {צָֽיִד}׃ וַעֲשֵׂה־לִ֨י מַטְעַמִּ֜ים כַּאֲשֶׁ֥ר',
  )
})

test(`k'tiv word that separates into two k'ri words renders both on chumash side`, (t) => {
  t.is(
    textFilter({
      text: 'מֵרִבְבֹ֣ת קֹ֑דֶשׁ מִֽימִינ֕וֹ אשדת#[אֵ֥שׁ דָּ֖ת] לָֽמוֹ׃ אַ֚ף חֹבֵ֣ב',
      annotated: true,
    }),
    'מֵרִבְבֹ֣ת קֹ֑דֶשׁ מִֽימִינ֕וֹ {אֵ֥שׁ דָּ֖ת} לָֽמוֹ׃ אַ֚ף חֹבֵ֣ב',
  )
})

test('does not separate maqaf from adjacent word on kri boundary', (t) => {
  t.is(
    textFilter({
      text: 'בלק לך#[לכה-]נא אתי',
      annotated: true,
    }),
    'בלק {לכה-}נא אתי',
  )
})

test('separates maqaf from adjacent word on ketiv boundary', (t) => {
  t.is(
    textFilter({
      text: 'בלק לך#[לכה-]נא אתי',
      annotated: false,
    }),
    'בלק לך נא אתי',
  )
})

test(`keep first word of maqaf-separated phrase when the second word has k'tiv`, (t) => {
  t.is(
    textFilter({
      text: 'וְאֶת־בנו#[בָּנָ֖יו] לֹ֣א יָדָ֑ע כִּ֤י שָֽׁמְרוּ֙ אִמְרָתֶ֔ךָ וּבְרִֽיתְךָ֖ יִנְצֹֽרוּ׃',
      annotated: true,
    }),
    'וְאֶת־{בָּנָ֖יו} לֹ֣א יָדָ֑ע כִּ֤י שָֽׁמְרוּ֙ אִמְרָתֶ֔ךָ וּבְרִֽיתְךָ֖ יִנְצֹֽרוּ׃',
  )
})

test(`keeps kri words before nun-hafucha`, (t) => {
  t.is(
    textFilter({
      text: 'אַלְפֵ֥י יִשְׂרָאֵֽל׃#(׆)',
      annotated: true,
    }),
    'אַלְפֵ֥י יִשְׂרָאֵֽל׃ ׆',
  )
})

test(`shows nun-hafucha on torah side`, (t) => {
  t.is(
    textFilter({
      text: 'אַלְפֵ֥י יִשְׂרָאֵֽל׃#(׆)',
      annotated: false,
    }),
    'אלפי ישראל ׆',
  )
})

test.only(`converts ktiv & kri for multiple on the same line`, (t) => {
  const multiKtivKri =
    'הָעַמִּ֑ים וְלִהְי֨וֹת היהודיים#[הַיְּהוּדִ֤ים] עתודים#[עֲתִידִים֙] לַיּ֣וֹם הַזֶּ֔ה לְהִנָּקֵ֖ם'
  const actual = textFilter({
    text: multiKtivKri,
    annotated: true,
  })
  t.log(actual)
  t.is(
    actual,
    'הָעַמִּ֑ים וְלִהְי֨וֹת {הַיְּהוּדִ֤ים} {עֲתִידִים֙} לַיּ֣וֹם הַזֶּ֔ה לְהִנָּקֵ֖ם',
  )

  t.is(
    textFilter({ text: multiKtivKri, annotated: false }),
    'העמים ולהיות היהודיים עתודים ליום הזה להנקם',
  )
})
