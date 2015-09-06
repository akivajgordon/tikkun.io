/*jslint browser: true */
/*jslint nomen: true */
/*jslint plusplus: true */

(function () {
    "use strict";

    var BiblicalReference = window.Tikkun.BiblicalReference;

    function Arrangement(lineStarts) {
        this._lineStarts = lineStarts;
    }

    Arrangement.prototype.lineStarts = function () {
        return this._lineStarts;
    };

    Arrangement.prototype.columnIndexForBiblicalReference = function (biblicalReference) {

        var column,
            firstLine,
            lineStarts = this.lineStarts();

        for (column = 0; column < lineStarts.length; ++column) {
            firstLine = lineStarts[column][0];

            if (biblicalReference.isBeforeReference(new BiblicalReference(
                    firstLine.b,
                    firstLine.c,
                    firstLine.v,
                    firstLine.w
                )
                    )) {
                return column - 1;
            }
        }

        return -1;
    };

    window.Tikkun.Arrangement = Arrangement;
}());
