/*jslint browser: true */

(function (Tikkun) {
    "use strict";

    function newReference(spec) {
        var book = spec.book,
            chapter = spec.chapter,
            verse = spec.verse,
            word = spec.word,
            isBeforeReference = function (other) {
                if (book === other.book) {
                    if (chapter === other.chapter) {
                        if (verse === other.verse) {
                            return word < other.word;
                        }
                        return verse < other.verse;
                    }
                    return chapter < other.chapter;
                }
                return book < other.book;
            };

        return Object.freeze({
            book: book,
            chapter: chapter,
            verse: verse,
            word: word,
            isBeforeReference: isBeforeReference
        });
    }

    Tikkun.Reference = newReference;
}(window.Tikkun));
