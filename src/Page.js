/*jslint browser: true */

(function (Tikkun) {
    "use strict";

    function newPage(spec) {
        var lines = spec.lines;

        return {
            lines: lines
        };
    }

    Tikkun.Page = newPage;
}(window.Tikkun));
