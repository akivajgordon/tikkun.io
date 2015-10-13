/*jslint browser: true */

(function (Tikkun) {
    "use strict";

    var newLine = Tikkun.Line,
        newReference = Tikkun.Reference,
        newReferenceSet = Tikkun.ReferenceSet,
        PASEQ = " ׀",
        PASEQ_REPLACE_RE = /#׀/g,
        MAQAF = "־",
        MAQAF_REPLACE_RE = /־ /g,
        NBSP = '\xa0',
        SETUMA = /\(ס\)/g,
        SETUMA_REPLACE = NBSP.repeat(15);

    function verseNumbersFromStartReferenceToEndReference(line, nextLine) {
        var versesNumbers = [];

        if (line.w === 1) {
            versesNumbers.push(line.v);
        }

        if (line.v !== nextLine.v && nextLine.w > 1) {
            versesNumbers.push(nextLine.v);
        }

        return versesNumbers;
    }

    function aliyotFromStartReferenceToEndReference(line, nextLine, aliyotList) {
        var parshiyot = aliyotList[line.b - 1],
            referenceSet = newReferenceSet({
                start: newReference({
                    book: line.b,
                    chapter: line.c,
                    verse: line.v,
                    word: line.w
                }),
                end: newReference({
                    book: nextLine.b,
                    chapter: nextLine.c,
                    verse: nextLine.v,
                    word: nextLine.w
                })
            }),
            result = [];

        parshiyot.some(function (parsha) {
            return parsha.some(function (aliyah, aliyahIndex) {
                var ref = newReference({
                    book: line.b,
                    chapter: aliyah.c,
                    verse: aliyah.v,
                    word: 1
                });

                if (referenceSet.containsReference(ref)) {
                    result.push(aliyahIndex + 1);
                    return true;
                }

                return false;
            });
        });

        return result;
    }

    function textFromStartReferenceToEndReference(line, nextLine, source, wordBreaker) {
        var includedVerses = (function () {
                if (line.c === nextLine.c) {
                    return source[line.c - 1].slice(line.v - 1, nextLine.v);
                }
                return [].concat(source[line.c - 1].slice(line.v - 1), source[nextLine.c - 1].slice(0, nextLine.v));
            }()),

            // Because the PASEQ character counts as a word (since it is separated by spaces on either side), we need to replace it with a string that removes the preceding space. Later, re-replace the string to undo it.
            allWordsFromIncludedVerses = wordBreaker(includedVerses.join(" ")),
            lastVerseWordCount = wordBreaker(includedVerses[includedVerses.length - 1]).length,
            allWordsInLine = allWordsFromIncludedVerses.slice(line.w - 1, -(lastVerseWordCount - nextLine.w  + 1));

            // ...and put back the original space-separated PASEQ
        return allWordsInLine.join(" ").replace(PASEQ_REPLACE_RE, PASEQ).replace(MAQAF_REPLACE_RE, MAQAF).replace(SETUMA, SETUMA_REPLACE);
    }

    function newLineBuilder(spec) {
        var source = spec.source,
            aliyotList = spec.aliyot,
            wordBreaker = spec.wordBreaker,
            lineFromStartReferenceToEndReference = function (line, nextLine) {
                return newLine({
                    text: textFromStartReferenceToEndReference(line, nextLine, source, wordBreaker),
                    verses: verseNumbersFromStartReferenceToEndReference(line, nextLine),
                    aliyot: aliyotFromStartReferenceToEndReference(line, nextLine, aliyotList)
                });
            };

        return Object.freeze({
            lineFromStartReferenceToEndReference: lineFromStartReferenceToEndReference
        });
    }

    Tikkun.LineBuilder = newLineBuilder;
}(window.Tikkun));
