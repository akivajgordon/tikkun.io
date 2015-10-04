/*jslint browser: true */

(function (angular) {
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

    function newReferenceSet(spec) {
        var start = spec.start,
            end = spec.end,
            containsReference = function (reference) {
                return !reference.isBeforeReference(start) && reference.isBeforeReference(end);
            };

        return Object.freeze({
            containsReference: containsReference
        });
    }

    angular.module("tikkun")
        .factory("wordBreaker", function () {
            return function (text) {
                var PASEQ_RE = / ׀/g,
                    PASEQ_REPLACE = "#׀",
                    MAQAF_RE = /־/g,
                    MAQAF_REPLACE = "־ ";

                return text.replace(PASEQ_RE, PASEQ_REPLACE).replace(MAQAF_RE, MAQAF_REPLACE).split(/\s/);
            };
        })
        .factory("newLineBuilder", ["wordBreaker", function (wordBreaker) {
            var PASEQ = " ׀",
                PASEQ_REPLACE_RE = /#׀/g,
                MAQAF = "־",
                MAQAF_REPLACE_RE = /־ /g,
                NBSP = '\xa0',
                SETUMA = /\(ס\)/g,
                SETUMA_REPLACE = NBSP.repeat(15);

            return function (source, aliyotList, line, nextLine) {
                var includedVerses = (function () {
                        if (line.c === nextLine.c) {
                            return source[line.c - 1].slice(line.v - 1, nextLine.v);
                        }
                        return [].concat(source[line.c - 1].slice(line.v - 1), source[nextLine.c - 1].slice(0, nextLine.v));
                    }()),

                    // Because the PASEQ character counts as a word (since it is separated by spaces on either side), we need to replace it with a string that removes the preceding space. Later, re-replace the string to undo it.
                    allWordsFromIncludedVerses = wordBreaker(includedVerses.join(" ")),
                    lastVerseWordCount = wordBreaker(includedVerses[includedVerses.length - 1]).length,
                    allWordsInLine = allWordsFromIncludedVerses.slice(line.w - 1, -(lastVerseWordCount - nextLine.w  + 1)),

                    // ...and put back the original space-separated PASEQ
                    text = allWordsInLine.join(" ").replace(PASEQ_REPLACE_RE, PASEQ).replace(MAQAF_REPLACE_RE, MAQAF).replace(SETUMA, SETUMA_REPLACE),
                    theVerses = (function () {
                        var versesNumbers = [];

                        if (line.w === 1) {
                            versesNumbers.push(line.v);
                        }

                        if (line.v !== nextLine.v && nextLine.w > 1) {
                            versesNumbers.push(nextLine.v);
                        }

                        return versesNumbers;
                    }()),
                    aliyot = (function () {
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
                    }());

                return {
                    text: text,
                    verses: theVerses,
                    aliyot: aliyot
                };
            };
        }])
        .factory("newLine", function () {
            var PETUCHA = "(פ)";

            function newLine(spec) {
                var text = spec.text,
                    verses = spec.verses,
                    aliyot = spec.aliyot,
                    isPetucha = text.indexOf(PETUCHA) !== -1;

                return {
                    text: text,
                    verses: verses,
                    aliyot: aliyot,
                    isPetucha: isPetucha
                };
            }

            return newLine;
        })
        .factory("newPageBuilder", ["newLineBuilder", "newLine", function (newLineBuilder, newLine) {
            function newPageBuilder(spec) {

                var arrangement = spec.arrangement,
                    torahText = spec.torahText,
                    aliyot = spec.aliyot,
                    linesForPage = function (pageIndex) {
                        var thisColumn = arrangement[pageIndex],
                            nextColumn = arrangement[pageIndex + 1];

                        return thisColumn.map(function (lineStart, lineIndex, column) {
                            var nextLine = lineIndex + 1 < column.length ? column[lineIndex + 1] : nextColumn[0],
                                lineBuilder = newLineBuilder(torahText, aliyot, lineStart, nextLine);

                            return newLine({
                                text: lineBuilder.text,
                                verses: lineBuilder.verses,
                                aliyot: lineBuilder.aliyot
                            });
                        });
                    };

                return Object.freeze({
                    linesForPage: linesForPage
                });
            }

            return newPageBuilder;
        }])
        .factory("newPage", function () {
            function newPage(spec) {
                var lines = spec.lines;

                return {
                    lines: lines
                };
            }

            return newPage;
        })
        .factory("columnFetcher", ["$http", "newPageBuilder", "newPage", function ($http, newPageBuilder, newPage) {

            function newColumnFetcher() {
                var pageAtIndex = function (pageIndex, callback) {
                        // pageIndex = Math.min(Math.max(0, pageIndex), pages.length - 1);

                        $http.get("/data/tikkun-simanim.json").success(function (simanim) {
                            $http.get("/data/tanach/genesis.json").success(function (torah) {
                                $http.get("/data/aliyot.json").success(function (aliyot) {

                                    var pageBuilder = newPageBuilder({
                                            torahText: torah.text,
                                            arrangement: simanim,
                                            aliyot: aliyot
                                        }),
                                        page = newPage({
                                            lines: pageBuilder.linesForPage(pageIndex)
                                        });
                                    callback(page);
                                });
                            });
                        });
                    };

                return Object.freeze({
                    pageAtIndex: pageAtIndex
                });
            }

            return newColumnFetcher();
        }])
        .factory("pagesDataSource", ["columnFetcher", function (columnFetcher) {

            function newPagesDataSource(spec) {
                var startColumn = spec.startColumn,
                    pages = spec.pages,
                    append = function () {

                        columnFetcher.pageAtIndex(startColumn + pages.length, function (page) {
                            pages.push(page);
                        });
                    },
                    prepend = function () {
                        startColumn -= 1;
                        columnFetcher.pageAtIndex(startColumn, function (page) {
                            pages.unshift(page);
                        });
                    };

                return Object.freeze({
                    startColumn: startColumn,
                    pages: pages,
                    append: append,
                    prepend: prepend
                });
            }

            var spec = {
                startColumn: 1,
                pages: []
            };

            columnFetcher.pageAtIndex(1, function (page) {
                spec.pages.push(page);
            });

            return newPagesDataSource(spec);
        }]);
}(window.angular));
