/*jslint browser: true */

(function (angular) {
    "use strict";

    angular.module("tikkun")
        .factory("lineBreaker", function () {
            var PASEQ = " ׀",
                PASEQ_RE = / ׀/g,
                PASEQ_REPLACE = "#׀",
                PASEQ_REPLACE_RE = /#׀/g,
                MAQAF = "־",
                MAQAF_RE = /־/g,
                MAQAF_REPLACE = "־ ",
                MAQAF_REPLACE_RE = /־ /g,
                PETUCHA = "(פ)";

            return function (torahText, arrangement, pageIndex) {

                var thisColumn = arrangement[pageIndex],
                    nextColumn = arrangement[pageIndex + 1],
                    lines = thisColumn.map(function (line, lineIndex, column) {
                        var nextLine = lineIndex + 1 < column.length ? column[lineIndex + 1] : nextColumn[0],
                            includedVerses = (function () {
                                if (line.c === nextLine.c) {
                                    return torahText[line.c - 1].slice(line.v - 1, nextLine.v);
                                }
                                return [].concat(torahText[line.c - 1].slice(line.v - 1), torahText[nextLine.c - 1].slice(0, nextLine.v));
                            }()),

                            // Because the PASEQ character counts as a word (since it is separated by spaces on either side), we need to replace it with a string that removes the preceding space. Later, re-replace the string to undo it.
                            allWordsFromIncludedVerses = includedVerses.join(" ").replace(PASEQ_RE, PASEQ_REPLACE).replace(MAQAF_RE, MAQAF_REPLACE).split(/\s/),
                            lastVerseWordCount = includedVerses[includedVerses.length - 1].replace(PASEQ_RE, PASEQ_REPLACE).replace(MAQAF_RE, MAQAF_REPLACE).split(/\s/).length,
                            allWordsInLine = allWordsFromIncludedVerses.slice(line.w - 1, -(lastVerseWordCount - nextLine.w  + 1)),

                            // ...and put back the original space-separated PASEQ
                            text = allWordsInLine.join(" ").replace(PASEQ_REPLACE_RE, PASEQ).replace(MAQAF_REPLACE_RE, MAQAF),
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
                            petucha = allWordsInLine.indexOf(PETUCHA) !== -1;

                        return {
                            text: text,
                            verses: theVerses,
                            aliyot: [],
                            petucha: petucha
                        };


                    });

                return lines;
            };
        })
        .factory("columnFetcher", ["$http", "lineBreaker", function ($http, lineBreaker) {

            function newColumnFetcher() {
                var pageAtIndex = function (pageIndex, callback) {
                        // pageIndex = Math.min(Math.max(0, pageIndex), pages.length - 1);

                        $http.get("/data/tikkun-simanim.json").success(function (simanim) {
                            $http.get("/data/tanach/genesis.json").success(function (torah) {

                                var page = lineBreaker(torah.text, simanim, pageIndex);
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
