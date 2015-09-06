/*jslint browser: true */
/*jslint nomen: true */

(function () {
    "use strict";

    function TikkunColumn(rows) {
        this._rows = rows;
    }

    TikkunColumn.prototype.rows = function () {
        return this._rows;
    };

    window.TikkunColumn = TikkunColumn;
}());
