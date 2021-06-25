import test from 'ava'
import slugify from './slugify'

test('slugify lowercases all letters', t => {
  t.assert(slugify('HelLo') === 'hello')
})

test('hyphenates multiple words', t => {
  t.assert(slugify('Hello all the People') === 'hello-all-the-people')
})

test('collapses multiple spaces', t => {
  t.assert(slugify('multiple      spaces') === 'multiple-spaces')
})

test('removes non-alpha-numeric', t => {
  t.assert(slugify(`k33'#p*( )Th--_i#s`) === 'k33p-this')
})
