/*jslint browser: true */

(function (angular) {
    "use strict";

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

            return function (source, line, nextLine) {
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
                    }());

                return {
                    text: text,
                    verses: theVerses,
                    aliyot: []
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
                    linesForPage = function (pageIndex) {
                        var thisColumn = arrangement[pageIndex],
                            nextColumn = arrangement[pageIndex + 1];

                        return thisColumn.map(function (lineStart, lineIndex, column) {
                            var nextLine = lineIndex + 1 < column.length ? column[lineIndex + 1] : nextColumn[0],
                                lineBuilder = newLineBuilder(torahText, lineStart, nextLine);

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

                                var pageBuilder = newPageBuilder({
                                        torahText: torah.text,
                                        arrangement: simanim
                                    }),
                                    page = newPage({
                                        lines: pageBuilder.linesForPage(pageIndex)
                                    });
                                callback(page);
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
