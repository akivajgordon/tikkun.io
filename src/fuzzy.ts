const hasEveryCharacterInOrder = (needle: string) => (item: string) =>
  new RegExp(needle.split('').join('.*'), 'i').test(item)

const matchIndexes = (needle: string, match: string) => {
  const needleChars = needle.split('')
  const matchChars = match.split('')

  const indexes = []
  let needleIndex = 0

  for (let i = 0; i < matchChars.length; i++) {
    if (
      needleChars[needleIndex].toLowerCase() === matchChars[i].toLowerCase()
    ) {
      indexes.push(i)
      ++needleIndex

      if (needleIndex >= needleChars.length) break
    }
  }

  return indexes
}

const indexScore = (needle: string, match: string) => {
  const indexes = matchIndexes(needle, match)

  return indexes.map((index) => index - indexes[0]).reduce((a, b) => a + b, 0)
}

type SearchTerm = string
type GetSearchTermsFn<T> = (candidate: T) => SearchTerm[]

const bestMatch =
  <T>(needle: string, getSearchTerms: GetSearchTermsFn<T>) =>
  (candidate: T) => {
    const { minScore, index } = getSearchTerms(candidate)
      .map((term) =>
        hasEveryCharacterInOrder(needle)(term)
          ? indexScore(needle, term)
          : Infinity,
      )
      .reduce(
        ({ minScore, index }, score, i) => {
          if (score < minScore) return { minScore: score, index: i }

          return { minScore, index }
        },
        { minScore: Infinity, index: 0 },
      )

    if (!isFinite(minScore))
      return {
        item: candidate,
        score: minScore,
        match: { index: NaN, indexes: [] as number[] },
      }

    return {
      score: minScore,
      item: candidate,
      match: {
        index,
        indexes: matchIndexes(needle, getSearchTerms(candidate)[index]),
      },
    }
  }

export default <T extends object>(
  haystack: T[],
  needle: string,
  getSearchTerms: GetSearchTermsFn<T> = (x) => [x.toString()],
) =>
  haystack
    .map(bestMatch(needle, getSearchTerms))
    .filter(({ score }) => isFinite(score))
    .sort((match, other) => {
      const matchScore = match.score
      const otherScore = other.score

      const scoreDiff = matchScore - otherScore

      if (scoreDiff === 0) {
        return match.match.indexes[0] - other.match.indexes[0]
      }

      return scoreDiff
    })
