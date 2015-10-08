/*jslint browser: true */

(function (Tikkun) {
    "use strict";

    function newPageBuilder(spec) {

        var arrangement = spec.arrangement,
            torahText = spec.torahText,
            aliyot = spec.aliyot,
            newLine = spec.newLine,
            newLineBuilder = spec.newLineBuilder,
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

    Tikkun.PageBuilder = newPageBuilder;
}(window.Tikkun));
