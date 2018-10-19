const hasEveryCharacterInOrder = needle => item => (new RegExp(needle
  .split('')
  .join('.*')
, 'i')).test(item)

const matchIndexes = (needle, match) => {
  const needleChars = needle.split('')
  const matchChars = match.split('')

  const indexes = []
  let needleIndex = 0

  for (let i = 0; i < matchChars.length; i++) {
    if (needleChars[needleIndex].toLowerCase() === matchChars[i].toLowerCase()) {
      indexes.push(i)
      ++needleIndex

      if (needleIndex >= needleChars.length) break
    }
  }

  return indexes
}

const indexScore = (needle, match) => {
  const indexes = matchIndexes(needle, match)

  return indexes
    .map(index => index - indexes[0])
    .reduce((a, b) => a + b)
}

module.exports = (haystack, needle) => haystack
  .filter(hasEveryCharacterInOrder(needle))
  .map(match => ({ indexes: matchIndexes(needle, match), string: match }))
  .sort((match, other) => {
    const matchScore = indexScore(needle, match.string)
    const otherScore = indexScore(needle, other.string)

    const score = matchScore - otherScore

    if (score === 0) {
      return match.indexes[0] - other.indexes[0]
    }

    return score
  })
