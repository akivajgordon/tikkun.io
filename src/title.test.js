import test from 'ava'
import title from './title'

test('only one parsha displays it as a single parsha', (t) => {
  t.is(title(['Foo']), 'Foo')
})

test('multiple parshiyot displays it as a hyphen separated string', (t) => {
  t.is(title(['Bar', 'Baz']), 'Bar – Baz')
})
