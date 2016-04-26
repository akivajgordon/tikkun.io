/*jslint browser: true */

(function (Tikkun) {
    "use strict";

    var newReference = Tikkun.Reference;

    function newPagesDataSource(spec) {
        var arrangementDataSource = spec.arrangementDataSource,
            columnFetcher = spec.columnFetcher,
            pages = spec.pages,
            startColumn = spec.startColumn,
            append = function () {

                columnFetcher
                    .pageAtIndex(startColumn + pages.length)
                    .then(function (page) {
                        pages.push(page);
                    });
            },
            prepend = function () {
                startColumn -= 1;

                columnFetcher
                    .pageAtIndex(startColumn)
                    .then(function (page) {
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
                var ref = parsha.startReference,
                    index = pageIndexContainingReference(ref);

                index = 0;

                columnFetcher
                    .pageAtIndex(index)
                    .then(function (page) {
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
