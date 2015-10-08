/*jslint browser: true */

(function (Tikkun) {
    "use strict";

    function newPagesDataSource(spec) {
        var columnFetcher = spec.columnFetcher,
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
            pageIndexContainingReference = function () {
                return 2;
            },
            goToParsha = function (parsha) {
                var ref = null,//parsha.startReference,
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
