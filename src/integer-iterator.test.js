import test from 'ava'

import IntegerIterator from './integer-iterator'

test('previous once returns 1 less than the start', (t) => {
  const sut = IntegerIterator.new({ startingAt: 0 })

  t.is(sut.previous(), -1)
})

test('previous twice returns 1 less each time', (t) => {
  const sut = IntegerIterator.new({ startingAt: 42 })

  t.is(sut.previous(), 41)
  t.is(sut.previous(), 40)
})

test('next multiple times returns 1 more each time', (t) => {
  const sut = IntegerIterator.new({ startingAt: -13 })

  t.is(sut.next(), -13)
  t.is(sut.next(), -12)
  t.is(sut.next(), -11)
})

test('interleaving previous and next always extends the values returned', (t) => {
  const sut = IntegerIterator.new({ startingAt: 0 })

  sut.previous()
  sut.next()
  sut.next()
  sut.previous()
  sut.next()

  t.is(sut.previous(), -3)
  t.is(sut.next(), 3)
})
