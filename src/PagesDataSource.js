/*jslint browser: true */

(function (Tikkun) {
    "use strict";

    var newReference = Tikkun.Reference;

    function newPagesDataSource(spec) {
        var aliyotDataSource = spec.aliyotDataSource,
            arrangementDataSource = spec.arrangementDataSource,
            columnFetcher = spec.columnFetcher,
            parshiyotDataSource = spec.parshiyotDataSource,
            pages = spec.pages,
            startColumn = spec.startColumn,
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
            },
            pageIndexContainingReference = function (ref) {
                return arrangementDataSource.arrangement.findIndex(function (column) {
                    var firstLine = column[0];

                    return ref.isBeforeReference(newReference({
                        book: firstLine.b,
                        chapter: firstLine.c,
                        verse: firstLine.v,
                        word: firstLine.w
                    }));
                }) - 1;
            },
            goToParsha = function (parsha) {
                var ref = (function () {
                    var aliyot = Array.prototype.concat.apply([], aliyotDataSource.aliyot),
                        book = (function (index) {
                            // given a parsha index, return in which book (sefer) it resides
                            var parshiyotBookNumberStarts = parshiyotDataSource.parshiyot.map(function (sefer) {
                                return sefer.length; // e.g. [12, 13, 10, 10, 11]
                            }).map(function (bookCount, bookIndex, counts) {
                                if (bookIndex <= 0) {
                                    return bookCount;
                                }

                                return bookCount + counts[bookIndex - 1];
                            });

                            return parshiyotBookNumberStarts.map(function (bookNumberStart) {
                                return index < bookNumberStart;
                            }).indexOf(false) + 1;
                        }(parsha)),
                        aliyahStart = aliyot[parsha][0];

                    return newReference({
                        book: book,
                        chapter: aliyahStart.c,
                        verse: aliyahStart.v,
                        word: 1
                    });
                }()),
                    index = pageIndexContainingReference(ref);

                columnFetcher.pageAtIndex(index, function (page) {
                    startColumn = index;
                    pages.length = 0;
                    pages.push(page);
                });
            };

        return Object.freeze({
            startColumn: startColumn,
            pages: pages,
            append: append,
            prepend: prepend,
            goToParsha: goToParsha
        });
    }

    Tikkun.PagesDataSource = newPagesDataSource;
}(window.Tikkun));
