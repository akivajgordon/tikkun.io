/*jslint browser: true */

(function (spec) {
    "use strict";

    var angular = spec.angular,
        newLine = spec.Tikkun.Line,
        newPage = spec.Tikkun.Page,
        newPageBuilder = spec.Tikkun.PageBuilder,
        newPagesDataSource = spec.Tikkun.PagesDataSource,
        newReference = spec.Tikkun.Reference,
        newReferenceSet = spec.Tikkun.ReferenceSet;

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
        .factory("columnFetcher", ["$http", "newLineBuilder", function ($http, newLineBuilder) {

            function newColumnFetcher() {
                var pageAtIndex = function (pageIndex, callback) {
                        // pageIndex = Math.min(Math.max(0, pageIndex), pages.length - 1);

                        $http.get("/data/tikkun-simanim.json").success(function (simanim) {
                            $http.get("/data/tanach/genesis.json").success(function (torah) {
                                $http.get("/data/aliyot.json").success(function (aliyot) {

                                    var pageBuilder = newPageBuilder({
                                            torahText: torah.text,
                                            arrangement: simanim,
                                            aliyot: aliyot,
                                            newLine: newLine,
                                            newLineBuilder: newLineBuilder
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

            var spec = {
                columnFetcher: columnFetcher,
                pages: [],
                startColumn: 1
            };

            columnFetcher.pageAtIndex(1, function (page) {
                spec.pages.push(page);
            });

            return newPagesDataSource(spec);
        }])
        .factory("parshiyotDataSource", ["$http", function ($http) {
            function newParshiyotDataSource() {
                var parshiyot = [];

                $http.get("/data/parshiyot.json").success(function (data) {
                    data.forEach(function (sefer) {
                        Array.prototype.push.apply(parshiyot, sefer);
                    });
                });

                return Object.freeze({
                    parshiyot: parshiyot
                });
            }

            return newParshiyotDataSource();
        }]);
}({
    angular: window.angular,
    Tikkun: window.Tikkun
}));
