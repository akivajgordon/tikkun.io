const { defaultRef, resolveToValidRef } = require('./location')

module.exports = (url) => {
  if (url instanceof URL) {
    const hashParts = url.hash.split('/').slice(1);
    if (hashParts.length > 0) {
      if ((hashParts[0] == 'r') && (hashParts[1].length > 0)) {
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
      }
    }
  }
  return defaultRef();
}
