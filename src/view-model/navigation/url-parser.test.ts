import test from 'ava'
import { generateUrl, parseUrl } from './url-parser.ts'
import { ScrollViewModel } from '../scroll-view-model.ts'
import { renderLine } from '../test-utils.ts'
import { LeiningGenerator } from '../../calendar-model/generator.ts'
import { UserSettings } from '../../calendar-model/user-settings.ts'

const testSettings: UserSettings = {
  ashkenazi: true,
  includeModernHolidays: false,
  israel: false,
}

const generator = new LeiningGenerator(testSettings)

test('non-URL input', async (t) => {
  t.falsy(parseUrl(generator, 'hello world'))
})

test('Empty URL', (t) => {
  t.falsy(parseUrl(generator, ''))
})

test('Ignores unrecognized URL types', (t) => {
  t.falsy(parseUrl(generator, '/kav/tzav'))
})

test('Invalid location reference: Not numbers', (t) => {
  t.falsy(parseUrl(generator, '/r/foo-bar-baz'))
})

test('Invalid location reference: incomplete', (t) => {
  t.falsy(parseUrl(generator, '/r/5-22'))
})

test('Next', (t) => {
  t.truthy(parseUrl(generator, '/next'))
})

test('Run ID for פרשת נצבים', async (t) => {
  t.snapshot(
    await renderStartingLine(
      parseUrl(generator, '/run/2025-09-20:shacharis,main')
    )
  )
})
test('Run ID for אסתר', async (t) => {
  t.snapshot(
    await renderStartingLine(
      parseUrl(generator, '/run/2025-03-14:megillah,megillah')
    )
  )
})

test('Valid location reference in במדבר', async (t) => {
  t.snapshot(await renderStartingLine(parseUrl(generator, '/r/4-13-1')))
})

test('Trailing slash okay', async (t) => {
  t.is(
    await renderStartingLine(parseUrl(generator, '/r/4-13-1/')),
    await renderStartingLine(parseUrl(generator, '/r/4-13-1'))
  )
})

test('Generated URLs round-trip', async (t) => {
  t.is(
    await renderStartingLine(
      parseUrl(
        generator,
        generateUrl(generator.parseId('2025-09-20:shacharis,main')!)
      )
    ),
    await renderStartingLine(
      parseUrl(generator, '/run/2025-09-20:shacharis,main')
    )
  )
})

test('Location references default to 1 if out of bounds', async (t) => {
  t.is(
    await renderStartingLine(parseUrl(generator, '/r/4-999-99/')),
    await renderStartingLine(parseUrl(generator, '/r/4-1-1'))
  )
})

async function renderStartingLine(model: ScrollViewModel | null) {
  if (!model) throw new Error(`URL did not parse.`)

  const { page, lineNumber } = await model.startingLocation
  if (page.type !== 'page') throw new Error('First page should be a page')
  return renderLine(page.lines[lineNumber - 1])
}
