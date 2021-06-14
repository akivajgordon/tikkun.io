const { defaultRef, resolveToValidRef } = require('./location')
const parshiyot = require('../build/parshiyot.json')

const isURL = url => {
  try {
    new URL(url)
  } catch (e) {
    return false
  }

  return true
}

module.exports = _url => {
  if (!isURL(_url)) return defaultRef()

  const url = new URL(_url)

  const hashParts = url.hash.split('/').slice(1)

  if (hashParts.length > 0) {
    if ((hashParts[0] === 'r') && (hashParts[1].length > 0)) {
      const locationRegex = /(\d+)\-(\d+)-(\d+)/
      const locationMatch = hashParts[1].match(locationRegex)
      if (locationMatch) {
        return resolveToValidRef({
          scroll: 'torah',
          book: locationMatch[1],
          chapter: locationMatch[2],
          verse: locationMatch[3]
        })
      }
    } else if (hashParts[0] === 'p') {
      const found = parshiyot.find(({ he, en }) => {
        const decoded = decodeURIComponent(hashParts[1])

        const toLowercaseAlpha = str => str.toLowerCase().replace(/[^a-z]/g, '')

        return (he === decoded) || (toLowercaseAlpha(en) === toLowercaseAlpha(decoded))
      })

      if (!found) return defaultRef()

      const { b, c, v } = found.ref
      return { scroll: 'torah', b, c, v }
    }
  }

  return defaultRef()
}
