import test from 'ava'
import { ScrollViewModel } from '../scroll-view-model.ts'
import { LeiningGenerator } from '../../calendar-model/generator.ts'
import { UserSettings } from '../../calendar-model/user-settings.ts'

const testSettings: UserSettings = {
  ashkenazi: true,
  includeModernHolidays: false,
  israel: false,
}

const generator = new LeiningGenerator(testSettings)

test('renders for בראשית', (t) => {
  const viewModel = ScrollViewModel.forId(
    generator,
    '2024-10-26:shacharis,main'
  )
  // TODO: Snapshot
  t.is(viewModel, viewModel)
})
